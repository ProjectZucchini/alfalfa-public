-- Add Achievements
INSERT INTO
  `Achievement`
VALUES
  (
    30,
    'The Fixer',
    'Earned for submitting your first code review.',
    30,
    'ORGANIZATION',
    NOW(),
    NOW(),
    'https://alfalfa.dev/achievements/code-review.jpg'
  ),
  (
    31,
    'The Fixer (x10)',
    'Earned for submitting your 10th code review.',
    31,
    'ORGANIZATION',
    NOW(),
    NOW(),
    'https://alfalfa.dev/achievements/code-review-10.jpg'
  ),
  (
    32,
    'The Fixer (x25)',
    'Earned for submitting your 25th code review.',
    32,
    'ORGANIZATION',
    NOW(),
    NOW(),
    'https://alfalfa.dev/achievements/code-review-25.jpg'
  ),
  (
    33,
    'The Fixer (x50)',
    'Earned for submitting your 50th code review.',
    33,
    'ORGANIZATION',
    NOW(),
    NOW(),
    'https://alfalfa.dev/achievements/code-review-50.jpg'
  ),
  (
    34,
    'The Fixer (x100)',
    'Earned for submitting your 100th code review.',
    34,
    'ORGANIZATION',
    NOW(),
    NOW(),
    'https://alfalfa.dev/achievements/code-review-100.jpg'
  ),
  (
    35,
    'The Fixer (x200)',
    'Earned for submitting your 200th code review.',
    35,
    'ORGANIZATION',
    NOW(),
    NOW(),
    'https://alfalfa.dev/achievements/code-review-200.jpg'
  );

-- Link Achievements to GitHubEvents
INSERT INTO
  `GitHubEventAchievement`
VALUES
  (35, NOW(), NOW(), 30, 3),
  (36, NOW(), NOW(), 31, 3),
  (37, NOW(), NOW(), 32, 3),
  (38, NOW(), NOW(), 33, 3),
  (39, NOW(), NOW(), 34, 3),
  (40, NOW(), NOW(), 35, 3);
