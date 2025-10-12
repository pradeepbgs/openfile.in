-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DeletedStatus" AS ENUM ('PENDING', 'DELETED', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "linkCount" INTEGER NOT NULL DEFAULT 0,
    "linkCountExpireAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "maxUploads" INTEGER NOT NULL,
    "uploadCount" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "expireAfterFirstUpload" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" BIGINT NOT NULL,
    "keyUsed" BOOLEAN NOT NULL DEFAULT false,
    "uploadLinkId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "planName" TEXT NOT NULL DEFAULT 'free',
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "cancelAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IpLog" (
    "id" SERIAL NOT NULL,
    "ip" TEXT NOT NULL,
    "purpose" TEXT NOT NULL DEFAULT 'upload',
    "fileId" INTEGER NOT NULL,
    "linkId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IpLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeletedFile" (
    "id" SERIAL NOT NULL,
    "fileId" INTEGER NOT NULL,
    "linkId" INTEGER NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "status" "DeletedStatus" NOT NULL DEFAULT 'PENDING',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeletedFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Link_token_key" ON "Link"("token");

-- CreateIndex
CREATE INDEX "Link_token_idx" ON "Link"("token");

-- CreateIndex
CREATE INDEX "Link_userId_idx" ON "Link"("userId");

-- CreateIndex
CREATE INDEX "Link_expiresAt_idx" ON "Link"("expiresAt");

-- CreateIndex
CREATE INDEX "File_uploadLinkId_idx" ON "File"("uploadLinkId");

-- CreateIndex
CREATE INDEX "File_userId_idx" ON "File"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_planName_idx" ON "Subscription"("planName");

-- CreateIndex
CREATE INDEX "IpLog_fileId_idx" ON "IpLog"("fileId");

-- CreateIndex
CREATE INDEX "IpLog_linkId_idx" ON "IpLog"("linkId");

-- CreateIndex
CREATE INDEX "IpLog_purpose_idx" ON "IpLog"("purpose");

-- CreateIndex
CREATE INDEX "IpLog_ip_idx" ON "IpLog"("ip");

-- CreateIndex
CREATE INDEX "DeletedFile_status_idx" ON "DeletedFile"("status");

-- CreateIndex
CREATE INDEX "DeletedFile_linkId_idx" ON "DeletedFile"("linkId");

-- CreateIndex
CREATE INDEX "DeletedFile_fileId_idx" ON "DeletedFile"("fileId");

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_uploadLinkId_fkey" FOREIGN KEY ("uploadLinkId") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IpLog" ADD CONSTRAINT "IpLog_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IpLog" ADD CONSTRAINT "IpLog_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;
