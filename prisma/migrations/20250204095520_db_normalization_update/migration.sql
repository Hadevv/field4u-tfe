/*
  Warnings:

  - The values [GLANAGE_ACCEPTED] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.
  - The values [AGRICULTEUR,GLANEUR] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `announcementId` on the `agendas` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `agendas` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `agendas` table. All the data in the column will be lost.
  - You are about to drop the column `notificationId` on the `agendas` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `agendas` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `agendas` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `agendas` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `announcements` table. All the data in the column will be lost.
  - You are about to drop the column `cropTypeId` on the `announcements` table. All the data in the column will be lost.
  - You are about to drop the column `fieldId` on the `announcements` table. All the data in the column will be lost.
  - You are about to drop the column `isPublished` on the `announcements` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `announcements` table. All the data in the column will be lost.
  - You are about to drop the column `quantityAvailable` on the `announcements` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `announcements` table. All the data in the column will be lost.
  - You are about to drop the column `announcementId` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `crop_types` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `crop_types` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `crop_types` table. All the data in the column will be lost.
  - You are about to drop the column `contactInfo` on the `farms` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `farms` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `farms` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `farms` table. All the data in the column will be lost.
  - You are about to drop the column `announcementId` on the `favorites` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `favorites` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `favorites` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `feedbacks` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `feedbacks` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `feedbacks` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `fields` table. All the data in the column will be lost.
  - You are about to drop the column `cropTypeId` on the `fields` table. All the data in the column will be lost.
  - You are about to drop the column `farmId` on the `fields` table. All the data in the column will be lost.
  - You are about to drop the column `isAvailable` on the `fields` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `fields` table. All the data in the column will be lost.
  - You are about to drop the column `qrCode` on the `fields` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `fields` table. All the data in the column will be lost.
  - You are about to drop the column `announcementId` on the `likes` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `likes` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `likes` table. All the data in the column will be lost.
  - You are about to drop the column `agendaId` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `isRead` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `announcementId` on the `participations` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `participations` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `participations` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `glanageId` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `lastUpdated` on the `statistics` table. All the data in the column will be lost.
  - You are about to drop the column `totalAnnouncements` on the `statistics` table. All the data in the column will be lost.
  - You are about to drop the column `totalFields` on the `statistics` table. All the data in the column will be lost.
  - You are about to drop the column `totalFoodSaved` on the `statistics` table. All the data in the column will be lost.
  - You are about to drop the column `totalGlanages` on the `statistics` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `statistics` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `resendContactId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `stripeCustomerId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `announcement_glanage_periods` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `glanage_participations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `glanage_periods` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `glanages` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[notification_id]` on the table `agendas` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `farms` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[agenda_id]` on the table `notifications` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,announcement_id]` on the table `participations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `statistics` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resend_contact_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[password_hash]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `announcement_id` to the `agendas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_date` to the `agendas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `agendas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `agendas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `agendas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `crop_type_id` to the `announcements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `field_id` to the `announcements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `announcements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `announcements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `announcement_id` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `crop_types` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `crop_types` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `farms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `farms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `announcement_id` to the `favorites` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `favorites` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `feedbacks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `crop_type_id` to the `fields` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `fields` table without a default value. This is not possible if the table is not empty.
  - Added the required column `announcement_id` to the `likes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `likes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `announcement_id` to the `participations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `participations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gleaning_id` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_updated` to the `statistics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `statistics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GleaningStatus" AS ENUM ('PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "GleaningPeriodStatus" AS ENUM ('AVAILABLE', 'NOT_AVAILABLE', 'PENDING', 'CLOSED');

-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('NEW_ANNOUNCEMENT', 'RESERVATION_REQUEST', 'FIELD_UPDATED', 'GLEANING_ACCEPTED');
ALTER TABLE "notifications" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('FARMER', 'GLEANER', 'ADMIN');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'GLEANER';
COMMIT;

-- DropForeignKey
ALTER TABLE "agendas" DROP CONSTRAINT "agendas_announcementId_fkey";

-- DropForeignKey
ALTER TABLE "agendas" DROP CONSTRAINT "agendas_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "agendas" DROP CONSTRAINT "agendas_userId_fkey";

-- DropForeignKey
ALTER TABLE "announcement_glanage_periods" DROP CONSTRAINT "announcement_glanage_periods_announcementId_fkey";

-- DropForeignKey
ALTER TABLE "announcement_glanage_periods" DROP CONSTRAINT "announcement_glanage_periods_glanagePeriodId_fkey";

-- DropForeignKey
ALTER TABLE "announcements" DROP CONSTRAINT "announcements_cropTypeId_fkey";

-- DropForeignKey
ALTER TABLE "announcements" DROP CONSTRAINT "announcements_fieldId_fkey";

-- DropForeignKey
ALTER TABLE "announcements" DROP CONSTRAINT "announcements_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_announcementId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_userId_fkey";

-- DropForeignKey
ALTER TABLE "farms" DROP CONSTRAINT "farms_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "favorites" DROP CONSTRAINT "favorites_announcementId_fkey";

-- DropForeignKey
ALTER TABLE "favorites" DROP CONSTRAINT "favorites_userId_fkey";

-- DropForeignKey
ALTER TABLE "feedbacks" DROP CONSTRAINT "feedbacks_userId_fkey";

-- DropForeignKey
ALTER TABLE "fields" DROP CONSTRAINT "fields_cropTypeId_fkey";

-- DropForeignKey
ALTER TABLE "fields" DROP CONSTRAINT "fields_farmId_fkey";

-- DropForeignKey
ALTER TABLE "fields" DROP CONSTRAINT "fields_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "glanage_participations" DROP CONSTRAINT "glanage_participations_glanageId_fkey";

-- DropForeignKey
ALTER TABLE "glanage_participations" DROP CONSTRAINT "glanage_participations_participationId_fkey";

-- DropForeignKey
ALTER TABLE "glanage_periods" DROP CONSTRAINT "glanage_periods_fieldId_fkey";

-- DropForeignKey
ALTER TABLE "glanages" DROP CONSTRAINT "glanages_announcementId_fkey";

-- DropForeignKey
ALTER TABLE "glanages" DROP CONSTRAINT "glanages_userId_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_announcementId_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_userId_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_userId_fkey";

-- DropForeignKey
ALTER TABLE "participations" DROP CONSTRAINT "participations_announcementId_fkey";

-- DropForeignKey
ALTER TABLE "participations" DROP CONSTRAINT "participations_userId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_glanageId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_userId_fkey";

-- DropForeignKey
ALTER TABLE "statistics" DROP CONSTRAINT "statistics_userId_fkey";

-- DropIndex
DROP INDEX "agendas_notificationId_key";

-- DropIndex
DROP INDEX "announcements_fieldId_cropTypeId_idx";

-- DropIndex
DROP INDEX "notifications_agendaId_key";

-- DropIndex
DROP INDEX "participations_userId_announcementId_key";

-- AlterTable
ALTER TABLE "agendas" DROP COLUMN "announcementId",
DROP COLUMN "createdAt",
DROP COLUMN "endDate",
DROP COLUMN "notificationId",
DROP COLUMN "startDate",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "announcement_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "notification_id" TEXT,
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "announcements" DROP COLUMN "createdAt",
DROP COLUMN "cropTypeId",
DROP COLUMN "fieldId",
DROP COLUMN "isPublished",
DROP COLUMN "ownerId",
DROP COLUMN "quantityAvailable",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "crop_type_id" TEXT NOT NULL,
ADD COLUMN     "field_id" TEXT NOT NULL,
ADD COLUMN     "is_published" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "owner_id" TEXT NOT NULL,
ADD COLUMN     "quantity_available" INTEGER,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "announcementId",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "announcement_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "crop_types" DROP COLUMN "createdAt",
DROP COLUMN "type",
DROP COLUMN "updatedAt",
ADD COLUMN     "category" "CropCategory" NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "farms" DROP COLUMN "contactInfo",
DROP COLUMN "createdAt",
DROP COLUMN "ownerId",
DROP COLUMN "updatedAt",
ADD COLUMN     "contact_info" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "owner_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "favorites" DROP COLUMN "announcementId",
DROP COLUMN "createdAt",
DROP COLUMN "userId",
ADD COLUMN     "announcement_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "feedbacks" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "fields" DROP COLUMN "createdAt",
DROP COLUMN "cropTypeId",
DROP COLUMN "farmId",
DROP COLUMN "isAvailable",
DROP COLUMN "ownerId",
DROP COLUMN "qrCode",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "crop_type_id" TEXT NOT NULL,
ADD COLUMN     "farm_id" TEXT,
ADD COLUMN     "is_available" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "owner_id" TEXT,
ADD COLUMN     "qr_code_url" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "likes" DROP COLUMN "announcementId",
DROP COLUMN "createdAt",
DROP COLUMN "userId",
ADD COLUMN     "announcement_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "agendaId",
DROP COLUMN "createdAt",
DROP COLUMN "isRead",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "agenda_id" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_read" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "participations" DROP COLUMN "announcementId",
DROP COLUMN "createdAt",
DROP COLUMN "userId",
ADD COLUMN     "announcement_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "createdAt",
DROP COLUMN "glanageId",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "gleaning_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "statistics" DROP COLUMN "lastUpdated",
DROP COLUMN "totalAnnouncements",
DROP COLUMN "totalFields",
DROP COLUMN "totalFoodSaved",
DROP COLUMN "totalGlanages",
DROP COLUMN "userId",
ADD COLUMN     "last_updated" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "total_announcements" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_fields" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_food_saved" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "total_glanages" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "createdAt",
DROP COLUMN "emailVerified",
DROP COLUMN "passwordHash",
DROP COLUMN "resendContactId",
DROP COLUMN "stripeCustomerId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "email_verified" TIMESTAMP(3),
ADD COLUMN     "password_hash" TEXT,
ADD COLUMN     "resend_contact_id" TEXT,
ADD COLUMN     "stripe_customer_id" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'GLEANER',
ALTER COLUMN "language" SET DEFAULT 'FRENCH';

-- DropTable
DROP TABLE "announcement_glanage_periods";

-- DropTable
DROP TABLE "glanage_participations";

-- DropTable
DROP TABLE "glanage_periods";

-- DropTable
DROP TABLE "glanages";

-- DropEnum
DROP TYPE "GlanagePeriodStatus";

-- DropEnum
DROP TYPE "GlanageStatus";

-- CreateTable
CREATE TABLE "gleaning_periods" (
    "id" TEXT NOT NULL,
    "field_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" "GleaningPeriodStatus" NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT "gleaning_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gleanings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "announcement_id" TEXT NOT NULL,
    "status" "GleaningStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gleanings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcement_gleaning_periods" (
    "announcement_id" TEXT NOT NULL,
    "gleaning_period_id" TEXT NOT NULL,

    CONSTRAINT "announcement_gleaning_periods_pkey" PRIMARY KEY ("announcement_id","gleaning_period_id")
);

-- CreateTable
CREATE TABLE "gleaning_participations" (
    "gleaning_id" TEXT NOT NULL,
    "participation_id" TEXT NOT NULL,

    CONSTRAINT "gleaning_participations_pkey" PRIMARY KEY ("gleaning_id","participation_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gleanings_user_id_announcement_id_key" ON "gleanings"("user_id", "announcement_id");

-- CreateIndex
CREATE UNIQUE INDEX "agendas_notification_id_key" ON "agendas"("notification_id");

-- CreateIndex
CREATE INDEX "announcements_field_id_crop_type_id_idx" ON "announcements"("field_id", "crop_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "farms_slug_key" ON "farms"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "notifications_agenda_id_key" ON "notifications"("agenda_id");

-- CreateIndex
CREATE UNIQUE INDEX "participations_user_id_announcement_id_key" ON "participations"("user_id", "announcement_id");

-- CreateIndex
CREATE UNIQUE INDEX "statistics_user_id_key" ON "statistics"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_resend_contact_id_key" ON "users"("resend_contact_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_password_hash_key" ON "users"("password_hash");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "users"("created_at");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- AddForeignKey
ALTER TABLE "farms" ADD CONSTRAINT "farms_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_gleaning_id_fkey" FOREIGN KEY ("gleaning_id") REFERENCES "gleanings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "announcements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "announcements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "announcements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendas" ADD CONSTRAINT "agendas_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "announcements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendas" ADD CONSTRAINT "agendas_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "notifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendas" ADD CONSTRAINT "agendas_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fields" ADD CONSTRAINT "fields_crop_type_id_fkey" FOREIGN KEY ("crop_type_id") REFERENCES "crop_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fields" ADD CONSTRAINT "fields_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fields" ADD CONSTRAINT "fields_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "statistics" ADD CONSTRAINT "statistics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_crop_type_id_fkey" FOREIGN KEY ("crop_type_id") REFERENCES "crop_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "fields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gleaning_periods" ADD CONSTRAINT "gleaning_periods_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "fields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gleanings" ADD CONSTRAINT "gleanings_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "announcements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gleanings" ADD CONSTRAINT "gleanings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participations" ADD CONSTRAINT "participations_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "announcements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participations" ADD CONSTRAINT "participations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcement_gleaning_periods" ADD CONSTRAINT "announcement_gleaning_periods_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "announcements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcement_gleaning_periods" ADD CONSTRAINT "announcement_gleaning_periods_gleaning_period_id_fkey" FOREIGN KEY ("gleaning_period_id") REFERENCES "gleaning_periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gleaning_participations" ADD CONSTRAINT "gleaning_participations_gleaning_id_fkey" FOREIGN KEY ("gleaning_id") REFERENCES "gleanings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gleaning_participations" ADD CONSTRAINT "gleaning_participations_participation_id_fkey" FOREIGN KEY ("participation_id") REFERENCES "participations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
