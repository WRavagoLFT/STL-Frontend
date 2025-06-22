"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "~/store/useAuthStore";
import { getCurrentUser } from "~/utils/api/auth";
import { useRouter, usePathname } from "next/navigation";
import { User } from "~/types/types";
import axiosInstance from "./axiosInstance";

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();

  const rawPath = pathname?.split("?")[0] || "/";
  const isErrorPage = rawPath === "/not-found";

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
        //await fetchForceToken();
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

    if (!userValidated) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [userValidated, isErrorPage]);

  return { loading };
}
