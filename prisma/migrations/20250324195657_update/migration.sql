/*
  Warnings:

  - You are about to drop the column `formStatus` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the column `isForm` on the `chats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `chats` DROP COLUMN `formStatus`,
    DROP COLUMN `isForm`,
    ADD COLUMN `isFormActive` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isFormRejected` BOOLEAN NOT NULL DEFAULT false;
