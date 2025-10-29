import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.ETHERSCAN_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // HyperEVM chainid = 999
    // Hypio NFT contract address
    const contractAddress = '0x63eb9d77D083cA10C304E28d5191321977fd0Bfb';
    const baseUrl = 'https://api.etherscan.io/v2/api';

    // Try multiple endpoints to find which ones work
    const endpoints = [
      {
        name: 'Token Info (getToken)',
        url: `${baseUrl}?chainid=999&module=token&action=getToken&contractaddress=${contractAddress}&apikey=${apiKey}`
      },
      {
        name: 'Token Supply',
        url: `${baseUrl}?chainid=999&module=stats&action=tokensupply&contractaddress=${contractAddress}&apikey=${apiKey}`
      },
      {
        name: 'Contract ABI',
        url: `${baseUrl}?chainid=999&module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`
      },
      {
        name: 'ERC721 Transactions',
        url: `${baseUrl}?chainid=999&module=account&action=tokennfttx&contractaddress=${contractAddress}&page=1&offset=10&apikey=${apiKey}`
      }
    ];

    const results = await Promise.all(
      endpoints.map(async (endpoint) => {
        try {
          const response = await fetch(endpoint.url);
          const data = await response.json();
          return {
            endpoint: endpoint.name,
            url: endpoint.url.replace(apiKey, 'YOUR_API_KEY'),
            success: data.status === '1',
            data
          };
        } catch (error) {
          return {
            endpoint: endpoint.name,
            url: endpoint.url.replace(apiKey, 'YOUR_API_KEY'),
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      })
    );

    const workingEndpoints = results.filter(r => r.success);

    return NextResponse.json({
      message: 'Testing multiple Etherscan API V2 endpoints for HyperEVM',
      contractAddress,
      totalEndpointsTested: endpoints.length,
      workingEndpoints: workingEndpoints.length,
      results
    });
  } catch (error) {
    console.error('Error fetching token data:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch token data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
