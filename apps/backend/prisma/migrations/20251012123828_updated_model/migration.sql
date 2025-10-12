/*
  Warnings:

  - You are about to drop the `IpLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."IpLog" DROP CONSTRAINT "IpLog_fileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."IpLog" DROP CONSTRAINT "IpLog_linkId_fkey";

-- DropTable
DROP TABLE "public"."IpLog";
