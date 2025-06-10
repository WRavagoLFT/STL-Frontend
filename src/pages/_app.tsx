import { AppProps } from "next/app";
import { ThemeProvider, CssBaseline, CircularProgress } from "@mui/material";
import Layout from "../layout";
import darkTheme from "../styles/theme";
import "../styles/globals.css";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/router";

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
      {isExcludedPath ? (
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
