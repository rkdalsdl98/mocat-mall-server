/*
  Warnings:

  - You are about to drop the column `userId` on the `order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_userId_fkey";

-- DropIndex
DROP INDEX "order_userId_key";

-- AlterTable
ALTER TABLE "order" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "orders" TEXT[];
