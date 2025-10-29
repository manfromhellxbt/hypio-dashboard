import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const contractAddress = '0x63eb9d77D083cA10C304E28d5191321977fd0Bfb';

    // Get statistics from database
    const totalSupplyStat = await prisma.statistics.findUnique({
      where: { key: 'totalSupply' }
    });

    const lastSyncStat = await prisma.statistics.findUnique({
      where: { key: 'lastSync' }
    });

    const totalSupply = totalSupplyStat ? parseInt(totalSupplyStat.value) : 0;
    const lastSync = lastSyncStat ? new Date(lastSyncStat.value) : null;

    // Get all holders from database
    const holders = await prisma.holder.findMany({
      orderBy: {
        nftCount: 'desc'
      }
    });

    // Get top 10 holders
    const topHolders = holders.slice(0, 10).map(holder => ({
      address: holder.address,
      count: holder.nftCount,
      percentage: holder.percentage.toFixed(2) + '%'
    }));

    // Get total number of tracked tokens
    const tokensTracked = await prisma.tokenOwnership.count();

    // Get total transactions
    const totalTransactions = await prisma.transaction.count();

    return NextResponse.json({
      success: true,
      contractAddress,
      totalSupply,
      totalHolders: holders.length,
      transactionsInDatabase: totalTransactions,
      tokensTracked,
      coverage: totalSupply > 0 ? `${((tokensTracked / totalSupply) * 100).toFixed(2)}%` : '0%',
      topHolders,
      lastSync: lastSync ? lastSync.toISOString() : null,
      note: lastSync
        ? `Data last synced at ${lastSync.toLocaleString()}. Use POST /api/sync to update.`
        : 'No sync has been performed yet. Use POST /api/sync to populate the database.'
    });
  } catch (error) {
    console.error('Error fetching holders data:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch holders data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
