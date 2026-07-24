'use client';

import { useEffect, useState } from 'react';
import { fetcher } from '@/lib/coingecko.actions';

interface UseCoinGeckoPollingProps {
  coinId: string;
  symbol: string; // <-- Make sure to pass this prop from your component!
  poolId?: string;
  intervalMs?: number;
}

export const useCoinGeckoPolling = ({
  coinId,
  symbol,
  poolId,
  intervalMs = 15000, 
}: UseCoinGeckoPollingProps) => {
  const [price, setPrice] = useState<ExtendedPriceData | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [ohlcv, setOhlcv] = useState<OHLCData | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchAllData = async () => {
      setIsPolling(true);
      
      try {
        const priceReq = fetcher<Record<string, any>>(`/simple/price`, {
          ids: coinId,
          vs_currencies: 'usd',
          include_24hr_vol: 'true',
          include_24hr_change: 'true',
          include_market_cap: 'true',
        });

        const ohlcReq = fetcher<OHLCData[]>(`/coins/${coinId}/ohlc`, {
          vs_currency: 'usd',
          days: 1, 
        });

        // 3. Fetch On-Chain Trades (GeckoTerminal for DEX, Binance for CEX)
        let tradesReq: Promise<any> = Promise.resolve(null);
        let isBinance = false;
        
        const network = poolId?.split('_')[0];
        const address = poolId?.split('_')[1];

        if (network && address) {
          // Use GeckoTerminal for DEX tokens 
          tradesReq = fetch(
            `https://api.geckoterminal.com/api/v2/networks/${network}/pools/${address}/trades`
          ).then((res) => (res.ok ? res.json() : null)).catch(() => null);
        } else if (symbol) {
          // Fallback to Binance API for Native L1s
          const formattedSymbol = `${symbol.toUpperCase()}USDT`; 
          isBinance = true;
          tradesReq = fetch(
            `https://api.binance.com/api/v3/trades?symbol=${formattedSymbol}&limit=7`
          ).then((res) => (res.ok ? res.json() : null)).catch(() => null);
        }

        const [priceRes, ohlcRes, tradesRes] = await Promise.all([priceReq, ohlcReq, tradesReq]);

        if (isMounted) {
          // Process Price
          if (priceRes && priceRes[coinId]) {
            const data = priceRes[coinId];
            setPrice({
              usd: data.usd,
              coin: coinId,
              price: data.usd.toString(),
              change24h: data.usd_24h_change,
              marketCap: data.usd_market_cap,
              volume24h: data.usd_24h_vol,
              timestamp: Date.now(),
            });
          }

          // Process OHLC
          if (ohlcRes && ohlcRes.length > 0) {
            setOhlcv(ohlcRes[ohlcRes.length - 1]);
          }

          // Process Trades
          if (tradesRes) {
            let formattedTrades: Trade[] = [];

            if (!isBinance && tradesRes.data) {
              // GeckoTerminal JSON:API Mapping
              formattedTrades = tradesRes.data.map((trade: any) => ({
                price: parseFloat(trade.attributes.price_in_usd),
                value: parseFloat(trade.attributes.volume_in_usd),
                timestamp: new Date(trade.attributes.block_timestamp).getTime(),
                type: trade.attributes.kind, 
                amount: parseFloat(trade.attributes.to_token_amount),
              })).slice(0, 7);
            } else if (isBinance && Array.isArray(tradesRes)) {
              // Binance REST API Mapping
              formattedTrades = tradesRes.map((trade: any) => ({
                price: parseFloat(trade.price), 
                value: parseFloat(trade.quoteQty), 
                timestamp: trade.time, 
                type: trade.isBuyerMaker ? 'sell' : 'buy', 
                amount: parseFloat(trade.qty), 
              }));
              // Binance returns oldest trades first, so we reverse it to show newest at the top
              formattedTrades.reverse(); 
            }
            
            setTrades(formattedTrades);
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    fetchAllData();
    const intervalId = setInterval(fetchAllData, intervalMs);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [coinId, symbol, poolId, intervalMs]);

  return { price, trades, ohlcv, isConnected: isPolling };
};