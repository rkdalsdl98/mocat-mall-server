/*
  Warnings:

  - You are about to drop the column `isAdmin` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "isAdmin";

-- CreateTable
CREATE TABLE "authority" (
    "uuid" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userEmail" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "authority_uuid_key" ON "authority"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "authority_userEmail_key" ON "authority"("userEmail");

-- AddForeignKey
ALTER TABLE "authority" ADD CONSTRAINT "authority_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "user"("email") ON DELETE CASCADE ON UPDATE CASCADE;
