/*
  Warnings:

  - You are about to drop the column `expected_participants` on the `gleanings` table. All the data in the column will be lost.
  - You are about to drop the `announcement_gleaning_periods` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `gleaning_periods` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "announcement_gleaning_periods" DROP CONSTRAINT "announcement_gleaning_periods_announcement_id_fkey";

-- DropForeignKey
ALTER TABLE "announcement_gleaning_periods" DROP CONSTRAINT "announcement_gleaning_periods_gleaning_period_id_fkey";

-- DropForeignKey
ALTER TABLE "gleanings" DROP CONSTRAINT "gleanings_announcement_id_fkey";

-- AlterTable
ALTER TABLE "announcements" ADD COLUMN     "end_date" TIMESTAMP(3),
ADD COLUMN     "start_date" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "gleanings" DROP COLUMN "expected_participants";

-- DropTable
DROP TABLE "announcement_gleaning_periods";

-- DropTable
DROP TABLE "gleaning_periods";

-- DropEnum
DROP TYPE "GleaningPeriodStatus";

-- AddForeignKey
ALTER TABLE "gleanings" ADD CONSTRAINT "gleanings_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "announcements"("id") ON DELETE CASCADE ON UPDATE CASCADE;
