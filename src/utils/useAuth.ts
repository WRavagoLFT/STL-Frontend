"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "~/store/useAuthStore";
import { getCurrentUser } from "~/utils/api/auth";
import { useRouter, usePathname } from "next/navigation";
import { User } from "~/types/types";
import axiosInstance from "./axiosInstance";

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
  "/error404": "/error404",
};

const excludedPaths = [
  "/",
  "/auth/login",
  "/auth/forgot-password",
  "/auth/email-verification",
  "/auth/password-reset",
  "/auth/set-password",
];

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();

  const rawPath = pathname?.split("?")[0] || "/";
  const normalizedPath = aliasMap[rawPath] || rawPath;

  const isExcludedPath = excludedPaths.includes(normalizedPath);
  const isErrorPage = normalizedPath === "/error404";

  const [loading, setLoading] = useState(true);
  const {
    user,
    userValidated,
    setUser,
    clearUser,
    setUserTypeId,
    setUserValidated,
  } = useAuthStore();

  const fetchForceToken = async () => {
    try {
      const res = await axiosInstance.post("/auth/tokenRefresh", {}, {
        withCredentials: true,
      });

      console.log("[fetchForceToken] Token refreshed:", res.data);
      return res.data;
    } catch (err) {
      console.error("[fetchForceToken] Failed to refresh token:", err);
      throw err;
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        await fetchForceToken(); 
        const res = await getCurrentUser();

      if (res?.success && res.data && res.data.UserTypeId !== undefined) {
        setUser(res.data as User);
        setUserTypeId(res.data.UserTypeId);
      } else {
        clearUser();
        if (!isErrorPage) router.replace("/");
      }
      } catch (err) {
        console.error("Error fetching user:", err);
        clearUser();
        if (!isErrorPage) router.replace("/");
      } finally {
        setUserValidated(true);
        setLoading(false);
      }
    };

    if (isExcludedPath) {
      clearUser();
      setLoading(false);
      return;
    }

    // Only run if user is not validated
    if (!userValidated) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [isExcludedPath, isErrorPage, userValidated]);

  return { loading };
}
