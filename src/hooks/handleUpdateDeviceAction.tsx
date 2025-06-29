import { Device } from "~/types/types";
import { updateDevice } from "~/lib/api/device";
import Swal from "sweetalert2";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const handleUpdateDevice = async (
  data: Device,
  loadData: () => Promise<void>,
  router: AppRouterInstance,
  redirectPath: string,
): Promise<void> => {
  //console.log("[handleUpdateDevice] - Submitting Device Data:", data);

  try {
    if (!data.deviceId) {
      throw new Error("DeviceId is required to update device.");
    }

    //console.log("[handleUpdateDevice] - Sending request to updateDevice API...");
    const result = await updateDevice(data.deviceId, data); // Pass deviceId separately
    //console.log("[handleUpdateDevice] - API Response from updateDevice:", result);

    if (result.success) {
      //console.log("[handleUpdateDevice] - Device successfully updated. Triggering data reload...");

      await loadData();
      //console.log("[handleUpdateDevice] - Data reload complete.");

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Device updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      //console.log("[handleUpdateDevice] - Redirecting to /device-information...");
      router.push(redirectPath);
    } else {
      console.error("[handleUpdateDevice] - Failed to update device. Message:", result.message);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: result.message || "Something went wrong while updating the device.",
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
