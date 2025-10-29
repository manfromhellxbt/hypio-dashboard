import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const now = new Date();

    // Get current snapshot (latest)
    const currentSnapshot = await prisma.holderSnapshot.findFirst({
      orderBy: { timestamp: 'desc' }
    });

    if (!currentSnapshot) {
      return NextResponse.json({
        error: 'No snapshots available. Run POST /api/sync first.'
      }, { status: 404 });
    }

    // Calculate time boundaries
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get snapshots for comparison
    const dayAgoSnapshot = await prisma.holderSnapshot.findFirst({
      where: { timestamp: { lte: oneDayAgo } },
      orderBy: { timestamp: 'desc' }
    });

    const weekAgoSnapshot = await prisma.holderSnapshot.findFirst({
      where: { timestamp: { lte: oneWeekAgo } },
      orderBy: { timestamp: 'desc' }
    });

    const monthAgoSnapshot = await prisma.holderSnapshot.findFirst({
      where: { timestamp: { lte: oneMonthAgo } },
      orderBy: { timestamp: 'desc' }
    });

    // Calculate new holders using HolderHistory
    const newHoldersLastDay = await prisma.holderHistory.count({
      where: {
        firstSeen: { gte: oneDayAgo }
      }
    });

    const newHoldersLastWeek = await prisma.holderHistory.count({
      where: {
        firstSeen: { gte: oneWeekAgo }
      }
    });

    const newHoldersLastMonth = await prisma.holderHistory.count({
      where: {
        firstSeen: { gte: oneMonthAgo }
      }
    });

    // Get all snapshots for chart data
    const allSnapshots = await prisma.holderSnapshot.findMany({
      orderBy: { timestamp: 'asc' },
      take: 100 // Last 100 snapshots
    });

    // Build response
    return NextResponse.json({
      success: true,
      current: {
        totalHolders: currentSnapshot.totalHolders,
        totalSupply: currentSnapshot.totalSupply,
        uniqueTokensTracked: currentSnapshot.uniqueTokensTracked,
        coverage: `${currentSnapshot.coverage.toFixed(2)}%`,
        timestamp: currentSnapshot.timestamp
      },
      growth: {
        last24Hours: {
          newHolders: newHoldersLastDay,
          holderChange: dayAgoSnapshot
            ? currentSnapshot.totalHolders - dayAgoSnapshot.totalHolders
            : null,
          percentageChange: dayAgoSnapshot
            ? (((currentSnapshot.totalHolders - dayAgoSnapshot.totalHolders) / dayAgoSnapshot.totalHolders) * 100).toFixed(2) + '%'
            : null
        },
        last7Days: {
          newHolders: newHoldersLastWeek,
          holderChange: weekAgoSnapshot
            ? currentSnapshot.totalHolders - weekAgoSnapshot.totalHolders
            : null,
          percentageChange: weekAgoSnapshot
            ? (((currentSnapshot.totalHolders - weekAgoSnapshot.totalHolders) / weekAgoSnapshot.totalHolders) * 100).toFixed(2) + '%'
            : null
        },
        last30Days: {
          newHolders: newHoldersLastMonth,
          holderChange: monthAgoSnapshot
            ? currentSnapshot.totalHolders - monthAgoSnapshot.totalHolders
            : null,
          percentageChange: monthAgoSnapshot
            ? (((currentSnapshot.totalHolders - monthAgoSnapshot.totalHolders) / monthAgoSnapshot.totalHolders) * 100).toFixed(2) + '%'
            : null
        }
      },
      history: allSnapshots.map(snapshot => ({
        timestamp: snapshot.timestamp,
        totalHolders: snapshot.totalHolders,
        coverage: snapshot.coverage
      })),
      note: 'New holders are tracked from their first appearance in the blockchain. Run POST /api/sync regularly to update metrics.'
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch stats',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
