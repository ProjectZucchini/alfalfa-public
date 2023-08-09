import { Center, Stack } from "@mantine/core";
import { Helmet } from "react-helmet-async";
import { FeaturesCards } from "../../components/FeatureCards";
import { Hero } from "../../components/Hero";
import { SlackButton } from "../../components/SlackButton";
import { HalfImageCard } from "../../components/HalfImageCard";

export function Home() {
  return (
    <>
      <Helmet>
        <title>Alfalfa - Fun, Quirky, Wholesome Achievements</title>
        <link rel="canonical" href="https://alfalfa.dev" />
      </Helmet>
      <Stack>
        <Hero />

        <HalfImageCard
          title="Be surprised when submitting pull requests"
          description="Alfalfa's achievements are designed to be lighthearted and
      enjoyable. They add a bit of fun to your team's daily routine and
      create a positive work environment."
          imgUrl="./earned-achievement.png"
          imgAlt="Earned achievement"
        />

        <HalfImageCard
          title="Share milestones and celebrate together as a team"
          description="Easily share your achievements with your team on Slack. Celebrate
        important milestones in a fun and playful way to acknowledge and reward each
        other's hard work"
          imgUrl="./share-achievement.png"
          imgAlt="Shared achievement"
          color="yellow"
          imageAlign="left"
        />

        <HalfImageCard
          title="Earn rewards for positive code changes and contributions"
          description="Automatically grant achievements while engineers work on issue and
        contribute code based on the types of contributions they make."
          imgUrl="./most-recent.png"
          imgAlt="Most recent achievements"
          color="secondary"
        />

        <FeaturesCards />
        <Center>
          <SlackButton />
        </Center>
      </Stack>
    </>
  );
}
