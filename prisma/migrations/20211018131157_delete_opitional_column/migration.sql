/*
  Warnings:

  - Made the column `deliveryCost` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subTotal` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "deliveryCost" SET NOT NULL,
ALTER COLUMN "subTotal" SET NOT NULL;
