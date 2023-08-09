import {
  Box,
  Center,
  Grid,
  Image,
  Stack,
  Text,
  createStyles,
} from "@mantine/core";

const useStyles = createStyles((theme) => ({
  text: {
    [theme.fn.smallerThan("xs")]: {
      fontSize: theme.fontSizes.md,
    },
  },
}));

export function ExampleWorkflow() {
  const { classes } = useStyles();

  return (
    <Stack spacing="xl">
      <WorkflowSection
        color="secondary"
        imgAlt="Merged pull request"
        imgUrl="./how-it-works/merged-pr.png"
        imgWidth="632px"
        step={1}
      >
        <Text align="center">
          Create and merge a pull request that delivers incredible business
          value (hopefully without any bugs! &#129310;)
        </Text>
      </WorkflowSection>

      <WorkflowSection
        color="brand"
        imageAlign="left"
        imgAlt="Sprout DM"
        imgUrl="./how-it-works/earned-sprout.png"
        step={2}
      >
        <Text align="center" className={classes.text}>
          Alfalfa sees that the pull request was merged, checks if a sprout
          should be given, and slides into your DMs
        </Text>
      </WorkflowSection>

      <WorkflowSection
        color="secondary"
        imgAlt="Celebrate sprout"
        imgUrl="./how-it-works/congrats.png"
        step={3}
      >
        <Text align="center">
          Share the sprout you earned in a channel and celebrate the success
          with your team!
        </Text>
      </WorkflowSection>
    </Stack>
  );
}

interface WorkflowSectionProps {
  children: any;
  color: string;
  imgAlt: string;
  imgUrl: string;
  step: number;
  imageAlign?: "left" | "right";
  imgWidth?: "559px" | "632px";
}

function WorkflowSection({
  children,
  color,
  imgAlt,
  imgUrl,
  step,
  imageAlign = "right",
  imgWidth = "559px",
}: WorkflowSectionProps) {
  return (
    <Grid
      align="center"
      bg={`${color}.1`}
      mx="0.125rem"
      style={{
        borderRadius: "2rem",
      }}
    >
      <Grid.Col
        md={12}
        lg={imgWidth === "559px" ? 5 : 4}
        orderMd={1}
        orderLg={imageAlign === "right" ? 1 : 2}
      >
        <Stack spacing="xs">
          <Center c={`${color === "brand" ? "secondary" : "brand"}.5`}>
            <Box
              sx={(theme) => ({
                backgroundColor:
                  theme.colors[color === "brand" ? "secondary" : "brand"][5],
                borderRadius: "1rem",
                height: "40px",
                width: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              })}
            >
              <Text c="white" fz="1.8rem" fw="900">
                {step}
              </Text>
            </Box>
          </Center>
          {children}
        </Stack>
      </Grid.Col>
      <Grid.Col
        md={12}
        lg={imgWidth === "559px" ? 7 : 8}
        orderMd={2}
        orderLg={imageAlign === "right" ? 2 : 1}
      >
        <Center>
          <Image
            radius="lg"
            maw={imgWidth}
            src={imgUrl}
            alt={imgAlt}
            styles={{
              image: {
                border: "0.0625rem solid transparent",
                borderColor: "grey",
              },
            }}
          ></Image>
        </Center>
      </Grid.Col>
    </Grid>
  );
}
