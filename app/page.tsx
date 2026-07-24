import React, { Suspense } from 'react';
import CoinOverview from '@/components/home/CoinOverview';
import TrendingCoins from '@/components/home/TrendingCoins';
import {
  CategoriesFallback,
  CoinOverviewFallback,
  TrendingCoinsFallback,
} from '@/components/home/fallback';
import { fetcher } from '@/lib/coingecko.actions';
import Categories from '@/components/home/Categories';
import CoinCard from '@/components/CoinCard';

const Page = async () => {
  const featuredCoins = await fetcher<CoinMarketData[]>('/coins/markets', {
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: 4,
    page: 1,
    sparkline: 'true', 
    price_change_percentage: '24h',
  });


  return (
    <main className="main-container">
      <section className="home-grid">
        <Suspense fallback={<CoinOverviewFallback />}>
          <CoinOverview />
        </Suspense>

        <Suspense fallback={<TrendingCoinsFallback />}>
          <TrendingCoins />
        </Suspense>
      </section>

      <section className="w-full">
        {/* 4-Column Grid for Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredCoins.map((coin) => (
            <CoinCard key={coin.id} coin={coin} />
          ))}
        </div>    
      </section>

      <section className="w-full mt-7 space-y-4">
        <Suspense fallback={<CategoriesFallback />}>
          <Categories />
        </Suspense>
      </section>
    </main>
  );
};

export default Page;
