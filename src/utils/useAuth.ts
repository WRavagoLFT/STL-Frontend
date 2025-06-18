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
];

export function useAuth() {
  const router = useRouter();
  const rawPath = router.asPath.split("?")[0];
  const normalizedPath = aliasMap[rawPath] || rawPath;

  const isExcludedPath = excludedPaths.includes(normalizedPath);
  const isErrorPage = normalizedPath === "/auth/error404";

  const [loading, setLoading] = useState(true);
  const { setUser, clearUser, setUserTypeId } = useAuthStore();

  useEffect(() => {
    console.log("Auth check useEffect triggered");

    if (isExcludedPath) {
      console.log("Path is excluded. Clearing user state.");
      clearUser();
      setLoading(false);
      return;
    }

    const performAuthCheck = async () => {
      console.log("Performing authentication check...");

      try {
        const res = await getCurrentUser();
        console.log("getCurrentUser response:", res);

        if (res?.success && res.data) {
          console.log("User authenticated. Setting user data:", res.data);
          setUserTypeId(res.data.UserTypeId);
          setUser(res.data);
        } else {
          console.warn("No valid user data. Clearing user.");
          clearUser();
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        clearUser();

        if (!isErrorPage) {
          console.log("Redirecting to login...");
          router.replace("/auth/login");
        }
      } finally {
        console.log("Auth check complete. Stopping loading state.");
        setLoading(false);
      }
    };

    performAuthCheck();
  }, [isExcludedPath, isErrorPage, router, setUser]);

  return { loading };
}
