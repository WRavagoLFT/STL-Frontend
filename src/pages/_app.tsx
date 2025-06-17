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
  //const rawPath = router.asPath.split("?")[0];

  const aliasMap: Record<string, string> = {
    "/dashboard": "/Protected/dashboard",
    "/operators": "/Protected/operators",
    "/operators-add": "/Protected/operators/operators-add",
    "/users/executives": "/Protected/users/executive",
    "/users/managers": "/Protected/users/managers",
    "/users/kabo": "/Protected/users/kabo",
    "/users/kubrador": "/Protected/users/kubrador",
    "/retail-receipt": "/Protected/retail-receipt",
    "/device-information": "/Protected/device-information",
    "/bets-comparisons": "/Protected/betting-comparisons",
    "/wins-comparisons": "/Protected/winning-comparisons",
    "/draw-summary": "/Protected/draw-summary",
    "/draw-selected": "/Protected/draw-selected",
    "/operators-view": "/Protected/operators-view",
    "/error404": "/auth/error404",
  };

  const staticPaths = [
    "/Protected/dashboard",
    "/Protected/operators",
    "/Protected/operators/operators-add",
    "/Protected/draw-summary",
    "/Protected/retail-receipt",
    "/Protected/betting-comparisons",
    "/Protected/winning-comparisons",
    "/Protected/device-information",
    "/Protected/device-information/device-information-add",
  ];

  const excludedPaths = [
    "/",
    "/auth/login",
    "/auth/forgot-password",
    "/auth/email-verification",
    "/auth/password-reset",
    "/auth/set-password",
    "/auth/error404",
  ];

  // Now using public route format for dynamic matching
  const dynamicPaths = [
    "/users/:role",
    "/users/users-view/:slug",
    "/operators/:slug",
    "/device-information/device-information-view/:slug",
    "/betting-summary/:path",
    "/winning-summary/:path",
  ];

  const rawPath = router.asPath.split("?")[0];
  const normalizedPath = aliasMap[rawPath] || rawPath;

  // Match rawPath against dynamic patterns
  const isDynamicMatch = dynamicPaths.some((pattern) => {
    const matcher = match(pattern, { decode: decodeURIComponent });
    return matcher(rawPath); // match against actual route
  });

  const isStaticMatch = staticPaths.includes(normalizedPath);
  const isExcludedPath = excludedPaths.includes(normalizedPath);
  const isValidPath = isStaticMatch || isExcludedPath || isDynamicMatch;

  //console.log("rawPath:", rawPath);
  //console.log("normalizedPath:", normalizedPath);
  //console.log("isDynamicMatch:", isDynamicMatch);
  //console.log("isStaticMatch:", isStaticMatch);
  //console.log("isExcludedPath:", isExcludedPath);
  //console.log("isValidPath:", isValidPath);

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
