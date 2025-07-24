import { AccessGuard } from "@/components/auth/AccessGuard";
import DrawSummarySkeletonPage from "@/components/draw-summary/DrawSummarySkeleton";
import { ParentDrawSummaryPage } from "@/components/draw-summary/ParentDrawSummary";
import { Suspense } from "react";

export default function Page() {
  return (
    <AccessGuard allowedUserTypes={[3, 4, 5, 6]}>
      
        <ParentDrawSummaryPage />
      
    </AccessGuard>
  );
}

