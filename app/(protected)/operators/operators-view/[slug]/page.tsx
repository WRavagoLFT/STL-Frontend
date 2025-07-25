import { Suspense } from "react";
import { AccessGuard } from "@/components/auth/AccessGuard";
import OperatorSlugClientPage from "@/components/operators/ClientOperatorsView";
import { OperatorsViewSkeletonPage } from "@/components/operators/OperatorsViewSkeleton";

export default function Page() {
  return (
    <AccessGuard allowedUserTypes={[6]}>
      <Suspense fallback={<OperatorsViewSkeletonPage/>}>
        <OperatorSlugClientPage />
      </Suspense>
    </AccessGuard>
  );
}