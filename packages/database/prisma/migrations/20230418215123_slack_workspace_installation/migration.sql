/*
  Warnings:

  - Added the required column `installation` to the `SlackWorkspace` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `SlackWorkspace` ADD COLUMN `installation` JSON NOT NULL;
