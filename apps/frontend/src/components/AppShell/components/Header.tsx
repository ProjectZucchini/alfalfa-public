import {
  createStyles,
  Menu,
  Center,
  Header as MantineHeader,
  Container,
  Group,
  Burger,
  rem,
  ThemeIcon,
  Image,
  Title,
  Paper,
  Transition,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons-react";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const HEADER_HEIGHT = rem(60);

const useStyles = createStyles((theme) => ({
  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  dropdown: {
    position: "absolute",
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: "hidden",

    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  headerLink: {
    color: theme.black,
    textDecoration: "none",
  },

  inner: {
    height: HEADER_HEIGHT,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color: theme.colors.gray[7],
    fontSize: theme.fontSizes.md,
    fontWeight: 800,

    "&:hover": {
      backgroundColor: theme.colors.gray[0],
    },

    [theme.fn.smallerThan("sm")]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  linkLabel: {
    marginRight: rem(5),
  },
}));

interface Link {
  link: string;
  label: string;
}

interface HeaderActionProps {
  links: {
    link: string;
    label: string;
    links?: Link[];
  }[];
}

export function Header({ links }: HeaderActionProps) {
  const { classes } = useStyles();
  const [opened, { toggle, close }] = useDisclosure(false);
  const navigate = useNavigate();

  const handleMenuClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, link: Link) => {
      event.preventDefault();
      close();
      navigate(link.link);
    },
    [close, navigate],
  );

  const items = useMemo(
    () =>
      links.map((link) => {
        const menuItems = link.links?.map((item) => (
          <Menu.Item key={item.link}>{item.label}</Menu.Item>
        ));

        if (menuItems) {
          return (
            <Menu
              key={link.label}
              trigger="hover"
              transitionProps={{ exitDuration: 0 }}
              withinPortal
            >
              <Menu.Target>
                <a
                  href={link.link}
                  className={classes.link}
                  onClick={(event) => event.preventDefault()}
                >
                  <Center>
                    <span className={classes.linkLabel}>{link.label}</span>
                    <IconChevronDown size={rem(12)} stroke={1.5} />
                  </Center>
                </a>
              </Menu.Target>
              <Menu.Dropdown>{menuItems}</Menu.Dropdown>
            </Menu>
          );
        }

        return (
          <UnstyledButton
            key={link.label}
            onClick={(event) => handleMenuClick(event, link)}
          >
            <a href={link.link} className={classes.link}>
              {link.label}
            </a>
          </UnstyledButton>
        );
      }),
    [links, classes.link, classes.linkLabel, handleMenuClick],
  );

  const handleLogoClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      navigate("/");
    },
    [navigate],
  );

  return (
    <MantineHeader height={HEADER_HEIGHT} sx={{ borderBottom: 0 }}>
      <Container className={classes.inner} size="xl">
        <Group>
          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size="sm"
          />
          <Transition transition="pop-top-left" duration={200} mounted={opened}>
            {(styles) => (
              <Paper className={classes.dropdown} withBorder style={styles}>
                {items}
              </Paper>
            )}
          </Transition>

          <UnstyledButton onClick={handleLogoClick}>
            <a href="/" className={classes.headerLink}>
              <Group>
                <ThemeIcon size="xl" color="white">
                  <Image src={"/alfalfa.png"} alt={"Alfalfa logo"}></Image>
                </ThemeIcon>
                <Title>Alfalfa</Title>
              </Group>
            </a>
          </UnstyledButton>
        </Group>
        <Group spacing={5} className={classes.links}>
          {items}
        </Group>
      </Container>
    </MantineHeader>
  );
}
