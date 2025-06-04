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
  const { userTypeId } = useAuthStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (userTypeId === null) {
      // if null means not logged in, redirect to login
      //router.replace("/auth/login");
      return;
    }

    if (!allowedUserTypes.includes(userTypeId)) {
      router.replace("/error404");
      return;
    }

    setIsChecking(false); // Safe to render
  }, [userTypeId, allowedUserTypes, router]);

  if (isChecking) return null; // or a spinner

  return <>{children}</>;
};
