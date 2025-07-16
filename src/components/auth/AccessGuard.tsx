"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useSideBarStore } from "@/store/useSideBarStore";
import { useAuth } from "@/utils/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AccessGuardProps {
  allowedUserTypes: number[];
  children: React.ReactNode;
}

export const AccessGuard = ({ allowedUserTypes, children }: AccessGuardProps) => {
  const { userTypeId } = useAuthStore();
  const { loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (userTypeId === null || !allowedUserTypes.includes(userTypeId)) {
      useSideBarStore.getState().reset();
      router.replace("/not-found");
    } else {
      setIsAuthorized(true);
    }
  }, [loading, userTypeId, allowedUserTypes, router]);

  if (loading || !isAuthorized) return null;

  return <>{children}</>;
};
