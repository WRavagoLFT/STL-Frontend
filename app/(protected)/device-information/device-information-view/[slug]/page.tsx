"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Device } from "~/types/types";
import { AccessGuard } from "~/components/auth/AccessGuard";
import { fetchDeviceById } from "~/utils/api/device";
import { DevicesViewPage } from "~/components/device-information/ParentDeviceView";

const fetchAndSetDevice = async (
  slug: string,
  setDevice: (d: Device | null) => void,
  setLoading: (l: boolean) => void
) => {
  if (!slug || typeof slug !== "string") {
    console.log("Slug is not ready or not a string yet");
    return;
  }

  const [idStr] = slug.split("-");
  const deviceId = Number(idStr);

  if (isNaN(deviceId)) {
    console.error("Invalid device ID in slug:", slug);
    setDevice(null);
    setLoading(false);
    return;
  }

  setLoading(true);

  try {
    const response = await fetchDeviceById(deviceId);

    if (response?.data && response.data.length > 0) {
      setDevice(response.data[0]);
    } else {
      setDevice(null);
    }
  } catch (err) {
    console.error("Error fetching device by ID:", err);
    setDevice(null);
  } finally {
    setLoading(false);
  }
};

const DeviceSlugPage = () => {
  const { slug } = useParams();
  const [device, setDevice] = useState<Device | null>(null);
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
