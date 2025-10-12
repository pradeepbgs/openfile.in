/*
  Warnings:

  - A unique constraint covering the columns `[paymentId]` on the table `SubscriptionLog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionLog_paymentId_key" ON "SubscriptionLog"("paymentId");
