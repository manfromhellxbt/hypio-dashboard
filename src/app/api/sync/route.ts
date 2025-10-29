import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface NFTTransaction {
  hash: string;
  blockNumber: string;
  timeStamp: string;
  from: string;
  to: string;
  tokenID: string;
  tokenName?: string;
  tokenSymbol?: string;
  contractAddress: string;
}

export async function POST() {
  try {
    const apiKey = process.env.ETHERSCAN_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const contractAddress = '0x63eb9d77D083cA10C304E28d5191321977fd0Bfb';
    const baseUrl = 'https://api.etherscan.io/v2/api';

    console.log('Starting sync...');

    // Get total supply
    const supplyUrl = `${baseUrl}?chainid=999&module=stats&action=tokensupply&contractaddress=${contractAddress}&apikey=${apiKey}`;
    const supplyResponse = await fetch(supplyUrl);
    const supplyData = await supplyResponse.json();
    const totalSupply = supplyData.status === '1' ? parseInt(supplyData.result) : 0;

    // Save total supply to statistics
    await prisma.statistics.upsert({
      where: { key: 'totalSupply' },
      update: { value: totalSupply.toString() },
      create: { key: 'totalSupply', value: totalSupply.toString() }
    });

    // Clear old data first
    console.log('Clearing old data...');
    await prisma.transaction.deleteMany({});
    await prisma.holder.deleteMany({});
    await prisma.tokenOwnership.deleteMany({});

    // Fetch all transactions using block range approach
    // Etherscan API has a 10,000 record limit, so we fetch in chunks by block range
    const pageSize = 10000;
    let allTransactions: NFTTransaction[] = [];
    let startBlock = 0;
    let hasMore = true;
    let iteration = 0;
    const maxIterations = 5; // Prevent infinite loops

    while (hasMore && iteration < maxIterations) {
      iteration++;
      console.log(`Fetching batch ${iteration} starting from block ${startBlock}...`);

      const txUrl = startBlock > 0
        ? `${baseUrl}?chainid=999&module=account&action=tokennfttx&contractaddress=${contractAddress}&startblock=${startBlock}&endblock=99999999&page=1&offset=${pageSize}&sort=asc&apikey=${apiKey}`
        : `${baseUrl}?chainid=999&module=account&action=tokennfttx&contractaddress=${contractAddress}&page=1&offset=${pageSize}&sort=asc&apikey=${apiKey}`;

      const txResponse = await fetch(txUrl);
      const txData = await txResponse.json();

      if (txData.status === '1' && txData.result && txData.result.length > 0) {
        // Filter out duplicates (transactions we already have)
        const uniqueHashes = new Set(allTransactions.map(tx => tx.hash));
        const newTransactions = txData.result.filter((tx: NFTTransaction) => !uniqueHashes.has(tx.hash));

        allTransactions = allTransactions.concat(newTransactions);
        console.log(`Batch ${iteration}: ${newTransactions.length} new transactions (total: ${allTransactions.length})`);

        // If we got exactly pageSize, there might be more
        if (txData.result.length === pageSize) {
          // Get the last block number from this batch
          const lastTx = txData.result[txData.result.length - 1];
          const lastBlock = parseInt(lastTx.blockNumber);
          startBlock = lastBlock + 1; // Start from next block
          console.log(`Will continue from block ${startBlock}`);
        } else {
          console.log('Reached end of data');
          hasMore = false;
        }
      } else {
        console.log(`No more data in batch ${iteration}`);
        hasMore = false;
      }
    }

    console.log(`Total transactions fetched from API: ${allTransactions.length}`);

    // Batch insert transactions (much faster!)
    const batchSize = 1000;
    let savedCount = 0;

    for (let i = 0; i < allTransactions.length; i += batchSize) {
      const batch = allTransactions.slice(i, i + batchSize);

      await prisma.transaction.createMany({
        data: batch.map(tx => ({
          hash: tx.hash,
          blockNumber: tx.blockNumber,
          timeStamp: tx.timeStamp,
          from: tx.from.toLowerCase(),
          to: tx.to.toLowerCase(),
          tokenId: tx.tokenID,
          tokenName: tx.tokenName,
          tokenSymbol: tx.tokenSymbol,
          contractAddress: tx.contractAddress.toLowerCase()
        })),
        skipDuplicates: true
      });

      savedCount += batch.length;
      console.log(`Saved ${savedCount}/${allTransactions.length} transactions`);
    }

    console.log(`All ${allTransactions.length} transactions saved!`);

    // Calculate current holders from all transactions
    console.log('Calculating current holders...');

    // Build token ownership map
    const tokenOwners = new Map<string, string>();

    // Sort transactions by block number (ascending) - process from oldest to newest
    allTransactions.sort((a, b) => {
      const blockDiff = parseInt(a.blockNumber) - parseInt(b.blockNumber);
      if (blockDiff !== 0) return blockDiff;
      return parseInt(a.timeStamp) - parseInt(b.timeStamp);
    });

    // Process transactions - last transfer wins
    for (const tx of allTransactions) {
      tokenOwners.set(tx.tokenID, tx.to.toLowerCase());
    }

    console.log(`Found ${tokenOwners.size} unique tokens`);

    // Batch insert TokenOwnership
    const ownershipData = Array.from(tokenOwners.entries()).map(([tokenId, owner]) => ({
      tokenId,
      currentOwner: owner,
      contractAddress: contractAddress.toLowerCase()
    }));

    // Insert in batches
    for (let i = 0; i < ownershipData.length; i += batchSize) {
      const batch = ownershipData.slice(i, i + batchSize);
      await prisma.tokenOwnership.createMany({
        data: batch,
        skipDuplicates: true
      });
      console.log(`Saved ${Math.min(i + batchSize, ownershipData.length)}/${ownershipData.length} token ownerships`);
    }

    // Calculate holder counts
    const holderCounts = new Map<string, number>();
    const zeroAddress = '0x0000000000000000000000000000000000000000';

    for (const owner of tokenOwners.values()) {
      if (owner !== zeroAddress) {
        holderCounts.set(owner, (holderCounts.get(owner) || 0) + 1);
      }
    }

    console.log(`Found ${holderCounts.size} unique holders`);

    // Batch insert Holders
    const holdersData = Array.from(holderCounts.entries()).map(([address, count]) => ({
      address,
      nftCount: count,
      percentage: totalSupply > 0 ? (count / totalSupply) * 100 : 0
    }));

    // Insert holders in batches
    for (let i = 0; i < holdersData.length; i += batchSize) {
      const batch = holdersData.slice(i, i + batchSize);
      await prisma.holder.createMany({
        data: batch,
        skipDuplicates: true
      });
      console.log(`Saved ${Math.min(i + batchSize, holdersData.length)}/${holdersData.length} holders`);
    }

    // Update HolderHistory - track when each holder was first/last seen
    // TODO: Optimize this - currently very slow with many upserts
    console.log('Updating holder history (simplified)...');
    const now = new Date();

    // For now, only track holders we haven't seen before
    const existingHolders = await prisma.holderHistory.findMany({
      select: { address: true }
    });

    const existingAddresses = new Set(existingHolders.map(h => h.address));
    const newHolders = Array.from(holderCounts.entries())
      .filter(([address]) => !existingAddresses.has(address))
      .map(([address, count]) => ({
        address,
        nftCount: count,
        firstSeen: now,
        lastSeen: now,
        isActive: true
      }));

    if (newHolders.length > 0) {
      await prisma.holderHistory.createMany({
        data: newHolders,
        skipDuplicates: true
      });
      console.log(`Added ${newHolders.length} new holders to history`);
    } else {
      console.log('No new holders found');
    }

    // Create historical snapshot
    console.log('Creating holder snapshot...');
    const totalTransactionCount = await prisma.transaction.count();

    await prisma.holderSnapshot.create({
      data: {
        totalHolders: holderCounts.size,
        totalSupply,
        totalTransactions: totalTransactionCount,
        uniqueTokensTracked: tokenOwners.size,
        coverage: totalSupply > 0 ? (tokenOwners.size / totalSupply) * 100 : 0,
        timestamp: now
      }
    });

    console.log('Snapshot saved');

    // Save last sync time
    await prisma.statistics.upsert({
      where: { key: 'lastSync' },
      update: { value: new Date().toISOString() },
      create: { key: 'lastSync', value: new Date().toISOString() }
    });

    const uniqueHolders = holderCounts.size;

    console.log('Sync completed successfully!');

    return NextResponse.json({
      success: true,
      message: 'Sync completed successfully! ✓',
      stats: {
        totalSupply,
        transactionsProcessed: allTransactions.length,
        transactionsSaved: allTransactions.length,
        tokensTracked: tokenOwners.size,
        uniqueHolders,
        coverage: totalSupply > 0 ? `${((tokenOwners.size / totalSupply) * 100).toFixed(2)}%` : '0%'
      }
    });

  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      {
        error: 'Sync failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
