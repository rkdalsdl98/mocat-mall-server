/*
  Warnings:

  - You are about to drop the column `userId` on the `coupon` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "coupon" DROP CONSTRAINT "coupon_userId_fkey";

-- AlterTable
ALTER TABLE "coupon" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "coupons" TEXT[];
