-- Drop ID # based achievements
DELETE FROM
  `GitHubEventAchievement`
WHERE
  `achievementId` IN (24, 25, 26, 27);

DELETE FROM
  `Achievement`
WHERE
  `id` IN (24, 25, 26, 27);

-- Update Achievement data
UPDATE
  `Achievement`
SET
  `description` = "You're a developer now, dog! Earned for opening your first pull request.",
  `updatedAt` = NOW()
WHERE
  `id` = 2;

UPDATE
  `Achievement`
SET
  `name` = "Stay Awhile and Listen",
  `description` = "You've identified the work to be done. Earned for opening your first issue.",
  `updatedAt` = NOW()
WHERE
  `id` = 3;

UPDATE
  `Achievement`
SET
  `name` = "Garbage Day",
  `description` = "Keeping it clean. Earned for merging a pull request that removes more lines of code than it adds.",
  `imageUrl` = "https://avatars.slack-edge.com/2023-04-17/5135494017713_8d53b689291b04c3a400_512.png",
  `updatedAt` = NOW()
WHERE
  `id` = 4;

UPDATE
  `Achievement`
SET
  `name` = "Sparking Joy",
  `description` = "Keep only the code that speaks to your heart. Earned for merging a Pull Request containing only deleted lines of code.",
  `updatedAt` = NOW()
WHERE
  `id` = 5;

UPDATE
  `Achievement`
SET
  `name` = "The Fixer",
  `imageUrl` = "https://alfalfa.dev/achievements/first-review.jpg",
  `updatedAt` = NOW()
WHERE
  `id` = 6;

UPDATE
  `Achievement`
SET
  `description` = "Someone's gotta be first. Earned for merging the first pull request of the repository.",
  `updatedAt` = NOW()
WHERE
  `id` = 7;

UPDATE
  `Achievement`
SET
  `name` = "Hasta La Vista, Baby",
  `description` = "Just like the terminator, you've got great one-liners. Earned for changing only a single line of code in a pull request.",
  `imageUrl` = "https://www.alfalfa.dev/achievements/hasta-la-vista.jpg",
  `updatedAt` = NOW()
WHERE
  `id` = 8;

UPDATE
  `Achievement`
SET
  `name` = "Johnny-On-The-Spot",
  `description` = "You were right there when needed. Earned for approving a Pull Request within 1 minute of it being opened.",
  `updatedAt` = NOW()
WHERE
  `id` = 9;

UPDATE
  `Achievement`
SET
  `name` = "Friends in High Places",
  `updatedAt` = NOW()
WHERE
  `id` = 10;

UPDATE
  `Achievement`
SET
  `name` = "The Gambler",
  `description` = "You did *not* know when to hold 'em. Earned for merging a pull request without any approvals.",
  `imageUrl` = "https://avatars.slack-edge.com/2023-04-17/5135494017713_8d53b689291b04c3a400_512.png",
  `updatedAt` = NOW()
WHERE
  `id` = 11;

UPDATE
  `Achievement`
SET
  `name` = "Merge-O-Rama (x5)",
  `description` = "Never stop never stopping. Earned for merging your 5th pull request in an organization.",
  `updatedAt` = NOW()
WHERE
  `id` = 12;

UPDATE
  `Achievement`
SET
  `name` = "Merge-O-Rama (x10)",
  `description` = "Never stop never stopping. Earned for merging your 10th pull request in an organization.",
  `updatedAt` = NOW()
WHERE
  `id` = 13;

UPDATE
  `Achievement`
SET
  `name` = "Merge-O-Rama (x25)",
  `description` = "Never stop never stopping. Earned for merging your 25th pull request in an organization.",
  `updatedAt` = NOW()
WHERE
  `id` = 14;

UPDATE
  `Achievement`
SET
  `name` = "Merge-O-Rama (x50)",
  `description` = "Never stop never stopping. Earned for merging your 50th pull request in an organization.",
  `updatedAt` = NOW()
WHERE
  `id` = 15;

UPDATE
  `Achievement`
SET
  `name` = "Merge-O-Rama (x100)",
  `description` = "Never stop never stopping. Earned for merging your 100th pull request in an organization.",
  `updatedAt` = NOW()
WHERE
  `id` = 16;

UPDATE
  `Achievement`
SET
  `name` = "Merge-O-Rama (x200)",
  `description` = "Never stop never stopping. Earned for merging your 200th pull request in an organization.",
  `updatedAt` = NOW()
WHERE
  `id` = 17;

UPDATE
  `Achievement`
SET
  `name` = "Rome Wasn't Built in a Day (x10)",
  `description` = "It takes many small steps to build a great product. Earned for merging the 10th PR of a repository",
  `updatedAt` = NOW()
WHERE
  `id` = 18;

UPDATE
  `Achievement`
SET
  `name` = "Rome Wasn't Built in a Day (x25)",
  `description` = "It takes many small steps to build a great product. Earned for merging the 25th PR of a repository",
  `updatedAt` = NOW()
WHERE
  `id` = 19;

UPDATE
  `Achievement`
SET
  `name` = "Rome Wasn't Built in a Day (x50)",
  `description` = "It takes many small steps to build a great product. Earned for merging the 50th PR of a repository",
  `updatedAt` = NOW()
WHERE
  `id` = 20;

UPDATE
  `Achievement`
SET
  `name` = "Rome Wasn't Built in a Day (x100)",
  `description` = "It takes many small steps to build a great product. Earned for merging the 100th PR of a repository",
  `updatedAt` = NOW()
WHERE
  `id` = 21;

UPDATE
  `Achievement`
SET
  `name` = "Rome Wasn't Built in a Day (x200)",
  `description` = "It takes many small steps to build a great product. Earned for merging the 200th PR of a repository",
  `updatedAt` = NOW()
WHERE
  `id` = 22;

UPDATE
  `Achievement`
SET
  `name` = "Rome Wasn't Built in a Day (x300)",
  `description` = "It takes many small steps to build a great product. Earned for merging the 300th PR of a repository",
  `updatedAt` = NOW()
WHERE
  `id` = 23;
