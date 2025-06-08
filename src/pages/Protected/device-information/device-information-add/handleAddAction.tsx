import { Device } from "~/types/types";
import { addDevice } from "~/utils/api/device";
import Swal from "sweetalert2";
import { NextRouter } from "next/router";

export const handleAddDevice = async (
  data: Device,
  loadData: () => Promise<void>,
  router: NextRouter
): Promise<void> => {
  //console.log("[handleAddDevice] - Submitting Device Data:", data);

  try {
    //console.log("[handleAddDevice] - Sending request to addDevice API...");
    const result = await addDevice(data);
    //console.log("[handleAddDevice] - API Response from addDevice:", result);

    if (result.success) {
      //console.log("[handleAddDevice] - Device successfully added. Triggering data reload...");

      await loadData();
      //console.log("[handleAddDevice] - Data reload complete.");

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Device added successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      //console.log("[handleAddDevice] - Redirecting to /device-information...");
      router.push("/device-information");
    } else {
      console.error("[handleAddDevice] - Failed to add device. Message:", result.message);

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
