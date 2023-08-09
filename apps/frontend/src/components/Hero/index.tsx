import { createStyles, Title, Text, Container, rem } from "@mantine/core";
import { SlackButton } from "../SlackButton";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    paddingTop: rem(120),
    paddingBottom: rem(40),

    [theme.fn.smallerThan("sm")]: {
      paddingTop: rem(80),
      paddingBottom: rem(60),
    },
  },

  inner: {
    position: "relative",
    zIndex: 1,
  },

  title: {
    textAlign: "center",
    fontWeight: 800,
    fontSize: rem(40),
    marginBottom: theme.spacing.xs,

    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(28),
    },
  },

  highlight: {
    color: theme.colors[theme.primaryColor][7],
  },

  highlightSecondary: {
    color: theme.colors["secondary"][6],
    fontWeight: 800,
  },

  description: {
    textAlign: "center",

    [theme.fn.smallerThan("xs")]: {
      fontSize: theme.fontSizes.md,
    },
  },

  cta: {
    marginTop: theme.spacing.xl,
    display: "flex",
    justifyContent: "center",

    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column",
    },
  },
}));

export function Hero() {
  const { classes } = useStyles();

  return (
    <Container className={classes.wrapper} size={1400}>
      <div className={classes.inner}>
        <Title className={classes.title}>
          <Text component="span" inherit>
            Keep your Engineering team
          </Text>{" "}
          <Text component="span" className={classes.highlight} inherit>
            happy
          </Text>{" "}
          <Text component="span" inherit>
            and
          </Text>{" "}
          <Text component="span" className={classes.highlight} inherit>
            engaged
          </Text>
        </Title>

        <Container p={0} size={600}>
          <Text size="xl" color="gray.7" className={classes.description}>
            <Text component="span" inherit>
              Alfalfa acknowledges engineers&apos; contributions with
            </Text>{" "}
            <Text
              component="span"
              className={classes.highlightSecondary}
              inherit
            >
              fun
            </Text>
            <Text component="span" inherit>
              ,
            </Text>{" "}
            <Text
              component="span"
              className={classes.highlightSecondary}
              inherit
            >
              quirky
            </Text>
            <Text component="span" inherit>
              , and
            </Text>{" "}
            <Text
              component="span"
              className={classes.highlightSecondary}
              inherit
            >
              wholesome
            </Text>{" "}
            <Text component="span" inherit>
              achievements that surprise and delight.
            </Text>
          </Text>
        </Container>

        <div className={classes.cta}>
          <SlackButton />
        </div>
      </div>
    </Container>
  );
}
