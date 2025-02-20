/*
  Warnings:

  - The primary key for the `accounts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `accounts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `userId` on the `accounts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - The primary key for the `agendas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `agendas` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `title` on the `agendas` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `description` on the `agendas` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `announcement_id` on the `agendas` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `notification_id` on the `agendas` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `user_id` on the `agendas` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - The primary key for the `announcement_gleaning_periods` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `announcement_id` on the `announcement_gleaning_periods` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `gleaning_period_id` on the `announcement_gleaning_periods` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - The primary key for the `announcements` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `announcements` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `title` on the `announcements` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `slug` on the `announcements` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(6)`.
  - You are about to alter the column `description` on the `announcements` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2000)`.
  - You are about to alter the column `crop_type_id` on the `announcements` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `field_id` on the `announcements` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `owner_id` on the `announcements` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `images` on the `announcements` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - The primary key for the `comments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `content` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.
  - You are about to alter the column `announcement_id` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `user_id` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - The primary key for the `crop_types` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `crop_types` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `name` on the `crop_types` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - The primary key for the `farms` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `farms` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `name` on the `farms` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `slug` on the `farms` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(6)`.
  - You are about to alter the column `description` on the `farms` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `city` on the `farms` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `postal_code` on the `farms` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - You are about to alter the column `contact_info` on the `farms` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `owner_id` on the `farms` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - The primary key for the `favorites` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `favorites` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `announcement_id` on the `favorites` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `user_id` on the `favorites` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - The primary key for the `feedbacks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `feedbacks` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `message` on the `feedbacks` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.
  - You are about to alter the column `email` on the `feedbacks` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(254)`.
  - You are about to alter the column `user_id` on the `feedbacks` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - The primary key for the `fields` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `fields` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `name` on the `fields` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `slug` on the `fields` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(6)`.
  - You are about to alter the column `description` on the `fields` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `city` on the `fields` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `postal_code` on the `fields` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - You are about to alter the column `crop_type_id` on the `fields` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `farm_id` on the `fields` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `owner_id` on the `fields` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `qr_code_url` on the `fields` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - The primary key for the `gleaning_participations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `gleaning_id` on the `gleaning_participations` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `participation_id` on the `gleaning_participations` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - The primary key for the `gleaning_periods` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `gleaning_periods` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `field_id` on the `gleaning_periods` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - The primary key for the `gleanings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `gleanings` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `user_id` on the `gleanings` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `announcement_id` on the `gleanings` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - The primary key for the `likes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `likes` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `announcement_id` on the `likes` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `user_id` on the `likes` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - The primary key for the `notifications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `notifications` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `message` on the `notifications` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `agenda_id` on the `notifications` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `user_id` on the `notifications` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - The primary key for the `participations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `participations` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `announcement_id` on the `participations` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `user_id` on the `participations` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - The primary key for the `reviews` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `reviews` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `rating` on the `reviews` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `content` on the `reviews` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `gleaning_id` on the `reviews` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `user_id` on the `reviews` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `images` on the `reviews` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - The primary key for the `sessions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `sessions` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `user_id` on the `sessions` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - The primary key for the `statistics` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `statistics` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `user_id` on the `statistics` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(21)`.
  - You are about to alter the column `name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(254)`.
  - You are about to alter the column `image` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `bio` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `password_hash` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `resend_contact_id` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `stripe_customer_id` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'NEW_REVIEW';
ALTER TYPE "NotificationType" ADD VALUE 'GLEANING_REMINDER';

-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_userId_fkey";

-- DropForeignKey
ALTER TABLE "agendas" DROP CONSTRAINT "agendas_announcement_id_fkey";

-- DropForeignKey
ALTER TABLE "agendas" DROP CONSTRAINT "agendas_notification_id_fkey";

-- DropForeignKey
ALTER TABLE "agendas" DROP CONSTRAINT "agendas_user_id_fkey";

-- DropForeignKey
ALTER TABLE "announcement_gleaning_periods" DROP CONSTRAINT "announcement_gleaning_periods_announcement_id_fkey";

-- DropForeignKey
ALTER TABLE "announcement_gleaning_periods" DROP CONSTRAINT "announcement_gleaning_periods_gleaning_period_id_fkey";

-- DropForeignKey
ALTER TABLE "announcements" DROP CONSTRAINT "announcements_crop_type_id_fkey";

-- DropForeignKey
ALTER TABLE "announcements" DROP CONSTRAINT "announcements_field_id_fkey";

-- DropForeignKey
ALTER TABLE "announcements" DROP CONSTRAINT "announcements_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_announcement_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "farms" DROP CONSTRAINT "farms_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "favorites" DROP CONSTRAINT "favorites_announcement_id_fkey";

-- DropForeignKey
ALTER TABLE "favorites" DROP CONSTRAINT "favorites_user_id_fkey";

-- DropForeignKey
ALTER TABLE "feedbacks" DROP CONSTRAINT "feedbacks_user_id_fkey";

-- DropForeignKey
ALTER TABLE "fields" DROP CONSTRAINT "fields_crop_type_id_fkey";

-- DropForeignKey
ALTER TABLE "fields" DROP CONSTRAINT "fields_farm_id_fkey";

-- DropForeignKey
ALTER TABLE "fields" DROP CONSTRAINT "fields_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "gleaning_participations" DROP CONSTRAINT "gleaning_participations_gleaning_id_fkey";

-- DropForeignKey
ALTER TABLE "gleaning_participations" DROP CONSTRAINT "gleaning_participations_participation_id_fkey";

-- DropForeignKey
ALTER TABLE "gleaning_periods" DROP CONSTRAINT "gleaning_periods_field_id_fkey";

-- DropForeignKey
ALTER TABLE "gleanings" DROP CONSTRAINT "gleanings_announcement_id_fkey";

-- DropForeignKey
ALTER TABLE "gleanings" DROP CONSTRAINT "gleanings_user_id_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_announcement_id_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_user_id_fkey";

-- DropForeignKey
ALTER TABLE "participations" DROP CONSTRAINT "participations_announcement_id_fkey";

-- DropForeignKey
ALTER TABLE "participations" DROP CONSTRAINT "participations_user_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_gleaning_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_user_id_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "statistics" DROP CONSTRAINT "statistics_user_id_fkey";

-- DropIndex
DROP INDEX "statistics_user_id_key";

-- AlterTable
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_pkey",
ALTER COLUMN "id" SET DATA TYPE CHAR(21),
ALTER COLUMN "userId" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "accounts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "agendas" DROP CONSTRAINT "agendas_pkey",
ALTER COLUMN "id" SET DATA TYPE CHAR(21),
ALTER COLUMN "title" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "announcement_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "notification_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "user_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "agendas_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "announcement_gleaning_periods" DROP CONSTRAINT "announcement_gleaning_periods_pkey",
ALTER COLUMN "announcement_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "gleaning_period_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "announcement_gleaning_periods_pkey" PRIMARY KEY ("announcement_id", "gleaning_period_id");

-- AlterTable
ALTER TABLE "announcements" DROP CONSTRAINT "announcements_pkey",
ALTER COLUMN "id" SET DATA TYPE CHAR(21),
ALTER COLUMN "title" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "slug" SET DATA TYPE CHAR(6),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(2000),
ALTER COLUMN "crop_type_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "field_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "owner_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "images" SET DATA TYPE VARCHAR(255)[],
ADD CONSTRAINT "announcements_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "comments" DROP CONSTRAINT "comments_pkey",
ALTER COLUMN "id" SET DATA TYPE CHAR(21),
ALTER COLUMN "content" SET DATA TYPE VARCHAR(1000),
ALTER COLUMN "announcement_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "user_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "crop_types" DROP CONSTRAINT "crop_types_pkey",
ALTER COLUMN "id" SET DATA TYPE CHAR(21),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ADD CONSTRAINT "crop_types_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "farms" DROP CONSTRAINT "farms_pkey",
ALTER COLUMN "id" SET DATA TYPE CHAR(21),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "slug" SET DATA TYPE CHAR(6),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "city" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "postal_code" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "contact_info" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "owner_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "farms_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "favorites" DROP CONSTRAINT "favorites_pkey",
ALTER COLUMN "id" SET DATA TYPE CHAR(21),
ALTER COLUMN "announcement_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "user_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "favorites_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "feedbacks" DROP CONSTRAINT "feedbacks_pkey",
ALTER COLUMN "id" SET DATA TYPE CHAR(21),
ALTER COLUMN "message" SET DATA TYPE VARCHAR(1000),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(254),
ALTER COLUMN "user_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "fields" DROP CONSTRAINT "fields_pkey",
ALTER COLUMN "id" SET DATA TYPE CHAR(21),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "slug" SET DATA TYPE CHAR(6),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "city" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "postal_code" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "crop_type_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "farm_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "owner_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "qr_code_url" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "fields_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "gleaning_participations" DROP CONSTRAINT "gleaning_participations_pkey",
ALTER COLUMN "gleaning_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "participation_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "gleaning_participations_pkey" PRIMARY KEY ("gleaning_id", "participation_id");

-- AlterTable
ALTER TABLE "gleaning_periods" DROP CONSTRAINT "gleaning_periods_pkey",
ALTER COLUMN "id" SET DATA TYPE CHAR(21),
ALTER COLUMN "field_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "gleaning_periods_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "gleanings" DROP CONSTRAINT "gleanings_pkey",
ALTER COLUMN "id" SET DATA TYPE CHAR(21),
ALTER COLUMN "user_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "announcement_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "gleanings_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "likes" DROP CONSTRAINT "likes_pkey",
ALTER COLUMN "id" SET DATA TYPE CHAR(21),
ALTER COLUMN "announcement_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "user_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "likes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_pkey",
ALTER COLUMN "id" SET DATA TYPE CHAR(21),
ALTER COLUMN "message" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "agenda_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "user_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "participations" DROP CONSTRAINT "participations_pkey",
ALTER COLUMN "id" SET DATA TYPE CHAR(21),
ALTER COLUMN "announcement_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "user_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "participations_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_pkey",
ALTER COLUMN "id" SET DATA TYPE CHAR(21),
ALTER COLUMN "rating" SET DATA TYPE SMALLINT,
ALTER COLUMN "content" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "gleaning_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "user_id" DROP NOT NULL,
ALTER COLUMN "user_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "images" SET DATA TYPE VARCHAR(255)[],
ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_pkey",
ALTER COLUMN "id" SET DATA TYPE CHAR(21),
ALTER COLUMN "user_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "statistics" DROP CONSTRAINT "statistics_pkey",
ALTER COLUMN "id" SET DATA TYPE CHAR(21),
ALTER COLUMN "user_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "statistics_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ADD COLUMN     "accepted_rules" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "id" SET DATA TYPE CHAR(21),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(254),
ALTER COLUMN "image" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "bio" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "password_hash" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "resend_contact_id" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "stripe_customer_id" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "announcement_gleaning_periods_announcement_id_idx" ON "announcement_gleaning_periods"("announcement_id");

-- CreateIndex
CREATE INDEX "announcement_gleaning_periods_gleaning_period_id_idx" ON "announcement_gleaning_periods"("gleaning_period_id");

-- CreateIndex
CREATE INDEX "farms_city_postal_code_idx" ON "farms"("city", "postal_code");

-- CreateIndex
CREATE INDEX "fields_latitude_longitude_idx" ON "fields"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "gleaning_participations_gleaning_id_idx" ON "gleaning_participations"("gleaning_id");

-- CreateIndex
CREATE INDEX "gleaning_participations_participation_id_idx" ON "gleaning_participations"("participation_id");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farms" ADD CONSTRAINT "farms_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_gleaning_id_fkey" FOREIGN KEY ("gleaning_id") REFERENCES "gleanings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
