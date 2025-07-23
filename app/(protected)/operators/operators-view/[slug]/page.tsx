import { Suspense } from "react";
import { AccessGuard } from "@/components/auth/AccessGuard";
import OperatorSlugClientPage from "@/components/operators/ClientOperatorsView";
import { UsersSkeletonPage } from "@/components/user/UsersSkeleton";

export default function Page() {
  return (
    <AccessGuard allowedUserTypes={[6]}>
      <Suspense fallback={<div><UsersSkeletonPage/></div>}>
        <OperatorSlugClientPage />
      </Suspense>
    </AccessGuard>
  );
}