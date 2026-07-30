import { fetcher } from '@/lib/coingecko.actions';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency, formatPercentage, cn } from '@/lib/utils';

interface SimilarCoinsProps {
  currentCoinId: string;
  categories?: string[];
}

export default async function SimilarCoins({ currentCoinId, categories = [] }: SimilarCoinsProps) {
  let similarCoins: CoinMarketData[] = [];

  const primaryCategory = categories?.[0];
  const categoryId = primaryCategory
    ? primaryCategory
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    : '';

  if (categoryId) {
    try {
      const res = await fetcher<CoinMarketData[]>('/coins/markets', {
        vs_currency: 'usd',
        category: categoryId,
        order: 'market_cap_desc',
        per_page: 6,
        sparkline: 'false',
        price_change_percentage: '24h',
      });
      if (res && Array.isArray(res)) {
        similarCoins = res.filter((coin) => coin.id !== currentCoinId).slice(0, 5);
      }
    } catch {}
  }

  if (similarCoins.length === 0) {
    try {
      const res = await fetcher<CoinMarketData[]>('/coins/markets', {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 6,
        sparkline: 'false',
        price_change_percentage: '24h',
      });
      if (res && Array.isArray(res)) {
        similarCoins = res.filter((coin) => coin.id !== currentCoinId).slice(0, 10);
      }
    } catch (e) {
      console.error('Failed to fetch fallback similar coins:', e);
    }
  }

  if (similarCoins.length === 0) return null;

  return (
    <div className="mt-6">
      <h4 className="font-semibold text-[27px]">Similar Coins</h4>

      <div className="similar-coins rounded-xl bg-[#1a1d26] p-5 mt-4">
        <ul className="flex flex-col gap-3">
          {similarCoins.map((coin) => {
            const isTrendingUp = (coin.price_change_percentage_24h ?? 0) > 0;

            return (
              <li key={coin.id} className="flex items-center justify-between py-1">
                <Link
                  href={`/coins/${coin.id}`}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <Image
                    src={coin.image}
                    alt={coin.name}
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-bold text-white text-sm leading-tight">{coin.name}</p>
                    <p className="text-xs text-gray-400">{coin.symbol.toUpperCase()}</p>
                  </div>
                </Link>

                <div className="flex items-center gap-9 text-right">
                  <span
                    className={cn(
                      'text-xs font-bold',
                      isTrendingUp ? 'text-green-500' : 'text-red-500',
                    )}
                  >
                    {isTrendingUp ? '+' : ''}
                    {formatPercentage(coin.price_change_percentage_24h ?? 0)}
                  </span>
                  <span className="font-bold text-white text-sm min-w-[70px]">
                    {formatCurrency(coin.current_price)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
