import { User } from "~/types/types";
import Swal from "sweetalert2";
import { updateUser } from "~/lib/api/users/users.service";

export const handleUpdateUser = async (
  data: User,
  loadData: () => Promise<void>,
  closeModal?: () => void
): Promise<void> => {
  try {
    if (!data.userId) {
      throw new Error("UserId is required to update user.");
    }

    const result = await updateUser(data);

    if (result.success) {
      await loadData();

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "User updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      closeModal?.();
    } else {
      console.error("[handleUpdateUser] - Failed to update user:", result.message);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: result.message || "Something went wrong while updating the user.",
      });
    }
  } catch (error) {
    const err = error as Error;
    console.error("[handleUpdateUser] - Unexpected error:", err.message);

    Swal.fire({
      icon: "error",
      title: "Unexpected Error",
      text: err.message || "An unexpected error occurred.",
    });
  }
};
