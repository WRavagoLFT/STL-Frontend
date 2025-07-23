import { Suspense } from "react";
import { AccessGuard } from "@/components/auth/AccessGuard";
import { UsersSkeletonPage } from "@/components/user/UsersSkeleton";
import DeviceViewSlugClientPage from "@/components/device/ClientDeviceView";

export default function Page() {
  return (
    <AccessGuard allowedUserTypes={[5]}>
      <Suspense fallback={<div><UsersSkeletonPage/></div>}>
        <DeviceViewSlugClientPage />
      </Suspense>
    </AccessGuard>
  );
}