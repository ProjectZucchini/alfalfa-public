-- Achievements
INSERT INTO
  `Achievement`
VALUES
  (
    1,
    'Madam, in Eden, I\'m Adam',
    'Cracked the palindrome code with divine inspiration! Created a pull request or issue where the ID is a palindrome.',
    1,
    'REPOSITORY',
    NOW(),
    NOW(),
    'https://www.alfalfa.dev/achievements/adam-eve.jpeg'
  ),
  (
    2,
    'The Rookie Requester',
    'Opened your first PR!',
    2,
    'ORGANIZATION',
    NOW(),
    NOW(),
    'https://alfalfa.dev/achievements/poet-tree.jpeg'
  ),
  (
    3,
    'First Issue',
    'Opened your first issue!',
    3,
    'ORGANIZATION',
    NOW(),
    NOW(),
    'https://avatars.slack-edge.com/2023-04-17/5135494017713_8d53b689291b04c3a400_512.png'
  ),
  (
    4,
    'Deleted More',
    'Deleted more lines than added',
    4,
    'ORGANIZATION',
    NOW(),
    NOW(),
    'https://www.alfalfa.dev/achievements/prime-puller.jpeg'
  ),
  (
    5,
    'Sparking Joy',
    'PR only contains deleted lines',
    5,
    'ORGANIZATION',
    NOW(),
    NOW(),
    'https://www.alfalfa.dev/achievements/spark-joy.jpeg'
  ),
  (
    6,
    'First Review',
    'Submitted your first review',
    6,
    'ORGANIZATION',
    NOW(),
    NOW(),
    'https://avatars.slack-edge.com/2023-04-17/5135494017713_8d53b689291b04c3a400_512.png'
  ),
  (
    7,
    'The Prime Puller',
    'Merged the first PR of the project',
    7,
    'REPOSITORY',
    NOW(),
    NOW(),
    'https://www.alfalfa.dev/achievements/prime-puller.jpeg'
  ),
  (
    8,
    'Hasta la vista, baby',
    'Just like the terminator, you\'ve got great one-liners. Earned for changing only a single line of code.',
    8,
    'ORGANIZATION',
    NOW(),
    NOW(),
    'https://www.alfalfa.dev/achievements/hasta-la-vista.jpg'
  ),
  (
    9,
    'Fast PR Approval',
    'Approved a PR super fast. Did you even look at it?',
    9,
    'ORGANIZATION',
    NOW(),
    NOW(),
    'https://avatars.slack-edge.com/2023-04-17/5135494017713_8d53b689291b04c3a400_512.png'
  ),
  (
    10,
    'Received Fast PR Approval',
    'Received a PR approval super fast. Did they even look at it?',
    10,
    'ORGANIZATION',
    NOW(),
    NOW(),
    'https://avatars.slack-edge.com/2023-04-17/5135494017713_8d53b689291b04c3a400_512.png'
  ),
  (
    11,
    'Merged PR No Approval',
    'Merged a PR that had no approvals.',
    11,
    'ORGANIZATION',
    NOW(),
    NOW(),
    'https://alfalfa.dev/achievements/eject-parachute.jpeg'
  );

-- GitHub Events
INSERT INTO
  `GitHubEvent`
VALUES
  (
    1,
    'issues.opened',
    NOW(),
    NOW()
  ),
  (
    2,
    'pull_request.opened',
    NOW(),
    NOW()
  ),
  (
    3,
    'pull_request_review.submitted',
    NOW(),
    NOW()
  ),
  (
    4,
    'pull_request.closed',
    NOW(),
    NOW()
  );

-- Link Achievements to GitHubEvents
INSERT INTO
  `GitHubEventAchievement`
VALUES
  (1, NOW(), NOW(), 1, 1),
  (2, NOW(), NOW(), 3, 1),
  (3, NOW(), NOW(), 1, 2),
  (4, NOW(), NOW(), 2, 2),
  (5, NOW(), NOW(), 6, 3),
  (6, NOW(), NOW(), 9, 3),
  (7, NOW(), NOW(), 10, 3),
  (8, NOW(), NOW(), 4, 4),
  (9, NOW(), NOW(), 5, 4),
  (10, NOW(), NOW(), 7, 4),
  (11, NOW(), NOW(), 8, 4),
  (12, NOW(), NOW(), 11, 4);
