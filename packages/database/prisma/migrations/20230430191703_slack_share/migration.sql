-- CreateTable
CREATE TABLE `SlackShare` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `channelId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `slackUserId` INTEGER NOT NULL,
    `userAchievementId` INTEGER NOT NULL,

    UNIQUE INDEX `SlackShare_userAchievementId_key`(`userAchievementId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SlackShare` ADD CONSTRAINT `SlackShare_slackUserId_fkey` FOREIGN KEY (`slackUserId`) REFERENCES `SlackUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SlackShare` ADD CONSTRAINT `SlackShare_userAchievementId_fkey` FOREIGN KEY (`userAchievementId`) REFERENCES `UserAchievement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
