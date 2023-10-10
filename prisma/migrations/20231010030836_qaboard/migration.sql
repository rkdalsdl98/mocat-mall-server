/*
  Warnings:

  - You are about to drop the column `productId` on the `qaboard` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `qaboard` table. All the data in the column will be lost.
  - You are about to drop the column `visited` on the `qaboard` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `reply` table. All the data in the column will be lost.
  - Added the required column `type` to the `authority` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "authority" ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "qaboard" DROP COLUMN "productId",
DROP COLUMN "updatedAt",
DROP COLUMN "visited",
ADD COLUMN     "answerState" TEXT NOT NULL DEFAULT '대기중';

-- AlterTable
ALTER TABLE "reply" DROP COLUMN "updatedAt";

-- CreateTable
CREATE TABLE "qaboardonproduct" (
    "qaId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "assignAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "qaboardonproduct_pkey" PRIMARY KEY ("qaId","productId")
);

-- AddForeignKey
ALTER TABLE "qaboardonproduct" ADD CONSTRAINT "qaboardonproduct_qaId_fkey" FOREIGN KEY ("qaId") REFERENCES "qaboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qaboardonproduct" ADD CONSTRAINT "qaboardonproduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
