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

const useStyles = createStyles((theme) => ({
  separator: {
    backgroundColor: theme.colors["brand"][7],
    width: rem(80),
    height: rem(2),
  },
}));

export function PrivacyPolicy() {
  const { classes } = useStyles();

  return (
    <>
      <Helmet>
        <title>Alfalfa - Privacy Policy</title>
        <link rel="canonical" href="https://alfalfa.dev/privacy-policy" />
      </Helmet>
      <Container size="lg">
        <Paper radius="lg" p="sm">
          <Stack>
            <Title align="center">Privacy Policy</Title>
            <Center>
              <div className={classes.separator} />
            </Center>
            <Center>
              <Text italic size="sm">
                Last Updated: May 22, 2023
              </Text>
            </Center>

            <Text>
              At Alfalfa.dev, we are committed to protecting your privacy. This
              Privacy Policy outlines our practices for handling your personal
              information when you use our website and our applications on Slack
              and GitHub.
            </Text>

            <Title order={3}>1) Information We Collect</Title>
            <Text>
              When you use our website and applications, we may collect the
              following information:
            </Text>
            <Title order={4}>GitHub</Title>
            <Text>
              When the GitHub app is installed, we collect the names of the
              organization, names of the repositories the app has been granted
              access to, and the usernames of the users within the organization.
            </Text>
            <Text>
              While users interact with GitHub, we collect information about
              issues and pull requests including the creator, contents of
              comments, number of lines of code changed, contributors,
              reviewers, and creation/merge times. We{" "}
              <Text component="span" fw={700}>
                do not{" "}
              </Text>{" "}
              store, access, or retrieve the source code itself.
            </Text>

            <Title order={4}>Slack</Title>
            <Text>
              We collect the IDs of the Slack workspace and Slack users that are
              linked to GitHub users.
            </Text>
            <Text>
              We{" "}
              <Text component="span" fw={700}>
                do not{" "}
              </Text>{" "}
              read or process any messages sent on Slack.
            </Text>

            <Title order={4}>Website</Title>
            <Text>
              We usage and analytical information about how users interact with
              our website.
            </Text>

            <Title order={3}>2) How We Use Your Information</Title>
            <Text>We may use your information for the following purposes:</Text>
            <List>
              <List.Item>
                To provide and maintain our application, including to
                personalize your experience.
              </List.Item>
              <List.Item>
                To improve our application and to develop new features and
                functionality.
              </List.Item>
              <List.Item>
                To communicate with you about our application, including to
                respond to your inquiries and provide customer support.
              </List.Item>
              <List.Item>
                To comply with applicable laws and regulations, to enforce our
                Terms of Service, and to protect our rights and the rights of
                others.
              </List.Item>
            </List>

            <Title order={3}>3) Sharing of Your Information</Title>
            <Text>
              We will not sell or transfer your information to any other company
              for any reason without your consent except to provide the service
              you expect. To provide that service, we may share your information
              with third-party service providers who help us to operate our
              application and to provide services to you. These third-party
              service providers include our hosting provider (AWS) and analytics
              provider (Google Analytics).
            </Text>
            <Text>
              We may also share your information in response to a legal request,
              such as a subpoena or court order, if we believe that disclosure
              is necessary to protect our rights, protect your safety or the
              safety of others, or to investigate fraud or other illegal
              activities.
            </Text>

            <Title order={3}>4) Controlling Your Data</Title>
            <Text>
              You have the right to access, correct, or delete your personal
              information that we have collected from you. You can do this by
              contacting us at{" "}
              <a
                href="mailto:support@alfalfa.dev"
                target="_blank"
                rel="noreferrer"
              >
                support@alfalfa.dev
              </a>
              . By using this service, you consent for us to store, use, and
              transfer your data as laid out in this policy.
            </Text>

            <Title order={3}>5) Changes to This Privacy Policy</Title>
            <Text>
              We may update this Privacy Policy from time to time. If we make
              any material changes to this Privacy Policy, we will notify you by
              posting the new Privacy Policy on our website or by sending you an
              email.
            </Text>

            <Title order={3}>6) Contact Us</Title>
            <Text>
              If you have any questions about this Privacy Policy or our
              practices regarding your personal information, please contact us
              at{" "}
              <a
                href="mailto:support@alfalfa.dev"
                target="_blank"
                rel="noreferrer"
              >
                support@alfalfa.dev
              </a>
              .
            </Text>
          </Stack>
        </Paper>
      </Container>
    </>
  );
}
