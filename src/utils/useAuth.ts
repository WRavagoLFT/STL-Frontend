import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "~/store/useAuthStore";
import { getCurrentUser } from "~/utils/api/auth";
import axios from "axios";

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
  const {
    user,
    userValidated,
    setUser,
    clearUser,
    setUserTypeId,
    setUserValidated,
  } = useAuthStore();

  useEffect(() => {
    const forceTokenRefresh = async () => {
      try {
        const refresh = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/tokenRefresh`,
          {},
          { withCredentials: true }
        );
        console.log("Token refresh success:", refresh.data);
      } catch (err) {
        console.error("Token refresh failed:", err);
      }
    };

    if (isExcludedPath) {
      clearUser();
      setLoading(false);
      return;
    }

    const run = async () => {
      //await forceTokenRefresh();

      if (user && userValidated) {
        setLoading(false);
        return;
      }

      try {
        const res = await getCurrentUser();

        if (res?.success && res.data) {
          setUser(res.data);
          setUserTypeId(res.data.UserTypeId);
        } else {
          clearUser();
          router.replace("/auth/login");
        }
      } catch (err) {
        clearUser();
        if (!isErrorPage) {
          router.replace("/auth/login");
        }
      } finally {
        setUserValidated(true);
        setLoading(false);
      }
    };

    run();
  }, [isExcludedPath, isErrorPage, user, userValidated]);

  return { loading };
}
