/*
  Warnings:

  - You are about to drop the column `userId` on the `qaboard` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "qaboard" DROP CONSTRAINT "qaboard_userId_fkey";

-- DropIndex
DROP INDEX "qaboard_userId_key";

-- AlterTable
ALTER TABLE "qaboard" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "qaboards" JSONB[];
