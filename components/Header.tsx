'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import SearchModal from '@/components/SearchModal'; // We will create this next

const Header = () => {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header>
      <div className="main-container inner">
        <Link href="/">
          <Image src="/logo.svg" alt="CoinPulse logo" width={132} height={40} />
        </Link>

        <nav>
          <Link
            href="/"
            className={cn('nav-link', {
              'is-active': pathname === '/',
              'is-home': true,
            })}
          >
            Home
          </Link>

          {/* Replaced the <p> tag with a button to toggle state */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="nav-link cursor-pointer hover:text-white transition-colors"
          >
            Search
          </button>

          <Link
            href="/coins"
            className={cn('nav-link', {
              'is-active': pathname === '/coins',
            })}
          >
            All Coins
          </Link>
        </nav>
      </div>

      {/* Render the modal when state is true */}
      {isSearchOpen && (
        <SearchModal onClose={() => setIsSearchOpen(false)} />
      )}
    </header>
  );
};

export default Header;