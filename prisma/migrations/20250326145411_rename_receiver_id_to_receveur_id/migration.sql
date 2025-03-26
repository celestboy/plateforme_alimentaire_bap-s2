/*
  Warnings:

  - You are about to drop the column `receiver_id` on the `dons` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `dons` DROP COLUMN `receiver_id`,
    ADD COLUMN `receveur_id` INTEGER NULL;
