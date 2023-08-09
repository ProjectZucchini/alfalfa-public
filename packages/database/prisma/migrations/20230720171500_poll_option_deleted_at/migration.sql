/*
  Warnings:

  - You are about to drop the column `number` on the `PollOption` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `PollOption` DROP COLUMN `number`,
    ADD COLUMN `deletedAt` DATETIME(3) NULL;
