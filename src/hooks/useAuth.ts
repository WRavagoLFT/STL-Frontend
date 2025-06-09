import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { checkAuth, refreshToken, waitUntilNotRefreshing } from "..//utils/authClient";
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

export function useAuth() {
  const router = useRouter();
  const isExcludedPath = excludedPaths.includes(router.pathname);
  const [loading, setLoading] = useState(true);
  const { setUserTypeId } = useAuthStore();

  useEffect(() => {
    if (isExcludedPath) {
      setLoading(false);
      return;
    }

    const handleAuthFailure = () => {
      router.replace("/auth/login");
    };

    const checkAndRefresh = async () => {
      try {
        const { userTypeId } = await checkAuth();
        setUserTypeId(userTypeId ?? 0);
        setLoading(false);
      } catch (error: any) {
        // Check if token expired error
        const isTokenExpired =
          error?.response?.status === 403 &&
          error.response?.data?.message === "Token expired.";

        if (isTokenExpired) {
          try {
            await waitUntilNotRefreshing();
            await refreshToken();
            const { userTypeId } = await checkAuth();
            setUserTypeId(userTypeId ?? 0);
            setLoading(false);
          } catch {
            handleAuthFailure();
          }
        } else {
          handleAuthFailure();
        }
      }
    };

    checkAndRefresh();

    const intervalId = setInterval(() => {
      refreshToken().catch(() => {
        handleAuthFailure();
      });
    }, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [isExcludedPath, router, setUserTypeId]);

  return { loading };
}
