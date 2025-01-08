/*
  Warnings:

  - You are about to drop the column `senderId` on the `SpaceMessage` table. All the data in the column will be lost.
  - Added the required column `spaceMemberId` to the `SpaceMessage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SpaceMessage" DROP CONSTRAINT "SpaceMessage_senderId_fkey";

-- DropIndex
DROP INDEX "SpaceMessage_senderId_idx";

-- AlterTable
ALTER TABLE "SpaceMessage" DROP COLUMN "senderId",
ADD COLUMN     "spaceMemberId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "username" SET DEFAULT CONCAT('friend_', substring(gen_random_uuid()::text, 1, 8));

-- CreateIndex
CREATE INDEX "SpaceMessage_spaceMemberId_idx" ON "SpaceMessage"("spaceMemberId");

-- AddForeignKey
ALTER TABLE "SpaceMessage" ADD CONSTRAINT "SpaceMessage_spaceMemberId_fkey" FOREIGN KEY ("spaceMemberId") REFERENCES "SpaceMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
