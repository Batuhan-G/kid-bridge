-- CreateTable
CREATE TABLE "parent_connections" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requesterEmail" TEXT NOT NULL,
    "receiverEmail" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "parent_connections_requesterEmail_receiverEmail_key" ON "parent_connections"("requesterEmail", "receiverEmail");
