import { Suspense } from "react";
import { AccessGuard } from "@/components/auth/AccessGuard";
import { DashboardSkeletonPage } from "@/components/dashboard/DashboardSkeleton";
import { ParentDashboard } from "@/components/dashboard/ParentDashboard";

export default function Page() {
  return (
    <AccessGuard allowedUserTypes={[3, 4, 6]}>
      <Suspense fallback={<div> <DashboardSkeletonPage/> </div>}>
        <ParentDashboard />
      </Suspense>
    </AccessGuard>
  );
}
  