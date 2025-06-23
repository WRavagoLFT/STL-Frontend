import { AccessGuard } from "~/components/auth/AccessGuard";
import { ParentDrawSummaryPage } from "~/components/draw-summary/ParentDrawSummary";

export default function Page() {
  return (
    <AccessGuard allowedUserTypes={[3, 4, 5, 6]}>
      <ParentDrawSummaryPage />
    </AccessGuard>
  );
}

