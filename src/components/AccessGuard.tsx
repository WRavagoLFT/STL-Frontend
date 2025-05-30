import { useEffect } from "react";
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

  useEffect(() => {
    console.log("UserTypeId IN THE ACCESSGUARD:", userTypeId);

    if (userTypeId !== null && !allowedUserTypes.includes(userTypeId)) {
      router.replace("/unauthorized");
    }
  }, [userTypeId, allowedUserTypes, router]);

  if (userTypeId === null || !allowedUserTypes.includes(userTypeId)) {
    return null;
  }

  return <>{children}</>;
};
