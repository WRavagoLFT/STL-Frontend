import axiosInstance from "../axiosInstance";
import { UsersItem } from "../users/users.service";

// Utility to prevent accidental absolute URL usage
const validateRelativeUrl = (url: string) => {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    throw new Error("Absolute URLs are not allowed.");
  }
  return url;
};

export type UserResponse = {
  success: boolean;
  data: UsersItem;
};

export const getCurrentUser = async (): Promise<UserResponse> => {
  const url = validateRelativeUrl("/users/getCurrentUser");

  const response = await axiosInstance.get<UserResponse>(url);
  return response.data;
};

export const logoutUser = async (
  queryParams: Record<string, any> = {}
): Promise<{ success: boolean; message: string; data?: any }> => {
  const url = validateRelativeUrl("/auth/logout");

  const response = await axiosInstance.delete(url, {
    params: queryParams,
  });

  return {
    success: true,
    message: "Logout successful",
    data: response.data,
  };
};

export const verifyPass = async (password: string): Promise<any> => {
  const url = validateRelativeUrl("/auth/verifyPass");

  const response = await axiosInstance.post(url, { password });
  return response.data;
};

export const forgetPassEmail = async (email: string): Promise<any> => {
  const url = validateRelativeUrl("/auth/forgetPassword");

  const response = await axiosInstance.post(url, { email });
  return response.data;
};

export const verifyOtp = async (
  email: string,
  otp: string
): Promise<any> => {
  const url = validateRelativeUrl("/auth/verifyOTP");

  const response = await axiosInstance.post(url, { email, otp });
  return response.data;
};

export const updateForgottenPassword = async (
  email: string,
  resetToken: string,
  password: string
): Promise<any> => {
  const url = validateRelativeUrl("/auth/updateForgottenPassword");

  const response = await axiosInstance.post(url, {
    email,
    resetToken,
    password,
  });

  return response.data;
};
