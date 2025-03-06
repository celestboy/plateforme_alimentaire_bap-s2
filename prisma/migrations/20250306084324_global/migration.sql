/*
  Warnings:

  - A unique constraint covering the columns `[commerce_name]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[adresse_commerce]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `dons` MODIFY `img_url` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `adresse_commerce` VARCHAR(191) NULL,
    ADD COLUMN `commerce_name` VARCHAR(191) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `user_type` ENUM('Particulier', 'Commerçant') NOT NULL DEFAULT 'Particulier',
    MODIFY `username` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Users_commerce_name_key` ON `Users`(`commerce_name`);

-- CreateIndex
CREATE UNIQUE INDEX `Users_adresse_commerce_key` ON `Users`(`adresse_commerce`);
