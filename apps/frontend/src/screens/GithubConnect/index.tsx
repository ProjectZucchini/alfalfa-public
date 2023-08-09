import {
  Button,
  Center,
  Container,
  Group,
  Paper,
  Stack,
  Stepper,
  Text,
  Title,
  createStyles,
  rem,
} from "@mantine/core";
import { IconExclamationCircle } from "@tabler/icons-react";
import { Helmet } from "react-helmet-async";
import { GitHubIcon } from "../../components/icons/GitHubIcon";
import { SlackButton } from "../../components/SlackButton";

const useStyles = createStyles((theme) => ({
  separator: {
    backgroundColor: theme.colors["brand"][7],
    width: rem(80),
    height: rem(2),
  },

  warningContainer: {
    border: "0.0625rem solid transparent",
    borderColor: theme.colors["blue"][4],
  },

  warningHeader: {
    backgroundColor: theme.colors["blue"][1],
    color: theme.colors["blue"][4],
    marginLeft: "-1rem",
    marginRight: "-1rem",
    paddingLeft: "1rem",
    paddingRight: "1rem",
    paddingTop: rem(12),
    paddingBottom: rem(12),
  },
}));

export function GithubConnect() {
  const { classes } = useStyles();

  return (
    <>
      <Helmet>
        <title>Alfalfa - Setup GitHub</title>
        <link rel="canonical" href="https://alfalfa.dev/connect-github" />
      </Helmet>
      <Container size="lg">
        <Paper radius="lg" p="sm">
          <Stack>
            <Title align="center">Connect your GitHub Organization</Title>
            <Center>
              <div className={classes.separator} />
            </Center>

            <Container
              w={{
                sm: "40rem",
                md: "58rem",
                lg: "75rem",
                xl: "82.5rem",
              }}
            >
              <Stepper active={1}>
                <Stepper.Step label="Slack" description="Install Slack app" />
                <Stepper.Step label="GitHub" description="Install GitHub app" />
                <Stepper.Step label="Complete" description="Success!" />
              </Stepper>
            </Container>

            <Text size="xl" align="center">
              Now that you&apos;ve added Alfalfa to Slack, it&apos;s time to
              install the Alfalfa GitHub app to get your data flowing! Click the
              button to start the GitHub installation process.
            </Text>
            <Center>
              <Group spacing="xs">
                <span style={{ fontSize: "28px" }}> &#127881; </span>
                <Button
                  leftIcon={<GitHubIcon height={"24px"} width={"24px"} />}
                  variant="outline"
                  color="gray.4"
                  component="a"
                  href={`https://github.com/apps/${
                    import.meta.env.VITE_GITHUB_APP_NAME
                  }/installations/new`}
                  size="lg"
                  styles={{
                    label: {
                      color: "black",
                    },
                  }}
                >
                  Install GitHub App
                </Button>
                <span style={{ fontSize: "28px" }}> &#127881; </span>
              </Group>
            </Center>

            <Container size="sm" className={classes.warningContainer} mt={16}>
              <Stack>
                <Group className={classes.warningHeader}>
                  <IconExclamationCircle size="1.5rem" />
                  <Title order={5} color="black">
                    Watch out!
                  </Title>
                </Group>

                <Stack spacing="sm" pb={16}>
                  <Text size="lg">
                    If you haven&apos;t installed the Alfalfa Slack app yet,
                    install it first using the following button. You&apos;ll be
                    brought back to this page to complete the GitHub step.
                  </Text>
                  <Center>
                    <SlackButton />
                  </Center>
                </Stack>
              </Stack>
            </Container>
          </Stack>
        </Paper>
      </Container>
    </>
  );
}
