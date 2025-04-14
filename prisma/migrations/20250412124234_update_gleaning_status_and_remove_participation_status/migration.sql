/*
  Warnings:

  - The values [PENDING,ACCEPTED] on the enum `GleaningStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `status` on the `participations` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GleaningStatus_new" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
ALTER TABLE "gleanings" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "gleanings" ALTER COLUMN "status" TYPE "GleaningStatus_new" USING ("status"::text::"GleaningStatus_new");
ALTER TYPE "GleaningStatus" RENAME TO "GleaningStatus_old";
ALTER TYPE "GleaningStatus_new" RENAME TO "GleaningStatus";
DROP TYPE "GleaningStatus_old";
ALTER TABLE "gleanings" ALTER COLUMN "status" SET DEFAULT 'NOT_STARTED';
COMMIT;

-- AlterTable
ALTER TABLE "gleanings" ADD COLUMN     "expected_participants" INTEGER,
ALTER COLUMN "status" SET DEFAULT 'NOT_STARTED';

-- AlterTable
ALTER TABLE "participations" DROP COLUMN "status";

-- DropEnum
DROP TYPE "ParticipationStatus";
