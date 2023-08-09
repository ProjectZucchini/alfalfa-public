import {
  Center,
  Container,
  List,
  Paper,
  Stack,
  Text,
  Title,
  createStyles,
  rem,
} from "@mantine/core";
import { Helmet } from "react-helmet-async";
import { ExampleWorkflow } from "./components/ExampleWorkflow";

const useStyles = createStyles((theme) => ({
  separator: {
    backgroundColor: theme.colors["brand"][7],
    width: rem(80),
    height: rem(2),
  },
}));

export function HowItWorks() {
  const { classes } = useStyles();

  return (
    <>
      <Helmet>
        <title>Alfalfa - How It Works</title>
        <link rel="canonical" href="https://alfalfa.dev/how-it-works" />
      </Helmet>
      <Container size="lg">
        <Stack>
          <Title align="center">How It Works</Title>
          <Paper radius="lg" p="sm">
            <Stack>
              <Title align="center" order={2}>
                Installation
              </Title>
              <Center>
                <div className={classes.separator} />
              </Center>

              <Text>
                Setting up Alfalfa is easy! With only a few clicks, you can be
                fully up and running earning sprouts and sharing your success.
              </Text>

              <Container bg="brand.1" style={{ borderRadius: "1rem" }} p="lg">
                <List withPadding>
                  <List.Item>Add the Slack app</List.Item>
                  <List.Item>Add the GitHub app</List.Item>
                  <List.Item>
                    Configure the mapping between Slack and GitHub users
                  </List.Item>
                  <List.Item>
                    And that&apos;s it! Start earning sprouts right away
                  </List.Item>
                </List>
              </Container>
            </Stack>
          </Paper>

          <Paper radius="lg" p="sm">
            <Stack>
              <Title align="center" order={2}>
                Earning Sprouts
              </Title>
              <Center>
                <div className={classes.separator} />
              </Center>
              <Text>
                Once Alfalfa is connected to your Slack workspace and GitHub
                organization, everything happens automagically! &#129668;
                Create, PRs, issues, reviews, etc. as normal and let Alfalfa do
                its thing.
              </Text>

              <ExampleWorkflow />
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </>
  );
}
