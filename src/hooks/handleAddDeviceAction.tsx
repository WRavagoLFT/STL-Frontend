import Swal from "sweetalert2";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  addDevice,
  AddDevicePayload,
} from "~/lib/api/device/device.service";

export const handleAddDevice = async (
  data: AddDevicePayload,
  loadData: () => Promise<void>,
  router: AppRouterInstance,
  redirectPath: string
): Promise<void> => {
  try {
    const result = await addDevice(data);
    if (result.success) {
      await loadData();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Device added successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
      router.push(redirectPath);
    } else {
      console.error(
        "[handleAddDevice] - Failed to add device. Message:",
        result.message
      );
      Swal.fire({
        icon: "error",
        title: "Add Failed",
        text: result.message || "Something went wrong while adding the device.",
      });
    }
  } catch (error) {
    const err = error as Error;
    console.error("[handleAddDevice] - Unexpected error:", err.message);
    console.error("[handleAddDevice] - Full error object:", err);
    Swal.fire({
      icon: "error",
      title: "Unexpected Error",
      text: err.message || "An unexpected error occurred.",
    });
  }
};
