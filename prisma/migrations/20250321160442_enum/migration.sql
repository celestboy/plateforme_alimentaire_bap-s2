/*
  Warnings:

  - You are about to alter the column `status` on the `dons` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `dons` MODIFY `status` ENUM('NONE', 'PENDING', 'ACCEPTED', 'REJECTED', 'CANCELED') NOT NULL DEFAULT 'NONE';
