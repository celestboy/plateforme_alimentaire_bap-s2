/*
  Warnings:

  - You are about to alter the column `status` on the `dons` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `dons` ADD COLUMN `archived` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `status` VARCHAR(191) NOT NULL;
