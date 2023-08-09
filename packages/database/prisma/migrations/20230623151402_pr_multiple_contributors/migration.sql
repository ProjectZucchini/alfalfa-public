-- Add Achievements
INSERT INTO
  `Achievement`
VALUES
  (
    24,
    'Tag Team',
    'Earned for co-authoring a pull request.',
    24,
    'ORGANIZATION',
    NOW(),
    NOW(),
    'https://alfalfa.dev/achievements/tag-team.jpg',
    NULL
  );

INSERT INTO
  `GitHubEventAchievement`
VALUES
  (41, NOW(), NOW(), 24, 4);
