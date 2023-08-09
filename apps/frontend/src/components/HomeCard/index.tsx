import { Container, createStyles } from "@mantine/core";

export type HomeCardColors = "brand" | "secondary" | "yellow";

const useStyles = createStyles(
  (theme, { color }: { color: HomeCardColors }) => ({
    wrapper: {
      borderRadius: "1rem",
      backgroundColor: theme.colors[color][1],

      [theme.fn.smallerThan("md")]: {
        width: "100%",
      },
    },
  }),
);

interface HomeCardProps {
  children: any;
  color?: HomeCardColors;
}

export function HomeCard({ children, color = "brand" }: HomeCardProps) {
  const { classes } = useStyles({ color });

  return (
    <Container
      w={{
        md: "58rem",
        lg: "70rem",
        xl: "82.5rem",
      }}
      maw={{
        md: "58rem",
        lg: "70rem",
        xl: "82.5rem",
      }}
      py="xl"
      className={classes.wrapper}
    >
      {children}
    </Container>
  );
}
