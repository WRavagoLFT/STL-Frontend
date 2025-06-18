import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "~/store/useAuthStore";

export const AccessGuard = ({
  allowedUserTypes,
  children,
}: {
  allowedUserTypes: number[];
  children: React.ReactNode;
}) => {
  const { userTypeId, isLoading } = useAuthStore();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (userTypeId === null || !allowedUserTypes.includes(userTypeId)) {
      router.replace("/auth/error404");
    } else {
      setIsAuthorized(true);
    }
  }, [isLoading, userTypeId, allowedUserTypes, router]);

  if (isLoading || !isAuthorized) return null;

  return <>{children}</>;
};
