'use client';

import { Separator } from '@/components/ui/separator';
import CandlestickChart from '@/components/CandlestickChart';
import { useCoinGeckoPolling } from '@/hooks/useCoinGeckoPolling';
import DataTable from '@/components/DataTable';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { useState } from 'react';
import CoinHeader from '@/components/CoinHeader';
import ChartToolbar from '@/components/ChartToolbar';

const LiveDataWrapper = ({ children, coinId, poolId, coin, coinOHLCData }: LiveDataProps) => {
  const [liveInterval, setLiveInterval] = useState<'1s' | '1m'>('1s');

  const [chartType, setChartType] = useState<'candle' | 'line'>('candle');

  const { trades, ohlcv, price } = useCoinGeckoPolling({
    coinId,
    symbol: coin.symbol,
    poolId,
    intervalMs: 15000,
  });

  const handleBuyClick = () => {
    // Action when user clicks "Buy": e.g. scroll to markets or trigger deposit modal
    console.log(`Buy clicked for ${coin.symbol}`);
  };

  const tradeColumns: DataTableColumn<Trade>[] = [
    {
      header: 'Price',
      cellClassName: 'price-cell font-bold text-white',
      cell: (trade) => {
        // Uses trade.price, or calculates (value / amount) as a fallback
        const unitPrice =
          trade.price || (trade.value && trade.amount ? trade.value / trade.amount : 0);

        return unitPrice ? (
          <span className="font-bold text-white">{formatCurrency(unitPrice)}</span>
        ) : (
          '-'
        );
      },
    },
    {
      header: 'Amount',
      cellClassName: 'amount-cell',
      cell: (trade) => (trade.amount !== undefined ? trade.amount.toFixed(4) : '-'),
    },
    {
      header: 'Value',
      cellClassName: 'value-cell font-bold',
      cell: (trade) => (trade.value ? formatCurrency(trade.value) : '-'),
    },
    {
      header: 'Buy/Sell',
      cellClassName: 'type-cell',
      cell: (trade) => {
        // Accepts both 'buy' and 'b' to cover all API sources
        const isBuy = trade.type === 'buy' || trade.type === 'b';
        return (
          <span className={isBuy ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}>
            {isBuy ? 'Buy' : 'Sell'}
          </span>
        );
      },
    },
    {
      header: 'Time',
      cellClassName: 'time-cell',
      cell: (trade) => (trade.timestamp ? timeAgo(trade.timestamp) : '-'),
    },
  ];

  return (
    <section id="live-data-wrapper">
      <CoinHeader
        name={coin.name}
        image={coin.image.large}
        livePrice={price?.usd ?? coin.market_data.current_price.usd}
        livePriceChangePercentage24h={
          price?.change24h ?? coin.market_data.price_change_percentage_24h_in_currency.usd
        }
        priceChangePercentage30d={coin.market_data.price_change_percentage_30d_in_currency.usd}
        priceChange24h={coin.market_data.price_change_24h_in_currency.usd}
      />
      <Separator className="divider" />

      <div className="trend">
        <ChartToolbar
          coinSymbol={coin.symbol}
          chartType={chartType}
          onChartTypeChange={setChartType}
          onBuyClick={handleBuyClick}
        />

        <CandlestickChart
          coinId={coinId}
          data={coinOHLCData}
          liveOhlcv={ohlcv}
          mode="live"
          chartType={chartType}
          initialPeriod="daily"
          liveInterval={liveInterval}
          setLiveInterval={setLiveInterval}
        >
          <h4>Trend Overview</h4>
        </CandlestickChart>
      </div>

      <Separator className="divider" />

      {tradeColumns && (
        <div className="trades">
          <h4>Recent Trades</h4>

          <DataTable
            columns={tradeColumns}
            data={trades}
            rowKey={(_, index) => index}
            tableClassName="trades-table"
          />
        </div>
      )}
    </section>
  );
};

export default LiveDataWrapper;
