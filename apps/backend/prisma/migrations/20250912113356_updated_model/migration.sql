-- CreateTable
CREATE TABLE "SubscriptionLog" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "userId" TEXT,
    "paymentId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "rawPayload" JSONB NOT NULL,
    "message" TEXT NOT NULL,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionLog_pkey" PRIMARY KEY ("id")
);
