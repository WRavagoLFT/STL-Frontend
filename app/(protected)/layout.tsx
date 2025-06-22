"use client";

import { useAuth } from "~/utils/useAuth";
import { usePathname } from "next/navigation";
import { ThemeProvider, CssBaseline, CircularProgress } from "@mui/material";
import Error404Page from "~/components/auth/Error404";
import Layout from "~/layout";
import { match } from "path-to-regexp";
import lightTheme from "~/styles/theme";

const staticPaths = [
  "/dashboard",
  "/operators",
  "/operators/operators-add",
  "/retail-receipt",
  "/device-information",
  "/device-information/device-information-add",
  "/draw-summary",
  "/bets-comparisons",
  "/wins-comparisons",
];

const dynamicPaths = [
  "/users/:role",
  "/users/users-view/:slug",
  "/operators/operators-view/:slug",
  "/device-information/device-information-view/:slug",
  "/winning-summary/:slug",
  "/betting-summary/:mainSlug",
  "/betting-summary/:mainSlug/betting-comparisons/:comparisonSlug",
  "/winning-summary/:mainSlug/winning-comparisons/:comparisonSlug",
];

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();
  const pathname = usePathname();
  const rawPath = pathname?.split("?")[0] || "/";

  const isDynamicMatch = dynamicPaths.some((pattern) =>
    match(pattern, { decode: decodeURIComponent })(rawPath)
  );
  const isStaticMatch = staticPaths.includes(rawPath);
  const isValidPath = isStaticMatch || isDynamicMatch;

  if (loading) {
    return (
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <div className="flex justify-center items-center h-screen">
          <CircularProgress />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      {!isValidPath ? <Error404Page /> : <Layout>{children}</Layout>}
    </ThemeProvider>
  );
}
