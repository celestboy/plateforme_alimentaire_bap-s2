/*
  Warnings:

  - You are about to drop the column `status` on the `dons` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `chats` ADD COLUMN `isFormAccepted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `dons` DROP COLUMN `status`;
