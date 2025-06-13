import axiosInstance from "./axiosInstance";
import { useAuthStore } from "~/store/useAuthStore"; // Make sure path is correct

export const handleRouter = async (router: any) => {
  const { setUserTypeId } = useAuthStore.getState();

  try {
    //console.log("Resetting userTypeId to null...");
    //setUserTypeId(0); // Reset before fetch

    //console.log("Fetching current user...");
    const userResponse = await axiosInstance.get("/users/getCurrentUser");

    //console.log("User response received:", userResponse.data);
    const user = userResponse.data;
    const userTypeId = user?.data?.UserTypeId;

    //console.log("Detected userTypeId:", userTypeId);
    setUserTypeId(userTypeId); // Set the actual userTypeId now

    let targetPath = "";

    switch (userTypeId) {
      case 3:
      case 4:
      case 6:
        targetPath = "/dashboard";
        break;
      case 5:
        targetPath = "/draw-summary";
        break;
      default:
        console.warn("Unrecognized userTypeId:", userTypeId);
        return;
    }

    //console.log("Current path:", router.pathname);
    //console.log("Target path based on userTypeId:", targetPath);

    if (router.pathname !== targetPath) {
      console.log(`Redirecting to: ${targetPath}`);
      router.push(targetPath);
    } else {
      console.log("Already on correct path, no redirection needed.");
    }

  } catch (err) {
    console.error("Failed to get user info or redirect:", err);
  }
};
