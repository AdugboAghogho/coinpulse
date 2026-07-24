'use client';

import Image from 'next/image';
import { 
  Wallet, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  User, 
  Mail, 
  ShieldCheck, 
  History,
  TrendingUp,
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Repeat,
  PieChart
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function ProfilePage() {
  // --- MOCK DATA ---
  const balance = 12450.75;
  const user = {
    name: 'Kelvin',
    email: 'kelvin@kelsdev.com',
    status: 'Verified',
  };

  const quickStats = [
    { label: '30d Profit', value: '+$1,240.50', isPositive: true, icon: TrendingUp },
    { label: 'Monthly Volume', value: '$34,500', isPositive: true, icon: Activity },
    { label: 'Active Assets', value: '8', isPositive: true, icon: PieChart },
  ];

  const transactions = [
    { id: 'tx-1', type: 'Deposit', asset: 'USDT', amount: '+ 5,000.00', date: 'Today, 14:32', status: 'Completed', icon: ArrowDownRight, color: 'text-green-500', bg: 'bg-green-500/10' },
    { id: 'tx-2', type: 'Swap', asset: 'BTC → ETH', amount: '0.15 BTC', date: 'Yesterday, 09:15', status: 'Completed', icon: Repeat, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'tx-3', type: 'Withdraw', asset: 'SOL', amount: '- 45.00', date: 'Jul 21, 18:45', status: 'Pending', icon: ArrowUpRight, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { id: 'tx-4', type: 'Deposit', asset: 'ETH', amount: '+ 2.50', date: 'Jul 19, 11:20', status: 'Completed', icon: ArrowDownRight, color: 'text-green-500', bg: 'bg-green-500/10' },
  ];

  const portfolio = [
    { asset: 'Bitcoin', symbol: 'BTC', percentage: 45, color: 'bg-orange-500', value: 5602.83 },
    { asset: 'Ethereum', symbol: 'ETH', percentage: 30, color: 'bg-blue-500', value: 3735.22 },
    { asset: 'Solana', symbol: 'SOL', percentage: 15, color: 'bg-purple-500', value: 1867.61 },
    { asset: 'Others', symbol: 'ALT', percentage: 10, color: 'bg-gray-500', value: 1245.07 },
  ];

  // Simple mock SVG path for the balance chart
  const mockChartPath = "M0,40 C20,35 40,45 60,30 C80,15 100,35 120,20 C140,5 160,25 180,15 C200,5 220,20 240,10 C260,0 280,15 300,5";

  return (
    <main className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Wallet & Profile</h1>
        <p className="text-sm text-gray-400">Manage your assets and personal information</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Balance, Stats & Transactions */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Main Balance Card */}
          <div className="rounded-xl bg-[#1A1D26] p-8 border border-gray-800 shadow-2xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-[#84cc16] opacity-5 blur-[80px] rounded-full pointer-events-none"></div>
            
            {/* Background Chart */}
            <div className="absolute bottom-24 left-0 right-0 opacity-20 pointer-events-none">
              <svg viewBox="0 0 300 50" preserveAspectRatio="none" className="w-full h-24">
                <path d={mockChartPath} fill="none" stroke="#84cc16" strokeWidth="2" strokeLinecap="round" />
                <path d={`${mockChartPath} L300,50 L0,50 Z`} fill="url(#gradient)" stroke="none" />
                <defs>
                  <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#84cc16" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#84cc16" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Wallet className="text-gray-400" size={20} />
                  <h3 className="text-gray-400 font-medium">Total Balance</h3>
                </div>
                <span className="text-xs font-semibold text-green-500 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
                  +11.4% All Time
                </span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8 tracking-tight">
                {formatCurrency(balance)}
              </h2>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#84cc16] px-6 py-3.5 font-bold text-black hover:bg-[#65a30d] transition-colors cursor-pointer">
                  <ArrowDownToLine size={18} />
                  Deposit
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#24283b] px-6 py-3.5 font-bold text-white border border-gray-700 hover:bg-gray-800 transition-colors cursor-pointer">
                  <ArrowUpFromLine size={18} />
                  Withdraw
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickStats.map((stat, idx) => (
              <div key={idx} className="rounded-xl bg-[#1A1D26] p-4 border border-gray-800 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-[#24283b] border border-gray-700">
                  <stat.icon size={20} className="text-[#84cc16]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                  <p className="text-white font-bold">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Transactions List */}
          <div className="rounded-xl bg-[#1A1D26] p-6 border border-gray-800 flex-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold flex items-center gap-2">
                <History size={18} className="text-gray-400" />
                Recent Transactions
              </h3>
              <button className="text-xs text-[#84cc16] hover:underline cursor-pointer">View All</button>
            </div>
            
            <ul className="flex flex-col gap-2">
              {transactions.map((tx) => (
                <li key={tx.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#24283b] transition-colors border border-transparent hover:border-gray-800">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${tx.bg} ${tx.color}`}>
                      <tx.icon size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{tx.type} {tx.asset}</h4>
                      <p className="text-xs text-gray-500">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h4 className={`text-sm font-bold ${tx.type === 'Withdraw' ? 'text-white' : 'text-white'}`}>
                      {tx.amount}
                    </h4>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                      tx.status === 'Completed' ? 'text-green-500 bg-green-500/10' : 'text-orange-500 bg-orange-500/10'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Profile & Portfolio */}
        <div className="w-full lg:w-[380px] flex flex-col gap-6">
          
          {/* Account Details */}
          <div className="rounded-xl bg-[#1A1D26] p-6 border border-gray-800 shadow-xl">
            <h3 className="text-white font-bold mb-6 border-b border-gray-800 pb-4">Account Details</h3>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="h-16 w-16 rounded-full bg-gray-800 border-2 border-[#84cc16] flex items-center justify-center overflow-hidden">
                <User size={32} className="text-gray-400" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">{user.name}</h4>
                <span className="inline-flex items-center gap-1 mt-1 rounded bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500 border border-green-500/20">
                  <ShieldCheck size={12} />
                  {user.status}
                </span>
              </div>
            </div>

            <ul className="flex flex-col gap-5">
              <li className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider flex items-center gap-2">
                  <User size={14} /> Full Name
                </span>
                <p className="text-white font-medium">{user.name}</p>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider flex items-center gap-2">
                  <Mail size={14} /> Email Address
                </span>
                <p className="text-white font-medium">{user.email}</p>
              </li>
            </ul>

            <button className="w-full mt-8 rounded-lg bg-[#24283b] px-4 py-3 font-semibold text-white border border-gray-700 hover:bg-gray-800 transition-colors cursor-pointer">
              Edit Profile
            </button>
          </div>

          {/* Portfolio Allocation */}
          <div className="rounded-xl bg-[#1A1D26] p-6 border border-gray-800 shadow-xl">
            <h3 className="text-white font-bold mb-6">Portfolio Allocation</h3>
            
            {/* Visual Bar */}
            <div className="w-full h-3 rounded-full overflow-hidden flex mb-6 bg-gray-800">
              {portfolio.map((item, idx) => (
                <div key={idx} style={{ width: `${item.percentage}%` }} className={`h-full ${item.color}`} />
              ))}
            </div>

            {/* Asset Legend */}
            <ul className="flex flex-col gap-4">
              {portfolio.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <div>
                      <p className="text-sm font-bold text-white leading-tight">{item.asset}</p>
                      <p className="text-xs text-gray-500">{item.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{formatCurrency(item.value)}</p>
                    <p className="text-xs text-gray-500">{item.percentage}%</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </main>
  );
}