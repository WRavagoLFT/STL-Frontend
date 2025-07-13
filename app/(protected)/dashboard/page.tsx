import { AccessGuard } from "@/components/auth/AccessGuard";
import { ParentDashboard } from "@/components/dashboard/ParentDashboard";


export default function Page() {
  return (
    <AccessGuard allowedUserTypes={[3, 4, 6]}>
      <ParentDashboard />
    </AccessGuard>
  );
}
  