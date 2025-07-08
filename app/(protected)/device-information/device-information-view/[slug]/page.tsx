"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AccessGuard } from "~/components/auth/AccessGuard";
import { DevicesViewPage } from "~/components/device-information/ParentDeviceView";
import { fetchAndSetDevice } from "~/hooks/useLoadDevice";
import { DeviceItem } from "~/lib/api/device/device.service";

const DeviceSlugPage = () => {
  const { slug } = useParams();
  const [device, setDevice] = useState<DeviceItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug && typeof slug === "string") {
      fetchAndSetDevice(slug, setDevice, setLoading);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!device) {
    return <p className="text-center text-red-500">No device found.</p>;
  }

  return (
    <AccessGuard allowedUserTypes={[5]}>
      <DevicesViewPage device={device} slug={slug as string} />
    </AccessGuard>
  );
};

export default DeviceSlugPage;
