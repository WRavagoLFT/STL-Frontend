"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "~/store/useAuthStore";
import { useAuth } from "~/utils/useAuth";

interface AccessGuardProps {
  allowedUserTypes: number[];
  children: React.ReactNode;
}

export const AccessGuard = ({ allowedUserTypes, children }: AccessGuardProps) => {
  const { userTypeId } = useAuthStore();
  const { loading } = useAuth(); // ensures auth check has completed
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return; // don’t check anything until auth check is done

    if (userTypeId === null || !allowedUserTypes.includes(userTypeId)) {
      console.warn("Unauthorized access. Redirecting to error404.");
      router.replace("/error404");
    } else {
      setIsAuthorized(true);
    }
  }, [loading, userTypeId, allowedUserTypes, router]);

  if (loading || !isAuthorized) return null;

  return <>{children}</>;
};
