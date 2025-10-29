# HyperEVM NFT Holder Tracking Dashboard

A real-time NFT holder analytics dashboard for HyperEVM blockchain. Track NFT holders, monitor growth metrics, and analyze ownership distribution with blockchain data synced via Etherscan API V2.

## Features

- **Real-time Holder Tracking**: Monitor all NFT holders and their token counts
- **Growth Analytics**: Track new holders daily, weekly, and monthly
- **Historical Snapshots**: View holder growth trends over time
- **Complete Coverage**: 100% token ownership tracking (5,389+ tokens)
- **Top Holders**: Identify largest NFT holders with percentage breakdown
- **Fast Sync**: Complete blockchain sync in ~45 seconds
- **API-First**: RESTful API endpoints for easy integration

## Live Demo

**Production**: [https://my-nextjs-app-lilac-tau.vercel.app](https://my-nextjs-app-lilac-tau.vercel.app)

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Database**: [Neon PostgreSQL](https://neon.tech/) (Serverless)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Blockchain API**: [Etherscan API V2](https://docs.etherscan.io/) for HyperEVM (chainid=999)
- **Deployment**: [Vercel](https://vercel.com/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS

## API Endpoints

### GET `/api/holders`
Get current holder statistics and top holders.

**Response:**
```json
{
  "success": true,
  "totalSupply": 5389,
  "totalHolders": 2801,
  "transactionsInDatabase": 13733,
  "tokensTracked": 5389,
  "coverage": "100.00%",
  "topHolders": [
    {
      "address": "0x91d2127bafb11062eed0176d991fe7f2eb60db8f",
      "count": 110,
      "percentage": "2.04%"
    }
  ],
  "lastSync": "2025-10-29T11:04:55.353Z"
}
```

### GET `/api/stats`
Get holder growth metrics and historical data.

**Response:**
```json
{
  "success": true,
  "current": {
    "totalHolders": 2801,
    "totalSupply": 5389,
    "uniqueTokensTracked": 5389,
    "coverage": "100.00%",
    "timestamp": "2025-10-29T11:04:49.973Z"
  },
  "growth": {
    "last24Hours": {
      "newHolders": 42,
      "holderChange": 5,
      "percentageChange": "0.18%"
    },
    "last7Days": {
      "newHolders": 156,
      "holderChange": 23,
      "percentageChange": "0.83%"
    },
    "last30Days": {
      "newHolders": 312,
      "holderChange": 78,
      "percentageChange": "2.86%"
    }
  },
  "history": [...]
}
```

### POST `/api/sync`
Trigger blockchain data synchronization.

**Response:**
```json
{
  "success": true,
  "message": "Sync completed successfully!",
  "stats": {
    "totalSupply": 5389,
    "transactionsProcessed": 13733,
    "tokensTracked": 5389,
    "uniqueHolders": 2801,
    "coverage": "100.00%"
  }
}
```

### GET `/api/test`
Test Etherscan API connection and endpoints.

## Database Schema

### Models

- **Transaction**: All NFT transfer transactions
- **Holder**: Current holder statistics
- **TokenOwnership**: Current ownership mapping (tokenId → owner)
- **HolderSnapshot**: Historical snapshots for analytics
- **HolderHistory**: First/last seen timestamps for each holder
- **Statistics**: System metadata (last sync time, total supply, etc.)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (we recommend [Neon](https://neon.tech/))
- Etherscan API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/manfromhellxbt/hypio-dashboard.git
cd hypio-dashboard/my-nextjs-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create `.env.local` file:
```env
# Etherscan API
ETHERSCAN_API_KEY=your_api_key_here

# Neon Database
POSTGRES_PRISMA_URL=your_database_url_here
POSTGRES_URL_NON_POOLING=your_direct_database_url_here
```

4. Run database migrations:
```bash
npx prisma migrate deploy
npx prisma generate
```

5. Run the development server:
```bash
npm run dev
```

6. Initial data sync:
```bash
curl -X POST http://localhost:3000/api/sync
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Configuration

### Target NFT Contract

The contract address is configured in `src/app/api/sync/route.ts`:

```typescript
const contractAddress = '0x63eb9d77D083cA10C304E28d5191321977fd0Bfb';
```

To track a different NFT contract, update this address.

### Blockchain Network

Currently configured for **HyperEVM** (chainid=999). To change networks, update the `chainid` parameter in API calls:

```typescript
const baseUrl = 'https://api.etherscan.io/v2/api';
// Change chainid=999 to your network's chain ID
```

## Performance Optimizations

- **Batch Inserts**: 1,000 records per batch for fast database writes
- **Block Range Pagination**: Bypasses Etherscan's 10,000 record limit
- **Indexed Queries**: Database indexes on frequently queried fields
- **Serverless Database**: Auto-scaling with Neon PostgreSQL
- **Edge Deployment**: Vercel edge network for low latency

## Monitoring & Maintenance

### Recommended Sync Schedule

Run `/api/sync` regularly to keep data up-to-date:

- **Hourly**: For active NFT collections
- **Daily**: For moderate activity
- **Weekly**: For low activity collections

You can set up Vercel Cron Jobs or use external cron services.

### Database Management

View and manage data with Prisma Studio:
```bash
npx prisma studio
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── holders/     # GET holder statistics
│   │   ├── stats/       # GET growth metrics
│   │   ├── sync/        # POST sync blockchain data
│   │   └── test/        # GET test API connection
│   └── page.tsx         # Homepage
├── lib/
│   └── prisma.ts        # Prisma client singleton
prisma/
├── schema.prisma        # Database schema
└── migrations/          # Database migrations
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT License - feel free to use this project for any purpose.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Blockchain data from [Etherscan API](https://etherscan.io/)
- Database powered by [Neon](https://neon.tech/)
- Deployed on [Vercel](https://vercel.com/)

---

**Built by**: [@manfromhellxbt](https://github.com/manfromhellxbt)
