/*
  Warnings:

  - You are about to drop the column `location` on the `farms` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `fields` table. All the data in the column will be lost.
  - Added the required column `latitude` to the `fields` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `fields` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "farms_location_idx";

-- DropIndex
DROP INDEX "fields_location_idx";

-- AlterTable
ALTER TABLE "farms" DROP COLUMN "location",
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "fields" DROP COLUMN "location",
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE INDEX "fields_latitude_longitude_idx" ON "fields"("latitude", "longitude");
