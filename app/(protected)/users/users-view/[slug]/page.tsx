import { Suspense } from "react";
import { AccessGuard } from "@/components/auth/AccessGuard";
import UserViewSlugClientPage from "@/components/user/ClientUsersView";
import { UsersSkeletonPage } from "@/components/user/UsersSkeleton";

export default function Page() {
  return (
    <AccessGuard allowedUserTypes={[3, 4, 5]}>
      <Suspense fallback={<UsersSkeletonPage />}>
        <UserViewSlugClientPage />
      </Suspense>
    </AccessGuard>
  )
} 