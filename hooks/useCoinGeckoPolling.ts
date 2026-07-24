'use client';

import { useEffect, useState } from 'react';
import { fetcher } from '@/lib/coingecko.actions';

interface UseCoinGeckoPollingProps {
  coinId: string;
  poolId?: string; // Swapped back to poolId to match LiveDataWrapper
  intervalMs?: number;
}

export const useCoinGeckoPolling = ({
  coinId,
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

        // 3. Fetch On-Chain Trades (Fixed logic)

        let tradesReq: Promise<any> = Promise.resolve(null);

        // Split the poolId (e.g., "eth_0x123") into network ("eth") and address ("0x123")
        const network = poolId?.split('_')[0];
        const address = poolId?.split('_')[1];

        if (network && address) {
          tradesReq = fetch(
            `https://api.geckoterminal.com/api/v2/networks/${network}/pools/${address}/trades`,
          )
            .then((res) => (res.ok ? res.json() : null))
            .catch(() => null);
        }

        const [priceRes, ohlcRes, tradesRes] = await Promise.all([priceReq, ohlcReq, tradesReq]);

        if (isMounted) {
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

          if (ohlcRes && ohlcRes.length > 0) {
            setOhlcv(ohlcRes[ohlcRes.length - 1]);
          }

          // Process Trades
          if (tradesRes?.data) {
            const formattedTrades: Trade[] = tradesRes.data
              .map((trade: any) => ({
                price: parseFloat(trade.attributes.price_in_usd),
                value: parseFloat(trade.attributes.volume_in_usd),
                timestamp: new Date(trade.attributes.block_timestamp).getTime(),
                type: trade.attributes.kind,
                amount: parseFloat(trade.attributes.to_token_amount),
              }))
              .slice(0, 7);

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
  }, [coinId, poolId, intervalMs]);

  return { price, trades, ohlcv, isConnected: isPolling };
};
