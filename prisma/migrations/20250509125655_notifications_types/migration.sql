/*
  Warnings:

  - The values [RESERVATION_REQUEST,FIELD_UPDATED,GLEANING_ACCEPTED,NEW_REVIEW,GLEANING_REMINDER,GLEANING_CANCELLED] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('NEW_ANNOUNCEMENT', 'PARTICIPATION_JOINED', 'ANNOUNCEMENT_REPORTED', 'GLEANING_REMINDER_SENT', 'GLEANING_CANCELED', 'REVIEW_POSTED', 'ACCOUNT_BANNED', 'FEEDBACK_RECEIVED', 'INFO_REVEALED', 'NEW_MESSAGE', 'PAYMENT_RECEIVED');
ALTER TABLE "notifications" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
COMMIT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "notifications_enabled" BOOLEAN NOT NULL DEFAULT true;
