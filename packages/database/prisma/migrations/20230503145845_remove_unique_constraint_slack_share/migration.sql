ALTER TABLE `SlackShare` DROP CONSTRAINT `SlackShare_userAchievementId_fkey`;

ALTER TABLE `SlackShare` DROP INDEX `SlackShare_userAchievementId_key`;

ALTER TABLE `SlackShare` ADD CONSTRAINT `SlackShare_userAchievementId_fkey` FOREIGN KEY (`userAchievementId`) REFERENCES `UserAchievement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
