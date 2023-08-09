import {
  createStyles,
  Center,
  Title,
  Image,
  Stack,
  Text,
  Grid,
  rem,
} from "@mantine/core";
import { HomeCard, type HomeCardColors } from "../HomeCard";

const useStyles = createStyles(
  (
    theme,
    {
      color,
      imageAlign,
    }: { color: HomeCardColors; imageAlign: "left" | "right" },
  ) => ({
    text: {
      alignItems: imageAlign === "right" ? "flex-end" : "flex-start",
      textAlign: imageAlign === "right" ? "right" : "left",

      [theme.fn.smallerThan("lg")]: {
        alignItems: "center",
        textAlign: "center",
      },
    },

    title: {
      [theme.fn.smallerThan("xs")]: {
        fontSize: rem(26),
      },
    },

    description: {
      [theme.fn.smallerThan("xs")]: {
        fontSize: theme.fontSizes.md,
      },
    },

    separator: {
      backgroundColor: theme.colors[color][7],
      width: rem(80),
      height: rem(2),
      marginTop: theme.spacing.sm,
    },
  }),
);

interface HalfImageCardProps {
  title: string;
  description: string;
  imgUrl: string;
  imgAlt: string;
  imageAlign?: "left" | "right";
  color?: HomeCardColors;
}

export function HalfImageCard({
  title,
  description,
  imgUrl,
  imgAlt,
  imageAlign = "right",
  color = "brand",
}: HalfImageCardProps) {
  const { classes } = useStyles({ color, imageAlign });

  return (
    <HomeCard color={color}>
      <Grid align="center">
        <Grid.Col
          md={12}
          lg={5}
          orderMd={1}
          orderLg={imageAlign === "right" ? 1 : 2}
        >
          <Stack className={classes.text}>
            <Title className={classes.title}>{title}</Title>
            <div className={classes.separator} />
            <Text size="lg" className={classes.description}>
              {description}
            </Text>
          </Stack>
        </Grid.Col>

        <Grid.Col
          md={12}
          lg={7}
          orderMd={2}
          orderLg={imageAlign === "right" ? 2 : 1}
        >
          <Center>
            <Image radius="lg" maw="745px" src={imgUrl} alt={imgAlt} />
          </Center>
        </Grid.Col>
      </Grid>
    </HomeCard>
  );
}
