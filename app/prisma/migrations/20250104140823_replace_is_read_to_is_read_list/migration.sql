/*
  Warnings:

  - You are about to drop the column `isRead` on the `DirectMessage` table. All the data in the column will be lost.
  - You are about to drop the column `isRead` on the `SpaceMessage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DirectMessage" DROP COLUMN "isRead",
ADD COLUMN     "isReadList" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "SpaceMessage" DROP COLUMN "isRead",
ADD COLUMN     "isReadList" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "username" SET DEFAULT CONCAT('friend_', substring(gen_random_uuid()::text, 1, 8));
