-- Update Achievement data
UPDATE
  `Achievement`
SET
  `imageUrl` = "https://alfalfa.dev/achievements/gotta-go-fast.jpg",
  `name` = "There's no time to waste!",
  `description` = "Every second counts when your contributions are this important. Earned for having your pull request approved within 1 minute.",
  `updatedAt` = NOW()
WHERE
  `id` = 10;
