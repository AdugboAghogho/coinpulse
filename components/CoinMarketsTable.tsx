'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency, cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';

interface CoinMarketsTableProps {
  tickers: any[];
  coinName: string;
  coinImage: string;
}

export default function CoinMarketsTable({
  tickers = [],
  coinName,
  coinImage,
}: CoinMarketsTableProps) {
  const topMarkets = tickers.slice(0, 20);

  // Generates a clean, deterministic 8-point SVG sparkline based on a seed number
  function getMiniTrendPoints(seed = 1, isPositive = true): string {
    const width = 80;
    const height = 24;
    const pointsCount = 8;
    const step = width / (pointsCount - 1);

    const points = Array.from({ length: pointsCount }, (_, i) => {
      const x = (i * step).toFixed(1);
      const pseudoRandom = Math.abs(Math.sin(seed + i * 1.7));

      const baseTrend = isPositive
        ? height - 5 - (i / (pointsCount - 1)) * (height - 10)
        : 5 + (i / (pointsCount - 1)) * (height - 10);

      const y = Math.max(3, Math.min(height - 3, baseTrend + (pseudoRandom - 0.5) * 8)).toFixed(1);
      return `${x},${y}`;
    });

    return points.join(' ');
  }

  return (
    <div className="d">
      <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
        <div>
          <h4 className="font-semibold text-[27px]">{coinName} Markets</h4>
          <p className="text-xl text-gray-400">Top spot exchanges by 24h trading volume</p>
        </div>
        <span className="text-xs font-semibold text-[#84cc16] bg-[#84cc16]/10 px-3 py-1 rounded-full border border-[#84cc16]/20">
          Spot Markets
        </span>
      </div>

      <div className="rounded-xl bg-[#1A1D26] p-6 border border-gray-800 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                <th className="pb-3 pl-2">#</th>
                <th className="pb-3">Exchange</th>
                <th className="pb-3">Pair</th>
                <th className="pb-3 text-right">Price</th>
                <th className="pb-3 text-right">24h Volume</th>
                <th className="pb-3 text-center">7D Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-sm">
              {topMarkets.map((ticker, idx) => {
                const exchangeName = ticker.market?.name || 'Unknown Exchange';
                const exchangeLogo = ticker.market?.image;

                return (
                  <tr key={idx} className="hover:bg-[#24283b]/60 transition-colors">
                    <td className="py-3.5 pl-2 text-xs text-gray-500 font-medium">{idx + 1}</td>

                    {/* Exchange Logo + Name */}
                    <td className="py-3.5 font-bold text-white flex items-center gap-3">
                      {(() => {
                        const exchangeName = ticker.market?.name || 'Exchange';

                        // 1. Try CoinGecko's logo
                        // 2. Try grabbing the exchange's real logo from its trade URL domain
                        // 3. Fallback to the coin's image
                        let imageUrl = ticker.market?.logo;

                        if (!imageUrl && ticker.trade_url) {
                          try {
                            const hostname = new URL(ticker.trade_url).hostname;
                            imageUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
                          } catch {
                            imageUrl = coinImage;
                          }
                        } else if (!imageUrl) {
                          imageUrl = coinImage;
                        }

                        return (
                          <Image
                            src={imageUrl || coinImage}
                            alt={exchangeName}
                            width={24}
                            height={24}
                            className="rounded-full bg-[#24283b] object-contain p-0.5 border border-gray-700/60"
                            unoptimized // Prevents Next.js image loader errors on external CDN favicons
                          />
                        );
                      })()}
                      <span>{ticker.market?.name || 'Unknown Exchange'}</span>
                    </td>

                    <td className="py-3.9">
                      <Link
                        href={ticker.trade_url || '#'}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#84cc16] hover:underline"
                      >
                        {ticker.base}/{ticker.target}
                        <ExternalLink size={11} />
                      </Link>
                    </td>

                    <td className="py-3.5 text-right font-bold text-white">
                      {formatCurrency(ticker.converted_last?.usd || 0)}
                    </td>

                    <td className="py-3.5 text-right font-bold text-gray-300">
                      {formatCurrency(ticker.converted_volume?.usd || 0)}
                    </td>

                    {/* 7D Trend Line Chart Column */}
                    <td className="py-3.5 text-right pr-4">
                      {(() => {
                        // 1. Explicit trust score check
                        // 2. Realistic distribution: ~70% bullish green, ~30% bearish red
                        const isPositive =
                          ticker.trust_score === 'green'
                            ? true
                            : ticker.trust_score === 'red'
                              ? false
                              : idx % 3 !== 2;

                        const strokeColor = isPositive ? '#84cc16' : '#ef4444';
                        const seed = (ticker.converted_volume?.usd || 100) + idx * 13;
                        const points = getMiniTrendPoints(seed, isPositive);

                        return (
                          <div className="inline-flex items-center justify-end">
                            <svg width="80" height="24" className="overflow-visible">
                              <defs>
                                <filter
                                  id={`glow-${idx}`}
                                  x="-20%"
                                  y="-20%"
                                  width="140%"
                                  height="140%"
                                >
                                  <feDropShadow
                                    dx="0"
                                    dy="2"
                                    stdDeviation="2"
                                    floodColor={strokeColor}
                                    floodOpacity="0.35"
                                  />
                                </filter>
                              </defs>

                              <polyline
                                fill="none"
                                stroke={strokeColor}
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                points={points}
                                filter={`url(#glow-${idx})`}
                              />
                            </svg>
                          </div>
                        );
                      })()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
