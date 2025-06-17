import axiosInstance from "../axiosInstance";
import axios from "axios";
import { handleRouter } from "../routerHandlers";
import { useAuthStore } from "~/store/useAuthStore";

export const loginUser = async (
  payload: { email: string; password: string },
  router: any
) => {
  try {
    //const { setUserTypeId } = useAuthStore.getState();
    //setUserTypeId(0); // Reset before fetch
    
    const loginResponse = await axiosInstance.post("/auth/login", payload);
    await handleRouter(router);
    //router.push("/dashboard");

  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("[loginUser] Axios error response:", error.response.data);
      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      throw new Error(errorMessage);
    } else if (error instanceof Error) {
      console.error("[loginUser] Native error:", error.message);
      throw new Error(
        error.message || "An unexpected error occurred during login."
      );
    } else {
      console.error("[loginUser] Unknown error during login:", error);
      throw new Error("An unexpected error occurred.");
    }
  }
};
