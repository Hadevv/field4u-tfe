/*
  Warnings:

  - You are about to drop the column `accepted_rules` on the `users` table. All the data in the column will be lost.
  - Added the required column `city` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postal_code` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "accepted_rules",
ADD COLUMN     "accept_geolocation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "city" VARCHAR(50) NOT NULL,
ADD COLUMN     "postal_code" VARCHAR(10) NOT NULL,
ADD COLUMN     "rules_accepted_at" TIMESTAMP(3),
ADD COLUMN     "terms_accepted_at" TIMESTAMP(3);
