import { Device } from "~/types/types";

export const fetchAndSetDevice = async (
  slug: string,
  setDevice: (d: Device | null) => void,
  setLoading: (l: boolean) => void
) => {
  try {
    setLoading(true);
    const res = await fetch(`/api/devices/${slug}`);
    const data: Device = await res.json();
    setDevice(data);
  } catch (e) {
    console.error(e);
    setDevice(null);
  } finally {
    setLoading(false);
  }
};
