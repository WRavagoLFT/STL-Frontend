import { AccessGuard } from "@/components/auth/AccessGuard";
import ParentDevicePage from "@/components/device/ParentDevice";

export default function Page() {
  return (
    <AccessGuard allowedUserTypes={[5]}>
      <ParentDevicePage />
    </AccessGuard>
  );
}
  