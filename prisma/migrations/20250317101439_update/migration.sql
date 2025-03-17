/*
  Warnings:

  - Made the column `img_url` on table `dons` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `dons` MODIFY `img_url` VARCHAR(191) NOT NULL;
