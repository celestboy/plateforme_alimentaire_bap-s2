/*
  Warnings:

  - You are about to drop the column `isFormAccepted` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the column `isFormActive` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the column `isFormRejected` on the `chats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `chats` DROP COLUMN `isFormAccepted`,
    DROP COLUMN `isFormActive`,
    DROP COLUMN `isFormRejected`,
    ADD COLUMN `donStatus` ENUM('NONE', 'PENDING', 'ACCEPTED', 'REFUSED') NOT NULL DEFAULT 'NONE';
