import { AccessGuard } from "@/components/auth/AccessGuard";
import AddDevicePage from "@/components/device/ParentAddDevice";

export default function Page() {
  return (
    <AccessGuard allowedUserTypes={[5]}>
      <AddDevicePage />
    </AccessGuard>
  );
}
  