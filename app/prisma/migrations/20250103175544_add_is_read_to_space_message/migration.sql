/*
  Warnings:

  - You are about to drop the column `seen` on the `SpaceMessage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SpaceMessage" DROP COLUMN "seen",
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "username" SET DEFAULT CONCAT('friend_', substring(gen_random_uuid()::text, 1, 8));
