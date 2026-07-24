import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency, formatPercentage, cn } from '@/lib/utils';
import Sparkline from './Sparkline';

interface CoinCardProps {
  coin: CoinMarketData;
}

export default function CoinCard({ coin }: CoinCardProps) {
  const isPositive = (coin.price_change_percentage_24h ?? 0) >= 0;
  const sparklinePrices = coin.sparkline_in_7d?.price || [];

  return (
    <Link
      href={`/coins/${coin.id}`}
      className="group relative flex flex-col justify-between rounded-xl bg-[#1A1D26] p-4 border border-gray-800/80 transition-all duration-200 hover:border-gray-700 hover:bg-[#202430]"
    >
      {/* Top Row: Coin Info & Sparkline */}
      <div className="flex items-start justify-between gap-2 mb-6">
        <div className="flex items-center gap-3">
          <Image
            src={coin.image}
            alt={coin.name}
            width={36}
            height={36}
            className="rounded-full"
          />
          <div>
            <h4 className="font-bold text-white text-sm leading-snug group-hover:text-green-400 transition-colors">
              {coin.name}
            </h4>
            <span className="text-xs text-gray-500 font-medium uppercase">
              {coin.symbol}
            </span>
          </div>
        </div>

        {/* Mini Chart */}
        <div className="pt-1">
          <Sparkline data={sparklinePrices} isPositive={isPositive} width={90} height={36} />
        </div>
      </div>

      {/* Bottom Row: Price & Percentage Badge */}
      <div className="flex items-center justify-between mt-auto">
        <span className="text-base font-bold text-white">
          {formatCurrency(coin.current_price)}
        </span>

        <span
          className={cn(
            'inline-flex items-center gap-0.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
            isPositive
              ? 'bg-green-500/10 text-green-500 border border-green-500/20'
              : 'bg-red-500/10 text-red-500 border border-red-500/20'
          )}
        >
          {isPositive ? '+' : ''}
          {formatPercentage(coin.price_change_percentage_24h ?? 0)}
        </span>
      </div>
    </Link>
  );
}