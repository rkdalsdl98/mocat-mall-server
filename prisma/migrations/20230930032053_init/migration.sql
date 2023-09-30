/*
  Warnings:

  - You are about to drop the column `orders` on the `user` table. All the data in the column will be lost.
  - Added the required column `userId` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `reply` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "reply" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "orders";

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
