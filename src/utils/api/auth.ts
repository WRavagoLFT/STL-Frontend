import axios, { AxiosError } from "axios";
import axiosInstance, { waitUntilNotRefreshing } from "../axiosInstance";
import { useAuthStore } from "~/store/useAuthStore";

// Helper to validate URL paths
const validateRelativeUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        throw new Error('Absolute URLs are not allowed.');
    }
    return url;
};

const getCurrentUser = async () => {
  await waitUntilNotRefreshing(); // wait if refresh in progress

  try {
    const res = await axiosInstance.get("/users/getCurrentUser");
    return res.data;
  } catch (error: any) {
    const message = error?.response?.data?.message;
    if (message !== "Token expired.") {
      console.error("getCurrentUser failed:", message || error.message);
    }
    return { success: false, data: null };
  }
};


const logoutUser = async (queryParams: Record<string, any> = {}) => {
    try {
        // Clear intervals and client state FIRST
        //useAuthStore.getState().logout();
        
        // Then make the server call
        const url = validateRelativeUrl("/auth/logout");
        const response = await axiosInstance.delete(url, {
            params: queryParams
        });
        
        return { success: true, message: "Logout successful", data: response.data };
    } catch (error) {
        console.error("Error logging out:", (error as Error).message);
        
        // Even if server call fails, we've already cleared client state
        // This prevents the "double logout" error
        return { success: true, message: "Logout completed (client-side)" };
    }
};

const verifyPass = async (password: string) => {
    try {
        const url = validateRelativeUrl("/auth/verifyPass");
        const response = await axiosInstance.post(url, { password });

        return response.data;
    } catch (error) {
        console.error("Error verifying password:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: {} };
    }
};

const forgetPassEmail = async (email: string) => {
    try {
        const url = validateRelativeUrl("/auth/forgetPassword");
        const response = await axiosInstance.post(url, { email });

        return response.data;
    } catch (error) {
        console.error("Error verifying password:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: {} };
    }
}

const verifyOtp = async (email: string, otp: string) => {
    try {
        const url = validateRelativeUrl("/auth/verifyOTP");
        const response = await axiosInstance.post(url, { email, otp });

        return response.data;
    } catch (error) {
        const err = error as AxiosError
        console.error("Error verifying password:", (error as Error).message);
        console.log(error)
        return err.response?.data;
    }
}

const updateForgottenPassword = async (email: string, resetToken: string, password: string) => {
    try {
        const url = validateRelativeUrl("/auth/updateForgottenPassword");
        const response = await axiosInstance.post(url, { email, resetToken, password });

        return response.data;
    } catch (error) {
        const err = error as AxiosError
        console.error("Error verifying password:", (error as Error).message);
        console.log(err.response?.data)
        return err.response?.data
    }
}

export { getCurrentUser, verifyPass, logoutUser, forgetPassEmail, verifyOtp, updateForgottenPassword };