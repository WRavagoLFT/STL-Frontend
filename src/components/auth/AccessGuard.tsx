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
  const { userTypeId } = useAuthStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (userTypeId === null) {
      // Uncomment this if you want to redirect unauthenticated users
      router.replace("/auth/error404");
      return;
    }

    setIsChecking(false);
  }, [userTypeId]);

  if (isChecking) return null;

  // Unauthorized user type
  if (userTypeId !== null && !allowedUserTypes.includes(userTypeId)) {
    return <Error statusCode={404} />;
  }

  return <>{children}</>;
};
