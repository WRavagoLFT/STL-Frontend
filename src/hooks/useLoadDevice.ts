import { DeviceItem, fetchDeviceById } from "~/lib/api/device/device.service";

export const fetchAndSetDevice = async (
  slug: string,
  setDevice: (d: DeviceItem | null) => void,
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