import {
  createStyles,
  Center,
  Text,
  Title,
  Card,
  SimpleGrid,
  rem,
} from "@mantine/core";
import {
  IconTrophy,
  IconConfetti,
  IconSeeding,
  IconMoodHeart,
} from "@tabler/icons-react";
import { useMemo } from "react";
import { HomeCard } from "../HomeCard";
import { GitHubIcon } from "../icons/GitHubIcon";
import { SlackIcon } from "../icons/SlackIcon";

function GitHubGridIcon() {
  return <GitHubIcon height={"3.125rem"} width={"3.125rem"} />;
}

function SlackGridIcon() {
  return <SlackIcon height={"3.125rem"} width={"3.125rem"} />;
}

const useStyles = createStyles((theme) => ({
  title: {
    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(26),
    },
  },

  card: {
    border: `${rem(1)} solid ${theme.colorScheme === theme.colors.gray[1]}`,
  },

  separator: {
    width: rem(45),
    height: rem(2),
    marginTop: theme.spacing.sm,
  },
}));

export function FeaturesCards() {
  const { classes, theme } = useStyles();

  const featureData = useMemo(() => {
    return [
      {
        title: "Slack",
        description: `Add the Slack app your workspace to see issued achievements, get notified
        when earning a new one, and share into channels`,
        icon: SlackGridIcon,
        color: theme.colors["gray"][4],
      },
      {
        title: "GitHub",
        description: `The GitHub app tracks issues, pull requests, users, and code contributions across
        configured repositories within an organization`,
        icon: GitHubGridIcon,
        color: theme.colors["blue"][4],
      },
      {
        title: "Celebrate",
        description: "Share achievements with your team and celebrate the wins",
        icon: IconConfetti,
        color: theme.colors["secondary"][4],
      },
      {
        title: "Earn in realtime",
        description:
          "Achievements are issued as engineers create issues, submit PRs, and contribute code changes",
        icon: IconTrophy,
        color: theme.colors["yellow"][4],
      },
      {
        title: "Be amused",
        description: `Alfalfa achievements mark not only milestones but also quirky interactions with your
        codebase and source control tool`,
        icon: IconSeeding,
        color: theme.colors["brand"][4],
      },
      {
        title: "Wholesome",
        description:
          "No NFTs. No Gamification. No employee performance tracking. Just fun and surprising achievements",
        icon: IconMoodHeart,
        color: theme.colors["red"][4],
      },
    ];
  }, [theme.colors]);

  const features = useMemo(
    () =>
      featureData.map((feature) => (
        <Card
          key={feature.title}
          shadow="md"
          radius="md"
          className={classes.card}
          padding="xl"
        >
          <feature.icon size={rem(50)} color={feature.color} />
          <Text size="xl" fw={500} mt="xs">
            {feature.title}
          </Text>
          <div
            className={classes.separator}
            style={{ backgroundColor: feature.color }}
          />
          <Text size="md" mt="sm">
            {feature.description}
          </Text>
        </Card>
      )),
    [classes.card, classes.separator, featureData],
  );

  return (
    <HomeCard>
      <Center>
        <Title className={classes.title}>Get started today</Title>
      </Center>
      <SimpleGrid
        cols={3}
        spacing="xl"
        mt={30}
        breakpoints={[
          { maxWidth: "md", cols: 2 },
          { maxWidth: "sm", cols: 1 },
        ]}
      >
        {features}
      </SimpleGrid>
    </HomeCard>
  );
}
