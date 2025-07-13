import axiosInstance from "@/lib/api/axiosInstance";
import { useAuthStore } from "@/store/useAuthStore";

export const handleRouter = async (router: any) => {
  const { setUser } = useAuthStore.getState();

  try {
    const userResponse = await axiosInstance.get("/users/getCurrentUser");
    const user = userResponse.data?.data;
    // console.log("Fetched user:", user);

    if (!user) {
      console.warn("No user returned from backend.");
      return;
    }

    setUser(user);

    const userTypeId = user.UserTypeId;
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
