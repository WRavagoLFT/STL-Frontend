import { AccessGuard } from "~/components/auth/AccessGuard";
import Dashboard from "~/components/dashboard/Dashboard";

export default function Page() {
  return (
    <AccessGuard allowedUserTypes={[3, 4, 6]}>
      <Dashboard />
    </AccessGuard>
  );
}
  