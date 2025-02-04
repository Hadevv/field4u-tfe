/*
  Warnings:

  - You are about to drop the column `total_glanages` on the `statistics` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_password_hash_key";

-- DropIndex
DROP INDEX "users_resend_contact_id_key";

-- AlterTable
ALTER TABLE "statistics" DROP COLUMN "total_glanages",
ADD COLUMN     "total_gleanings" INTEGER NOT NULL DEFAULT 0;
