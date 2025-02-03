-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_net";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "username" SET DEFAULT CONCAT('friend_', substring(gen_random_uuid()::text, 1, 8));
