import { AppProps } from "next/app";
import { ThemeProvider, CssBaseline, CircularProgress } from "@mui/material";
import Layout from "../layout";
import darkTheme from "../styles/theme";
import "../styles/globals.css";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/router";
import Error404Page from "~/components/auth/Error404";
import { match } from "path-to-regexp";

const App = ({ Component, pageProps }: AppProps) => {
  const { loading } = useAuth();
  const router = useRouter();

  const excludedPaths = [
    "/",
    "/auth/login",
    "/auth/forgot-password",
    "/auth/email-verification",
    "/auth/password-reset",
    "/auth/set-password",
    "/auth/error404",
  ];

  const staticPaths = [
    "/Protected/dashboard",
    "/Protected/operators",
    "/Protected/operators/operators-add",
    "/Protected/draw-summary",
    "/Protected/retail-receipt",
    "/Protected/betting-comparisons",
    "/Protected/winning-comparisons",
    "/Protected/device-information",
  ];

  const dynamicPaths = [
    "/Protected/users/:role",
    "/Protected/users/users-view/:role",
    "/Protected/operators/:slug",
    "/Protected/betting-summary/:path",
    "/Protected/winning-summary/:path",
    "/Protected/device-information/device-information-add",
    "/Protected/device-information/device-information-view/:slug",
  ];

  // Check dynamic route match
  const isDynamicMatch = dynamicPaths.some((pattern) => {
    const matcher = match(pattern, { decode: decodeURIComponent });
    return matcher(router.pathname);
  });

  // Check static or excluded match
  const isStaticMatch =
    excludedPaths.includes(router.pathname) || staticPaths.includes(router.pathname);

  const isValidPath = isStaticMatch || isDynamicMatch;
  const isExcludedPath = excludedPaths.includes(router.pathname);

  if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <div className="flex justify-center items-center h-screen">
          <CircularProgress />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {!isValidPath ? (
        <Error404Page />
      ) : isExcludedPath ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </ThemeProvider>
  );
};

export default App;
