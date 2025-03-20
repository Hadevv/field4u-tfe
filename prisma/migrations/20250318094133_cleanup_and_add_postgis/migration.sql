/*
  Warnings:

  - You are about to drop the column `latitude` on the `farms` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `farms` table. All the data in the column will be lost.
  - You are about to drop the column `crop_type_id` on the `fields` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `fields` table. All the data in the column will be lost.
  - You are about to drop the column `is_available` on the `fields` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `fields` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `fields` table. All the data in the column will be lost.
  - You are about to drop the column `qr_code_url` on the `fields` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `fields` table. All the data in the column will be lost.
  - You are about to drop the column `field_id` on the `gleaning_periods` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `gleanings` table. All the data in the column will be lost.
  - You are about to drop the column `agenda_id` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `announcement_id` on the `participations` table. All the data in the column will be lost.
  - You are about to drop the `agendas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `gleaning_participations` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[announcement_id]` on the table `gleanings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,gleaning_id]` on the table `participations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `location` to the `farms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `fields` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gleaning_id` to the `participations` table without a default value. This is not possible if the table is not empty.
  - Made the column `user_id` on table `reviews` required. This step will fail if there are existing NULL values in that column.

*/
CREATE EXTENSION IF NOT EXISTS postgis;
-- DropForeignKey
ALTER TABLE "agendas" DROP CONSTRAINT "agendas_announcement_id_fkey";

-- DropForeignKey
ALTER TABLE "agendas" DROP CONSTRAINT "agendas_notification_id_fkey";

-- DropForeignKey
ALTER TABLE "agendas" DROP CONSTRAINT "agendas_user_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_announcement_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "fields" DROP CONSTRAINT "fields_crop_type_id_fkey";

-- DropForeignKey
ALTER TABLE "gleaning_participations" DROP CONSTRAINT "gleaning_participations_gleaning_id_fkey";

-- DropForeignKey
ALTER TABLE "gleaning_participations" DROP CONSTRAINT "gleaning_participations_participation_id_fkey";

-- DropForeignKey
ALTER TABLE "gleaning_periods" DROP CONSTRAINT "gleaning_periods_field_id_fkey";

-- DropForeignKey
ALTER TABLE "gleanings" DROP CONSTRAINT "gleanings_user_id_fkey";

-- DropForeignKey
ALTER TABLE "participations" DROP CONSTRAINT "participations_announcement_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_user_id_fkey";

-- DropIndex
DROP INDEX "fields_latitude_longitude_idx";

-- DropIndex
DROP INDEX "fields_slug_idx";

-- DropIndex
DROP INDEX "fields_slug_key";

-- DropIndex
DROP INDEX "gleanings_user_id_announcement_id_key";

-- DropIndex
DROP INDEX "notifications_agenda_id_key";

-- DropIndex
DROP INDEX "participations_user_id_announcement_id_key";

-- AlterTable
ALTER TABLE "announcements" ADD COLUMN     "qr_code_url" VARCHAR(255);

-- AlterTable
ALTER TABLE "farms" DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "location" geography(Point, 4326) NOT NULL;

-- AlterTable
ALTER TABLE "fields" DROP COLUMN "crop_type_id",
DROP COLUMN "description",
DROP COLUMN "is_available",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "qr_code_url",
DROP COLUMN "slug",
ADD COLUMN     "location" geography(Point, 4326) NOT NULL,
ADD COLUMN     "surface" DOUBLE PRECISION,
ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "gleaning_periods" DROP COLUMN "field_id";

-- AlterTable
ALTER TABLE "gleanings" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "agenda_id";

-- AlterTable
ALTER TABLE "participations" DROP COLUMN "announcement_id",
ADD COLUMN     "gleaning_id" CHAR(21) NOT NULL;

-- AlterTable
ALTER TABLE "reviews" ALTER COLUMN "user_id" SET NOT NULL;

-- DropTable
DROP TABLE "agendas";

-- DropTable
DROP TABLE "comments";

-- DropTable
DROP TABLE "gleaning_participations";

-- DropEnum
DROP TYPE "AgendaStatus";

-- CreateIndex
CREATE INDEX "farms_location_idx" ON "farms" USING GIST ("location");

-- CreateIndex
CREATE INDEX "fields_location_idx" ON "fields" USING GIST ("location");

-- CreateIndex
CREATE UNIQUE INDEX "gleanings_announcement_id_key" ON "gleanings"("announcement_id");

-- CreateIndex
CREATE UNIQUE INDEX "participations_user_id_gleaning_id_key" ON "participations"("user_id", "gleaning_id");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participations" ADD CONSTRAINT "participations_gleaning_id_fkey" FOREIGN KEY ("gleaning_id") REFERENCES "gleanings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
