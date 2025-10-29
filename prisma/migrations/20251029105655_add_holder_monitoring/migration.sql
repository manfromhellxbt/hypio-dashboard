-- CreateTable
CREATE TABLE "HolderSnapshot" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalHolders" INTEGER NOT NULL,
    "totalSupply" INTEGER NOT NULL,
    "totalTransactions" INTEGER NOT NULL,
    "uniqueTokensTracked" INTEGER NOT NULL,
    "coverage" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HolderSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HolderHistory" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "firstSeen" TIMESTAMP(3) NOT NULL,
    "lastSeen" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "nftCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "HolderHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HolderSnapshot_timestamp_idx" ON "HolderSnapshot"("timestamp");

-- CreateIndex
CREATE INDEX "HolderHistory_firstSeen_idx" ON "HolderHistory"("firstSeen");

-- CreateIndex
CREATE INDEX "HolderHistory_isActive_idx" ON "HolderHistory"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "HolderHistory_address_key" ON "HolderHistory"("address");
