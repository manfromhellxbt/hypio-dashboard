-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "blockNumber" TEXT NOT NULL,
    "timeStamp" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "tokenName" TEXT,
    "tokenSymbol" TEXT,
    "contractAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Holder" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "nftCount" INTEGER NOT NULL DEFAULT 0,
    "percentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Holder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenOwnership" (
    "id" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "currentOwner" TEXT NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "lastTransferHash" TEXT,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenOwnership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Statistics" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Statistics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_hash_key" ON "Transaction"("hash");

-- CreateIndex
CREATE INDEX "Transaction_contractAddress_idx" ON "Transaction"("contractAddress");

-- CreateIndex
CREATE INDEX "Transaction_tokenId_idx" ON "Transaction"("tokenId");

-- CreateIndex
CREATE INDEX "Transaction_to_idx" ON "Transaction"("to");

-- CreateIndex
CREATE INDEX "Transaction_from_idx" ON "Transaction"("from");

-- CreateIndex
CREATE INDEX "Transaction_blockNumber_idx" ON "Transaction"("blockNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Holder_address_key" ON "Holder"("address");

-- CreateIndex
CREATE INDEX "Holder_nftCount_idx" ON "Holder"("nftCount");

-- CreateIndex
CREATE UNIQUE INDEX "TokenOwnership_tokenId_key" ON "TokenOwnership"("tokenId");

-- CreateIndex
CREATE INDEX "TokenOwnership_currentOwner_idx" ON "TokenOwnership"("currentOwner");

-- CreateIndex
CREATE INDEX "TokenOwnership_contractAddress_idx" ON "TokenOwnership"("contractAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Statistics_key_key" ON "Statistics"("key");
