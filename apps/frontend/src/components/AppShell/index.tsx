import { AppShell as MantineAppShell } from "@mantine/core";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Outlet } from "react-router-dom";

const headerLinks: { link: string; label: string }[] = [
  {
    link: "/how-it-works",
    label: "How It Works",
  },
  {
    link: "/pricing",
    label: "Pricing",
  },
];

const footerLinks: { link: string; label: string }[] = [
  {
    link: "/privacy-policy",
    label: "Privacy Policy",
  },
  {
    link: "/terms-of-service",
    label: "Terms of Service",
  },
];

export function AppShell() {
  return (
    <MantineAppShell
      padding="md"
      fixed={false}
      header={<Header links={headerLinks} />}
      footer={<Footer links={footerLinks} />}
      styles={(theme) => ({
        root: {
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100vh - 1px)",
        },
        body: {
          flex: 1,
        },
        main: {
          backgroundColor: theme.colors.gray[0],
        },
      })}
    >
      <Outlet />
    </MantineAppShell>
  );
}
