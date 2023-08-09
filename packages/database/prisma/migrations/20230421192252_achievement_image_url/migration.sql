/*
  Warnings:

  - Added the required column `imageUrl` to the `Achievement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Achievement` ADD COLUMN `imageUrl` VARCHAR(191) NOT NULL;
