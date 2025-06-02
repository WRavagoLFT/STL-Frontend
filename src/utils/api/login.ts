import axiosInstance from "../axiosInstance";
import axios from "axios";

export const loginUser = async (
  payload: { email: string; password: string },
  router: any
) => {
  try {
    // Attempt to log in
    await axiosInstance.post("/auth/login", payload);
    //console.log("Login successful, fetching user details...");

    // Fetch current user info
    const userResponse = await axiosInstance.get("/users/getCurrentUser");
    const user = userResponse.data;

    console.log("Fetched user info:", user);

    // Extract userTypeId from the correct place
    const userTypeId = user?.data?.UserTypeId;
    console.log("Extracted userTypeId:", userTypeId);

    // Role-based routing
    switch (userTypeId) {
      case 3:
      case 4:
      case 6:
        console.log("Redirecting to /dashboard");
        router.push("/dashboard");
        break;
      case 5:
        console.log("Redirecting to /draw-summary");
        router.push("/draw-summary");
        break;
      default:
        console.warn("Unrecognized userTypeId:", userTypeId);
        throw new Error("Unauthorized user type.");
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Axios error response:", error.response.data);
      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      throw new Error(errorMessage);
    } else if (error instanceof Error) {
      console.error("Native error:", error.message);
      throw new Error(
        error.message || "An unexpected error occurred during login."
      );
    } else {
      console.error("Unknown error during login:", error);
      throw new Error("An unexpected error occurred.");
    }
  }
};


