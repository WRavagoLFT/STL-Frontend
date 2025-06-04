import { AppProps } from "next/app";
import { ThemeProvider, CssBaseline, CircularProgress, } from "@mui/material";
import Layout from "../layout";
import darkTheme from "../styles/theme";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../utils/api/auth";
import "../styles/globals.css";
import axiosInstance, { isRefreshing, refreshSubscribers, } from "../utils/axiosInstance";
import { useAuthStore } from "~/store/useAuthStore";

const excludedPaths = [
  "/",
  "/auth/login",
  "/auth/forgot-password",
  "/auth/email-verification",
  "/auth/password-reset",
  "/auth/set-password",
  "/auth/error404",
];

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const isExcludedPath = excludedPaths.includes(router.pathname);
  const [loading, setLoading] = useState(true);
  const { userTypeId, setUserTypeId } = useAuthStore.getState(); 
  //console.log("UserTypeId from store:", userTypeId);
  
  const waitUntilNotRefreshing = async () => {
    while (isRefreshing) {
      await new Promise((r) => requestAnimationFrame(r));
    }
  };

  useEffect(() => {
    if (isExcludedPath) {
      setLoading(false);
      return;
    }

    const handleAuthFailure = () => {
      console.warn("No valid auth found! Redirecting to login...");
      //router.replace("/auth/login");
    };

    const checkAuth = async () => {
      try {
        await waitUntilNotRefreshing();
        const data = await getCurrentUser({});
        //console.log("getCurrentUser response:", data);
        if (data?.success) {
          const roleId = data.data?.UserTypeId;
          //console.log("", roleId)
          setUserTypeId(roleId); // update roleId

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
              const roleId = data.user?.UserTypeId;
              setUserTypeId(roleId);
              //console.log('CURRENT USER', data);
              //console.log("UserTypeId:", roleId);

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
          <Component {...pageProps} userTypeId={userTypeId} />
        </Layout>
      )}
    </ThemeProvider>
  );
};

export default App;
