import {
  Center,
  Container,
  Grid,
  List,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
  createStyles,
  rem,
} from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import { Helmet } from "react-helmet-async";
import { SlackButton } from "../../components/SlackButton";

const useStyles = createStyles((theme) => ({
  separator: {
    backgroundColor: theme.colors["secondary"][7],
    width: rem(300),
    height: rem(2),
  },

  highlight: {
    color: theme.colors[theme.primaryColor][7],
    fontWeight: 800,
  },
}));

export function Pricing() {
  const { classes } = useStyles();

  return (
    <>
      <Helmet>
        <title>Alfalfa - Pricing</title>
        <link rel="canonical" href="https://alfalfa.dev/pricing" />
      </Helmet>
      <Container size="lg">
        <Stack>
          <Title align="center">Pricing</Title>
          <Grid justify="center" align="center">
            <Grid.Col lg={5}>
              <Paper radius="lg" p="sm">
                <Stack>
                  <Title align="center" order={2}>
                    Free!
                  </Title>
                  <Text size="lg" align="center">
                    Alfalfa is{" "}
                    <Text
                      component="span"
                      className={classes.highlight}
                      inherit
                    >
                      free
                    </Text>{" "}
                    while in the beta phase
                  </Text>
                  <Center>
                    <div className={classes.separator} />
                  </Center>
                  <Center>
                    <SlackButton />
                  </Center>
                  <Center>
                    <div className={classes.separator} />
                  </Center>
                  <List
                    withPadding
                    spacing="xs"
                    icon={
                      <ThemeIcon color="brand" size={24} radius="xl">
                        <IconCircleCheck size="1rem" />
                      </ThemeIcon>
                    }
                  >
                    <List.Item>Unlimited Slack/GitHub users</List.Item>
                    <List.Item>Unlimited GitHub repositories</List.Item>
                    <List.Item>Unlimited achievements</List.Item>
                  </List>
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </>
  );
}
