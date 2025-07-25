import { AccessGuard } from "@/components/auth/AccessGuard";
import { UsersSkeletonPage } from "@/components/user/UsersSkeleton";
import OperatorsPage from "@/components/operators/ParentOperator";
import { Suspense } from "react";

export default function Page() {
  return (
    <AccessGuard allowedUserTypes={[6]}>
      <Suspense fallback={<UsersSkeletonPage/>}>
        <OperatorsPage />
      </Suspense>
    </AccessGuard>
  );
}