import {
  Center,
  Container,
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

export function TermsOfService() {
  const { classes } = useStyles();

  return (
    <>
      <Helmet>
        <title>Alfalfa - Terms of Service</title>
        <link rel="canonical" href="https://alfalfa.dev/terms-of-service" />
      </Helmet>
      <Container size="lg">
        <Paper radius="lg" p="sm">
          <Stack>
            <Title align="center">Terms of Service</Title>
            <Center>
              <div className={classes.separator} />
            </Center>
            <Center>
              <Text italic size="sm">
                Last Updated: May 22, 2023
              </Text>
            </Center>

            <Text>
              These Terms of Service (&quot;Terms&quot;) govern your use of
              Alfalfa.dev (&quot;Alfalfa&quot;) and its integration with
              external services. By accessing or using Alfalfa, you agree to
              these Terms. If you do not agree with any part of these Terms, you
              must not use Alfalfa.
            </Text>

            <Title order={3}>1) Scope of Service</Title>
            <Text>
              Alfalfa&apos;s features may be updated or modified from time to
              time at our sole discretion, and we may suspend or terminate the
              service at any time.
            </Text>

            <Title order={3}>2) Account Registration</Title>
            <Text>
              To use Alfalfa, you must have a valid Slack account and grant
              Alfalfa the necessary permissions to integrate with your Slack
              workspace. You also need to authenticate your GitHub account to
              enable the GitHub integration features of Alfalfa. You are
              responsible for maintaining the confidentiality of your account
              credentials, and you agree to accept responsibility for all
              activities that occur under your account.
            </Text>

            <Title order={3}>3) Fees for Service</Title>
            <Text>
              Some aspects of the Service may be provided for free for a limited
              time (the &quot;trial&quot; period). After the trial period, you
              will be billed on a monthly basis in advance for continuing use of
              the service.
            </Text>

            <Title order={3}>4) User Obligations</Title>
            <Text>
              You agree to use Alfalfa in compliance with all applicable laws
              and regulations. You are solely responsible for the content you
              post or share using Alfalfa. You shall not use Alfalfa for any
              unlawful, infringing, offensive, or harmful purposes. You agree
              not to abuse or disrupt the functionality of Alfalfa or interfere
              with the experience of other users.
            </Text>

            <Title order={3}>5) Intellectual Property</Title>
            <Text>
              Alfalfa, including all associated intellectual property rights, is
              owned by Alfalfa.dev or its licensors. You agree not to reproduce,
              modify, distribute, or create derivative works based on Alfalfa
              without our prior written consent. Any feedback, suggestions, or
              ideas you provide regarding Alfalfa may be used by us without any
              obligation to compensate you.
            </Text>

            <Title order={3}>6) Limitation of Liability</Title>
            <Text>
              To the extent permitted by applicable law, in no event shall
              Alfalfa.dev, its officers, directors, employees, or affiliates be
              liable for any direct, indirect, incidental, special, or
              consequential damages arising out of or in connection with your
              use of Alfalfa. You acknowledge that the use of Alfalfa is at your
              own risk.
            </Text>

            <Title order={3}>7) Modifications to the Terms</Title>
            <Text>
              We reserve the right to modify or update these Terms at any time.
              Any changes will be effective immediately upon posting the revised
              Terms on our website or notifying you. Your continued use of
              Alfalfa after the effective date of the revised Terms constitutes
              your acceptance of the updated Terms.
            </Text>

            <Title order={3}>8) Termination</Title>
            <Text>
              We may, in our sole discretion, suspend or terminate your access
              to Alfalfa without prior notice if we believe you have violated
              these Terms or engaged in any unauthorized or illegal activities.
              Upon termination, your rights to use Alfalfa will immediately
              cease, and any data associated with your account may be deleted.
            </Text>
            <Text>
              You may cancel at any time for any reason. You will not be
              refunded for the month in advance that you were billed for. You
              can continue using the service until the time that was billed for
              as elapsed.
            </Text>

            <Title order={3}>9) Governing Law and Jurisdiction</Title>
            <Text>
              These Terms shall be governed by and construed in accordance with
              the laws of Ontario. Any disputes arising out of or in connection
              with these Terms shall be subject to the exclusive jurisdiction of
              the courts of Ontario.
            </Text>

            <Text>
              Please review these Terms carefully. If you have any questions or
              concerns regarding these Terms, please contact us at{" "}
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
