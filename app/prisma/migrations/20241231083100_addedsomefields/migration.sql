-- AlterTable
ALTER TABLE "DirectMessage" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "Space" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "SpaceMessage" ADD COLUMN     "image" TEXT,
ADD COLUMN     "seen" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "username" SET DEFAULT CONCAT('friend_', substring(gen_random_uuid()::text, 1, 8));
