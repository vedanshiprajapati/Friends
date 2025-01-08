-- AlterTable
ALTER TABLE "users" ALTER COLUMN "username" SET DEFAULT CONCAT('friend_', substring(gen_random_uuid()::text, 1, 8));
