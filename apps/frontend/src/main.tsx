import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider, type MantineThemeOverride } from "@mantine/core";
import { router } from "./router";
import { HelmetProvider } from "react-helmet-async";
import { RouterProvider } from "react-router-dom";

const mantineTheme: MantineThemeOverride = {
  colors: {
    brand: [
      "#F8FAF6",
      "#DEECD7",
      "#C5E4B7",
      "#ADE194",
      "#9ACF81",
      "#8ABC72",
      "#7CAA66",
      "#70975E",
      "#67825A",
      "#5E7255",
    ],
    secondary: [
      "#F9F6FA",
      "#E5D7EC",
      "#D5B7E4",
      "#C894E1",
      "#B681CF",
      "#A472BC",
      "#9466AA",
      "#845E97",
      "#755A82",
      "#685572",
    ],
  },
  primaryColor: "brand",
  primaryShade: { light: 4 },
  fontFamily: "Quicksand",
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider theme={mantineTheme} withGlobalStyles withNormalizeCSS>
      <HelmetProvider>
        <RouterProvider router={router} />
      </HelmetProvider>
    </MantineProvider>
  </React.StrictMode>,
);
