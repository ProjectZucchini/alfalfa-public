-- Update Achievement data
UPDATE
  `Achievement`
SET
  `imageUrl` = "https://alfalfa.dev/achievements/code-review.jpg",
  `name` = "Review Guru",
  `description` = "Become a master of pull request reviews and unlock the secrets of code scrutiny. Earned for submitting your first code review.",
  `updatedAt` = NOW()
WHERE
  `id` = 30;

UPDATE
  `Achievement`
SET
  `imageUrl` = "https://alfalfa.dev/achievements/code-review-10.jpg",
  `name` = "Review Guru (x10)",
  `description` = "Become a master of pull request reviews and unlock the secrets of code scrutiny. Earned for submitting your 10th code review.",
  `updatedAt` = NOW()
WHERE
  `id` = 31;

UPDATE
  `Achievement`
SET
  `imageUrl` = "https://alfalfa.dev/achievements/code-review-25.jpg",
  `name` = "Review Guru (x25)",
  `description` = "Become a master of pull request reviews and unlock the secrets of code scrutiny. Earned for submitting your 25th code review.",
  `updatedAt` = NOW()
WHERE
  `id` = 32;

UPDATE
  `Achievement`
SET
  `imageUrl` = "https://alfalfa.dev/achievements/code-review-50.jpg",
  `name` = "Review Guru (x50)",
  `description` = "Become a master of pull request reviews and unlock the secrets of code scrutiny. Earned for submitting your 50th code review.",
  `updatedAt` = NOW()
WHERE
  `id` = 33;

UPDATE
  `Achievement`
SET
  `imageUrl` = "https://alfalfa.dev/achievements/code-review-100.jpg",
  `name` = "Review Guru (x100)",
  `description` = "Become a master of pull request reviews and unlock the secrets of code scrutiny. Earned for submitting your 100th code review.",
  `updatedAt` = NOW()
WHERE
  `id` = 34;

UPDATE
  `Achievement`
SET
  `imageUrl` = "https://alfalfa.dev/achievements/code-review-200.jpg",
  `name` = "Review Guru (x200)",
  `description` = "Become a master of pull request reviews and unlock the secrets of code scrutiny. Earned for submitting your 200th code review.",
  `updatedAt` = NOW()
WHERE
  `id` = 35;
