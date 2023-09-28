/*
  Warnings:

  - The `productId` column on the `delivery` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "delivery" DROP COLUMN "productId",
ADD COLUMN     "productId" INTEGER[];
