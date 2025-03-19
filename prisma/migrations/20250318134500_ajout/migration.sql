/*
  Warnings:

  - Added the required column `chat_id` to the `Messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `messages` ADD COLUMN `chat_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Chats` (
    `chat_id` INTEGER NOT NULL AUTO_INCREMENT,
    `donneur_id` INTEGER NOT NULL,
    `receveur_id` INTEGER NOT NULL,
    `don_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`chat_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Chats` ADD CONSTRAINT `Chats_donneur_id_fkey` FOREIGN KEY (`donneur_id`) REFERENCES `Users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chats` ADD CONSTRAINT `Chats_receveur_id_fkey` FOREIGN KEY (`receveur_id`) REFERENCES `Users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chats` ADD CONSTRAINT `Chats_don_id_fkey` FOREIGN KEY (`don_id`) REFERENCES `Dons`(`don_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Messages` ADD CONSTRAINT `Messages_chat_id_fkey` FOREIGN KEY (`chat_id`) REFERENCES `Chats`(`chat_id`) ON DELETE CASCADE ON UPDATE CASCADE;
