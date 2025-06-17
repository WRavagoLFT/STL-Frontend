import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "~/store/useAuthStore";
import { getCurrentUser } from "~/utils/api/auth";

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
  const rawPath = router.asPath.split("?")[0]; // Get full route path
  const normalizedPath = aliasMap[rawPath] || rawPath;

  const isExcludedPath = excludedPaths.includes(normalizedPath);
  const [loading, setLoading] = useState(true);
  const { setUser, clearUser, setUserTypeId } = useAuthStore();

  useEffect(() => {
    if (isExcludedPath) {
      useAuthStore.getState().clearUser(); // Also set isLoading = false
      setLoading(false);
      return;
    }

    const performAuthCheck = async () => {
      try {
        const res = await getCurrentUser();
        if (res?.success && res.data) {
          setUserTypeId(res.data.UserTypeId);
          setUser(res.data);
        } else {
          clearUser();
        }
      } catch (error) {
        console.warn("Auth check failed:", error);
        clearUser();
        router.replace("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    performAuthCheck();
  }, [isExcludedPath, router, setUser]);

  return { loading };
}
