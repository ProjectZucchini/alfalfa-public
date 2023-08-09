-- Add Achievements
INSERT INTO
  `Achievement`
VALUES
  (
    28,
    'Perfect Harmony',
    'The scales of code have been tipped and leveled. Earned for merging a pull request containing an equal number of lines added and deleted.',
    28,
    'ORGANIZATION',
    NOW(),
    NOW(),
    'https://www.alfalfa.dev/achievements/perfect-balance.jpg'
  );

INSERT INTO
  `GitHubEventAchievement`
VALUES
  (33, NOW(), NOW(), 28, 4);
