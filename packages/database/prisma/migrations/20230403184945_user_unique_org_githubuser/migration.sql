/*
  Warnings:

  - A unique constraint covering the columns `[organizationId,githubUserId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `githubUserId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_githubUserId_fkey`;

-- AlterTable
ALTER TABLE `User` MODIFY `githubUserId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_organizationId_githubUserId_key` ON `User`(`organizationId`, `githubUserId`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_githubUserId_fkey` FOREIGN KEY (`githubUserId`) REFERENCES `GitHubUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
