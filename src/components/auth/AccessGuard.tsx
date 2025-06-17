import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "~/store/useAuthStore";
import Error from "next/error";

export const AccessGuard = ({
  allowedUserTypes,
  children,
}: {
  allowedUserTypes: number[];
  children: React.ReactNode;
}) => {
  const { userTypeId, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && userTypeId === null) {
      router.replace("/auth/error404");
    }
  }, [isLoading, userTypeId, router]);

  if (isLoading) return null;

  if (userTypeId !== null && !allowedUserTypes.includes(userTypeId)) {
    return <Error statusCode={404} />;
  }

  return <>{children}</>;
};
