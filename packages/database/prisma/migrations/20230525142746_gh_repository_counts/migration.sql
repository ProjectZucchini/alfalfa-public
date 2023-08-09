-- CreateTable
CREATE TABLE `GitHubRepositoryCounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pullRequestsMerged` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `githubRepositoryId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GitHubRepositoryCounts` ADD CONSTRAINT `GitHubRepositoryCounts_githubRepositoryId_fkey` FOREIGN KEY (`githubRepositoryId`) REFERENCES `GitHubRepository`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Backfill existing repositories
INSERT INTO `GitHubRepositoryCounts` (`githubRepositoryId`, `updatedAt`)
SELECT `id`, NOW()
FROM `GitHubRepository`;
