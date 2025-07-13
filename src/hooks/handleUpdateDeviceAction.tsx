import Swal from "sweetalert2";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  updateDevice,
  UpdateDevicePayload,
} from "@/lib/api/device/device.service";

export const handleUpdateDevice = async (
  data: UpdateDevicePayload,
  loadData: () => Promise<void>,
  router: AppRouterInstance,
  redirectPath: string
): Promise<void> => {
  try {
    if (!data.deviceId) {
      throw new Error("DeviceId is required to update device.");
    }
    const result = await updateDevice(data.deviceId, data); // Pass deviceId separately
    if (result.success) {
      await loadData();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Device updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
      router.push(redirectPath);
    } else {
      console.error(
        "[handleUpdateDevice] - Failed to update device. Message:",
        result.message
      );
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          result.message || "Something went wrong while updating the device.",
      });
    }
  } catch (error) {
    const err = error as Error;
    console.error("[handleUpdateDevice] - Unexpected error:", err.message);
    console.error("[handleUpdateDevice] - Full error object:", err);

    Swal.fire({
      icon: "error",
      title: "Unexpected Error",
      text: err.message || "An unexpected error occurred.",
    });
  }
};
