-- DropForeignKey
ALTER TABLE `dons` DROP FOREIGN KEY `Dons_donneur_id_fkey`;

-- DropIndex
DROP INDEX `Dons_donneur_id_fkey` ON `dons`;

-- AddForeignKey
ALTER TABLE `Dons` ADD CONSTRAINT `Dons_donneur_id_fkey` FOREIGN KEY (`donneur_id`) REFERENCES `Users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
