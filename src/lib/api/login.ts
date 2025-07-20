import axios from "axios";
import axiosInstance from "./axiosInstance";
import { handleRouter } from "@/utils/routerHandlers";

export const loginUser = async (
  payload: { email: string; password: string },
  router: any
) => {
  try {
    const loginResponse = await axiosInstance.post("/auth/login/web", payload);
    await handleRouter(router);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";

      throw { status, message: errorMessage };
    } else if (error instanceof Error) {
      throw { status: 500, message: error.message };
    } else {
      throw { status: 500, message: "An unexpected error occurred." };
    }
  }
};

