'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, Loader2, TrendingDown, TrendingUp } from 'lucide-react';
import { fetcher } from '@/lib/coingecko.actions';
import { formatCurrency, formatPercentage, cn } from '@/lib/utils';

interface SearchModalProps {
  onClose: () => void;
}

export default function SearchModal({ onClose }: SearchModalProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [trendingCoins, setTrendingCoins] = useState<TrendingCoin[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Fetch Real Trending Coins on Modal Mount
  useEffect(() => {
    const fetchTrending = async () => {
      setIsLoading(true);
      try {
        const data = await fetcher<{ coins: TrendingCoin[] }>('/search/trending');
        setTrendingCoins(data?.coins || []);
      } catch (error) {
        console.error('Failed to fetch trending coins in search modal:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrending();
  }, []);

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
        setIsSearched(false);
        setSearchResults([]);
        return;
        }

        setIsLoading(true);
        setIsSearched(true);
        try {
            const data = await fetcher<{ coins: any[] }>('/search', { query: searchTerm.trim() });
            setSearchResults(data?.coins || []);
            } catch (error) {
            console.error('Failed to fetch search results:', error);
            } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

  // Navigate to coin page and close modal on item click
  const handleSelectCoin = (coinId: string) => {
    onClose();
    router.push(`/coins/${coinId}`);
  };

  // Reset to trending view if input is completely cleared
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value === '') {
      setIsSearched(false);
      setSearchResults([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-xl bg-[#1A1D26] p-6 shadow-2xl border border-gray-800 z-10">
        
        <div className="flex items-center gap-4 border-b border-gray-800 pb-6 mt-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search for a token by name or symbol"
              className="w-full bg-transparent text-lg text-white placeholder:text-gray-500 outline-none border-l-2 border-green-500 pl-3"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // Listen for Enter key
              autoFocus
            />
          </div>
          <button 
            onClick={handleSearch} // Trigger search on click
            className="flex items-center gap-2 rounded-md bg-[#84cc16] px-6 py-2 font-bold text-black cursor-pointer hover:bg-[#65a30d] transition-colors"
          >
            <Search size={18} />
            Search
          </button>
        </div>

        {/* Results Area */}
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-400 mb-4">
            {isSearched ? 'Search Results' : 'Trending assets'}
          </p>

          <div className="max-h-[380px] overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:#374151_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
            {isLoading ? (
              <div className="flex items-center justify-center py-12 text-gray-400 gap-2">
                <Loader2 className="animate-spin" size={20} />
                <h3>Loading...</h3>
              </div>
            ) : isSearched ? (
              searchResults.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {searchResults.slice(0, 15).map((coin) => (
                    <li
                      key={coin.id}
                      onClick={() => handleSelectCoin(coin.id)}
                      className="flex items-center justify-between rounded-lg bg-[#24283b] p-4 transition-colors hover:bg-gray-800 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={coin.large || coin.thumb}
                          alt={coin.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <h3 className="font-bold text-white">{coin.name}</h3>
                        <h3 className="text-semibold text-gray-400">({coin.symbol?.toUpperCase()})</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <h3 className="text-bold text-gray-400 bg-gray-800/80 border border-gray-700/50 px-2 py-1 rounded">
                          Rank #{coin.market_cap_rank ?? '-'}
                        </h3>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center py-10 text-gray-400 text-sm">
                  No tokens found matching "{searchTerm}"
                </p>
              )
            ) : (
              /* Real Trending Coins List */
              <ul className="flex flex-col gap-2">
                {trendingCoins.slice(0, 10).map((coin) => {
                  const item = coin.item;
                  const priceChange = item.data?.price_change_percentage_24h?.usd;
                  const isTrendingUp = priceChange ? priceChange > 0 : false;

                  return (
                    <li
                      key={item.id}
                      onClick={() => handleSelectCoin(item.id)}
                      className="flex items-center justify-between rounded-lg bg-[#24283b] p-4 transition-colors hover:bg-gray-800 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={item.large || item.thumb}
                          alt={item.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <h3 className="font-bold text-white">{item.name}</h3>
                        <h3 className="text-semibold text-gray-400">({item.symbol?.toUpperCase()})</h3>
                      </div>

                      <div className="flex items-center gap-6">
                        <h4 className="font-bold text-white">
                          {item.data?.price ? formatCurrency(item.data.price) : '-'}
                        </h4>
                        {priceChange !== undefined && (
                          <h4
                            className={cn(
                              'font-medium text-sm flex items-center gap-1',
                              isTrendingUp ? 'text-green-500' : 'text-red-500'
                            )}
                          >
                            {isTrendingUp ? (
                                <TrendingUp width={16} height={16} />
                            ) : (
                                <TrendingDown width={16} height={16} />
                            )}
                            {formatPercentage(priceChange)}
                          </h4>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}