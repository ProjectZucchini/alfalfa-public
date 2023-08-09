import { Stack, Text, UnstyledButton, createStyles, rem } from "@mantine/core";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SlackIcon } from "../icons/SlackIcon";

const useStyles = createStyles((theme) => ({
  link: {
    alignItems: "center",
    color: theme.black,
    backgroundColor: theme.white,
    border: `1px solid ${theme.colors.gray[3]}`,
    borderRadius: "4px",
    display: "inline-flex",
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: rem(18),
    fontWeight: 600,
    justifyContent: "center",
    textDecoration: "none",
    paddingTop: rem(10),
    paddingBottom: rem(10),
    paddingLeft: rem(16),
    paddingRight: rem(16),
  },

  iconWrapper: {
    alignItems: "center",
    display: "inline-flex",
    marginRight: rem(16),
  },

  disabled: {
    cursor: "not-allowed",
    pointerEvents: "none",
    opacity: "0.4",
    filter: "alpha(opacity=40)",
  },
}));

export function SlackButton() {
  const navigate = useNavigate();
  const { classes } = useStyles();

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();

      return;
      navigate(import.meta.env.VITE_SLACK_INSTALL_URL);
    },
    [navigate],
  );

  return (
    <Stack spacing="xs" style={{ gap: "0.2rem" }} align="center">
      <Text ff="Greycliff CF, Pacifico" style={{ fontSize: rem(32) }}>
        &#129395; Beta coming soon! &#129395;
      </Text>
      <UnstyledButton
        onClick={handleClick}
        disabled
        className={classes.disabled}
      >
        <a className={classes.link}>
          <div className={classes.iconWrapper}>
            <SlackIcon height={"24px"} width={"24px"} />
          </div>
          Add to Slack
        </a>
      </UnstyledButton>
    </Stack>
  );
}
