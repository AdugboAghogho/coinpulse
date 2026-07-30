'use client';

import {
  CandlestickChart as CandleIcon,
  CoinsIcon,
  LineChart as LineIcon,
  ShoppingBag,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ChartToolbarProps {
  coinSymbol: string;
  chartType: 'candle' | 'line';
  onChartTypeChange: (type: 'candle' | 'line') => void;
  onBuyClick?: () => void;
}

export default function ChartToolbar({
  coinSymbol,
  chartType,
  onChartTypeChange,
  onBuyClick,
}: ChartToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-4 mb-4">
      {/* Left Side: Chart Type Toggle */}
      <div className="flex items-center gap-1 bg-[#24283b] p-1 rounded-lg border border-gray-800">
        <button
          onClick={() => onChartTypeChange('candle')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer',
            chartType === 'candle'
              ? 'bg-[#1A1D26] text-[#76da44] shadow-sm border border-gray-700'
              : 'text-gray-400 hover:text-white',
          )}
        >
          <CandleIcon size={14} />
          Candlesticks
        </button>

        <button
          onClick={() => onChartTypeChange('line')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer',
            chartType === 'line'
              ? 'bg-[#1A1D26] text-[#76da44] shadow-sm border border-gray-700'
              : 'text-gray-400 hover:text-white',
          )}
        >
          <LineIcon size={14} />
          Line
        </button>
      </div>

      {/* Right Side: Buy Button */}
      <div className="flex items-center gap-3">
        <Link href="/profile">
          <button
            onClick={onBuyClick}
            className="flex items-center gap-2 rounded-lg bg-[#76da44] px-5 py-2 font-bold text-black hover:bg-[#65a30d] transition-all shadow-[0_0_15px_rgba(132,204,22,0.2)] cursor-pointer text-sm"
          >
            <CoinsIcon size={16} />
            Buy {coinSymbol.toUpperCase()}
          </button>
        </Link>
      </div>
    </div>
  );
}
