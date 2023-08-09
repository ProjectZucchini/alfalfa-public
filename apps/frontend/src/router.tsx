import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { Home } from "./screens/Home";
import { GithubConnect } from "./screens/GithubConnect";
import { HowItWorks } from "./screens/HowItWorks";
import { InstallSuccess } from "./screens/InstallSuccess";
import { Pricing } from "./screens/Pricing";
import { PrivacyPolicy } from "./screens/PrivacyPolicy";
import { TermsOfService } from "./screens/TermsOfService";

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/connect-github",
        element: <GithubConnect />,
      },
      {
        path: "/how-it-works",
        element: <HowItWorks />,
      },
      {
        path: "/pricing",
        element: <Pricing />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/success",
        element: <InstallSuccess />,
      },
      {
        path: "/terms-of-service",
        element: <TermsOfService />,
      },
    ],
  },
]);
