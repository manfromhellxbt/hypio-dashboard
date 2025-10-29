'use client';

import { useEffect, useState } from 'react';
import StatsCard from '@/components/StatsCard';
import TopHoldersTable from '@/components/TopHoldersTable';
import ThemeToggle from '@/components/ThemeToggle';
import HolderGrowthChart from '@/components/HolderGrowthChart';
import DistributionChart from '@/components/DistributionChart';


interface HolderData {
  totalHolders: number;
  totalSupply: number;
  coverage: string;
  topHolders: Array<{
    address: string;
    count: number;
    percentage: string;
  }>;
  lastSync: string;
}

interface StatsData {
  current: {
    totalHolders: number;
    totalSupply: number;
    coverage: string;
  };
  growth: {
    last24Hours: { newHolders: number; percentageChange: string };
    last7Days: { newHolders: number; percentageChange: string };
    last30Days: { newHolders: number; percentageChange: string };
  };
    history: HistoryPoint[];
}

interface HistoryPoint {
  date: string;
  totalHolders: number;
  newHolders: number;
}


export default function Home() {
  const [holderData, setHolderData] = useState<HolderData | null>(null);
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());


    useEffect(() => {
      async function fetchData() {
        try {
          const [holdersRes, statsRes] = await Promise.all([
            fetch('/api/holders'),
            fetch('/api/stats')
          ]);
          
          const holders = await holdersRes.json();
          const stats = await statsRes.json();
          
          if (holders.success) setHolderData(holders);
          if (stats.success) setStatsData(stats);
          setLastUpdate(new Date());
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      }

      // Initial fetch
      fetchData();

      // Auto-refresh every 60 seconds
      const interval = setInterval(() => {
        fetchData();
      }, 60000);

      // Cleanup on unmount
      return () => clearInterval(interval);
    }, []);

    // Format time since last update
    const getTimeAgo = (date: Date) => {
      const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
      
      if (seconds < 60) return `${seconds} seconds ago`;
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      const hours = Math.floor(minutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    };

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 dark:border-indigo-400 mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="mt-6 text-lg font-medium text-gray-600 dark:text-gray-400">Loading dashboard...</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">Fetching latest holder data</p>
          </div>
        </div>
      );
    }


  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <ThemeToggle />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Hypio NFT Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Real-time holder statistics</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Updated {getTimeAgo(lastUpdate)}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                  Blockchain sync: every 10 min
                </p>
              </div>
            </div>
          </div>


        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Holders"
            value={holderData?.totalHolders.toLocaleString('en-US') || '0'}
            subtitle="Unique owners"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
          
          <StatsCard
            title="Total NFTs"
            value={holderData?.totalSupply.toLocaleString('en-US') || '0'}
            subtitle="Tokens in circulation"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
          />
          
          <StatsCard
            title="Coverage"
            value={holderData?.coverage || '0%'}
            subtitle="Tracked NFTs"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* Growth Stats */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Holder Growth</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              title="Last 24 Hours"
              value={`+${statsData?.growth.last24Hours.newHolders || 0}`}
              trend={{
                value: statsData?.growth.last24Hours.percentageChange || '0%',
                isPositive: true
              }}
            />
            
            <StatsCard
              title="Last 7 Days"
              value={`+${statsData?.growth.last7Days.newHolders || 0}`}
              trend={{
                value: statsData?.growth.last7Days.percentageChange || '0%',
                isPositive: true
              }}
            />
            
            <StatsCard
              title="Last 30 Days"
              value={`+${statsData?.growth.last30Days.newHolders || 0}`}
              trend={{
                value: statsData?.growth.last30Days.percentageChange || '0%',
                isPositive: true
              }}
            />
          </div>
        </div>
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {statsData?.history && statsData.history.length > 0 && (
              <HolderGrowthChart data={statsData.history} />
            )}
            
            {holderData?.topHolders && (
              <DistributionChart holders={holderData.topHolders} />
            )}
          </div>
        {/* Top Holders Table */}
        {holderData?.topHolders && (
          <TopHoldersTable holders={holderData.topHolders.slice(0, 10)} />
        )}

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2025 Hypio NFT Dashboard. Data from HyperEVM blockchain.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/manfromhellxbt/hypio-dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
              >
                GitHub
              </a>
              <a
                href="https://hyperevmscan.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
              >
                Explorer
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
