import {
  Center,
  Container,
  Group,
  Image,
  Paper,
  Stack,
  Stepper,
  Text,
  Title,
  createStyles,
  rem,
} from "@mantine/core";
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";

const useStyles = createStyles((theme) => ({
  separator: {
    backgroundColor: theme.colors["brand"][7],
    width: rem(80),
    height: rem(2),
  },
}));

export function InstallSuccess() {
  const { classes } = useStyles();

  const slackRedirect = useMemo(() => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("slack_redirect="))
      ?.split("=")
      .slice(1)
      .join("=");
  }, []);

  return (
    <>
      <Helmet>
        <title>Alfalfa - Installation Success</title>
        <link rel="canonical" href="https://alfalfa.dev/success" />
      </Helmet>
      <Container size="lg">
        <Stack>
          <Paper radius="lg" p="sm">
            <Stack>
              <Group spacing="xs" position="center">
                <span style={{ fontSize: "28px" }}> &#127882; </span>
                <Title>Installation Success!</Title>
                <span style={{ fontSize: "28px" }}> &#127882; </span>
              </Group>
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
                <Stepper active={3}>
                  <Stepper.Step label="Slack" description="Install Slack app" />
                  <Stepper.Step
                    label="GitHub"
                    description="Install GitHub app"
                  />
                  <Stepper.Step label="Complete" description="Success!" />
                </Stepper>
              </Container>

              <Text size="xl" align="center">
                You&apos;ve completed all the installations and are ready to go.
                Add the Alfalfa app within Slack
                {slackRedirect && (
                  <Text span>
                    {" "}
                    (or click{" "}
                    <a href={`https://slack.com/app_redirect?${slackRedirect}`}>
                      here to go directly
                    </a>
                    )
                  </Text>
                )}{" "}
                and configure the Slack and GitHub username mappings to begin
                the fun!
              </Text>
            </Stack>
          </Paper>
          <Center>
            <Image
              radius="lg"
              maw="950px"
              src="./app-home.png"
              alt="App home"
              styles={{
                image: {
                  border: "0.0625rem solid transparent",
                  borderColor: "black",
                },
              }}
            />
          </Center>
        </Stack>
      </Container>
    </>
  );
}
