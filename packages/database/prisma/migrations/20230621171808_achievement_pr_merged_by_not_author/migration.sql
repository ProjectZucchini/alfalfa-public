-- Add Achievements
INSERT INTO
  `Achievement`
VALUES
  (
    29,
    'When Harry Merged Sally',
    'Earned for merging a pull request authored by another user.',
    29,
    'ORGANIZATION',
    NOW(),
    NOW(),
    'https://www.alfalfa.dev/achievements/perfect-balance.jpg'
  );

INSERT INTO
  `GitHubEventAchievement`
VALUES
  (34, NOW(), NOW(), 29, 4);
