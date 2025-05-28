import { AppProps } from "next/app";
import {
  ThemeProvider,
  CssBaseline,
  CircularProgress,
  Box,
} from "@mui/material";
import Layout from "../layout";
import darkTheme from "../styles/theme";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../utils/api/auth";
import "../styles/globals.css";
import axiosInstance, {
  isRefreshing,
  refreshSubscribers,
} from "../utils/axiosInstance";

const excludedPaths = [
  "/",
  "/auth/login",
  "/auth/forgot-password",
  "/auth/email-verification",
  "/auth/password-reset",
  "/auth/set-password",
];

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const isExcludedPath = excludedPaths.includes(router.pathname);
  console.log(router.pathname)
  const [loading, setLoading] = useState(true);

  // Helper function: Wait until token refresh is done
  const waitUntilNotRefreshing = async () => {
    while (isRefreshing) {
      await new Promise((r) => requestAnimationFrame(r)); // Lighter than setInterval
    }
  };

  useEffect(() => {
    if (isExcludedPath) {
      setLoading(false);
      return;
    }

    const handleAuthFailure = () => {
      console.log(router.pathname)
      console.log("No valid auth found! Redirecting to login...");
      router.replace("/Auth/login");
    };

    const checkAuth = async () => {
      try {
        await waitUntilNotRefreshing();
        const data = await getCurrentUser({});
        console.log('getCurrentUser', data);
        if (data?.success) {
          setLoading(false);
          return;
        }
        throw new Error("No valid auth found!");
      } catch (error: any) {
        const isTokenExpired =
          error?.response?.status === 403 &&
          error.response?.data?.message === "Token expired.";
        if (isTokenExpired) {
          await new Promise<void>((resolve) =>
            refreshSubscribers.push(() => resolve())
          );

          try {
            const data = await getCurrentUser({});
            if (data?.success) {
              setLoading(false);
              return;
            }
          } catch {
            handleAuthFailure();
          }
        } else {
          handleAuthFailure();
        }
      }
    };

    checkAuth();

    // refreshing every 1 minute
    const refreshInterval = setInterval(() => {
      console.log("Refreshing token...");
      axiosInstance.post("/auth/tokenRefresh", {}, { withCredentials: true });
    }, 60000);

    return () => clearInterval(refreshInterval);
  }, [isExcludedPath, router]);

  if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress />
        </Box>
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
