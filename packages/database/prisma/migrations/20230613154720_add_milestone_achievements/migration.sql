-- Add Achievements
INSERT INTO
  `Achievement`
VALUES
  (
    12,
    'Merged 5 PRs',
    'You\'ve merged 5 PRs!',
    12,
    'ORGANIZATION',
    NOW(),
    NOW(),
    'https://avatars.slack-edge.com/2023-04-17/5135494017713_8d53b689291b04c3a400_512.png'
  ),
  (
    13,
    'Merged 10 PRs',
    'You\'ve merged 10 PRs!',
    13,
    'ORGANIZATION',
    NOW(),
    NOW(),
    'https://avatars.slack-edge.com/2023-04-17/5135494017713_8d53b689291b04c3a400_512.png'
  ),
  (
    14,
    'Merged 25 PRs',
    'You\'ve merged 25 PRs!',
    14,
    'ORGANIZATION',
    NOW(),
    NOW(),
    'https://avatars.slack-edge.com/2023-04-17/5135494017713_8d53b689291b04c3a400_512.png'
  ),
  (
    15,
    'Merged 50 PRs',
    'You\'ve merged 50 PRs!',
    15,
    'ORGANIZATION',
    NOW(),
    NOW(),
    'https://avatars.slack-edge.com/2023-04-17/5135494017713_8d53b689291b04c3a400_512.png'
  ),
  (
    16,
    'Merged 100 PRs',
    'You\'ve merged 100 PRs!',
    16,
    'ORGANIZATION',
    NOW(),
    NOW(),
    'https://avatars.slack-edge.com/2023-04-17/5135494017713_8d53b689291b04c3a400_512.png'
  ),
  (
    17,
    'Merged 200 PRs',
    'You\'ve merged 200 PRs!',
    17,
    'ORGANIZATION',
    NOW(),
    NOW(),
    'https://avatars.slack-edge.com/2023-04-17/5135494017713_8d53b689291b04c3a400_512.png'
  ),
  (
    18,
    'Merged Repository\'s 10th PR',
    'You merged the 10th PR of the repository!',
    18,
    'REPOSITORY',
    NOW(),
    NOW(),
    'https://avatars.slack-edge.com/2023-04-17/5135494017713_8d53b689291b04c3a400_512.png'
  ),
  (
    19,
    'Merged Repository\'s 25th PR',
    'You merged the 25th PR of the repository!',
    19,
    'REPOSITORY',
    NOW(),
    NOW(),
    'https://avatars.slack-edge.com/2023-04-17/5135494017713_8d53b689291b04c3a400_512.png'
  ),
  (
    20,
    'Merged Repository\'s 50th PR',
    'You merged the 50th PR of the repository!',
    20,
    'REPOSITORY',
    NOW(),
    NOW(),
    'https://avatars.slack-edge.com/2023-04-17/5135494017713_8d53b689291b04c3a400_512.png'
  ),
  (
    21,
    'Merged Repository\'s 100th PR',
    'You merged the 100th PR of the repository!',
    21,
    'REPOSITORY',
    NOW(),
    NOW(),
    'https://avatars.slack-edge.com/2023-04-17/5135494017713_8d53b689291b04c3a400_512.png'
  ),
  (
    22,
    'Merged Repository\'s 200th PR',
    'You merged the 200th PR of the repository!',
    22,
    'REPOSITORY',
    NOW(),
    NOW(),
    'https://avatars.slack-edge.com/2023-04-17/5135494017713_8d53b689291b04c3a400_512.png'
  ),
  (
    23,
    'Merged Repository\'s 300th PR',
    'You merged the 300th PR of the repository!',
    23,
    'REPOSITORY',
    NOW(),
    NOW(),
    'https://avatars.slack-edge.com/2023-04-17/5135494017713_8d53b689291b04c3a400_512.png'
  ),
  (
    24,
    'Created the 100th Issue/PR',
    'You created the 100th Issue or PR of the organization!',
    24,
    'ORGANIZATION',
    NOW(),
    NOW(),
    'https://avatars.slack-edge.com/2023-04-17/5135494017713_8d53b689291b04c3a400_512.png'
  ),
  (
    25,
    'Created the 250th Issue/PR',
    'You created the 250th Issue or PR of the organization!',
    25,
    'ORGANIZATION',
    NOW(),
    NOW(),
    'https://avatars.slack-edge.com/2023-04-17/5135494017713_8d53b689291b04c3a400_512.png'
  ),
  (
    26,
    'Created the 500th Issue/PR',
    'You created the 500th Issue or PR of the organization!',
    26,
    'ORGANIZATION',
    NOW(),
    NOW(),
    'https://avatars.slack-edge.com/2023-04-17/5135494017713_8d53b689291b04c3a400_512.png'
  ),
  (
    27,
    'Created the 1000th Issue/PR',
    'You created the 1000th Issue or PR of the organization!',
    27,
    'ORGANIZATION',
    NOW(),
    NOW(),
    'https://avatars.slack-edge.com/2023-04-17/5135494017713_8d53b689291b04c3a400_512.png'
  );

-- Link Achievements to GitHubEvents
INSERT INTO
  `GitHubEventAchievement`
VALUES
  (13, NOW(), NOW(), 24, 1),
  (14, NOW(), NOW(), 25, 1),
  (15, NOW(), NOW(), 26, 1),
  (16, NOW(), NOW(), 27, 1),
  (17, NOW(), NOW(), 24, 2),
  (18, NOW(), NOW(), 25, 2),
  (19, NOW(), NOW(), 26, 2),
  (20, NOW(), NOW(), 27, 2),
  (21, NOW(), NOW(), 12, 4),
  (22, NOW(), NOW(), 13, 4),
  (23, NOW(), NOW(), 14, 4),
  (24, NOW(), NOW(), 15, 4),
  (25, NOW(), NOW(), 16, 4),
  (26, NOW(), NOW(), 17, 4),
  (27, NOW(), NOW(), 18, 4),
  (28, NOW(), NOW(), 19, 4),
  (29, NOW(), NOW(), 20, 4),
  (30, NOW(), NOW(), 21, 4),
  (31, NOW(), NOW(), 22, 4),
  (32, NOW(), NOW(), 23, 4);
