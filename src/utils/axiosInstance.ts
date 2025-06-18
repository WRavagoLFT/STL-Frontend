import axios from "axios";
import { useAuthStore } from "~/store/useAuthStore";

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

export const waitUntilNotRefreshing = (): Promise<void> => {
  if (!isRefreshing) return Promise.resolve();
  return new Promise((resolve) => {
    refreshSubscribers.push(resolve);
  });
};

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Helper: retry original request after refresh
const retryOriginalRequest = (originalRequest: any) =>
  new Promise((resolve, reject) => {
    refreshSubscribers.push(() => {
      axiosInstance(originalRequest)
        .then(resolve)
        .catch(reject);
    });
  });

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const message = error?.response?.data?.message;

    const isTokenExpired = status === 403 && message === "Token expired.";

    if (isTokenExpired) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/tokenRefresh`,
            {},
            { withCredentials: true }
          );

          isRefreshing = false;
          refreshSubscribers.forEach((cb) => cb());
          refreshSubscribers = [];

          return axiosInstance(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          refreshSubscribers = [];

          console.error("Token refresh failed. Logging out user.");
          useAuthStore.getState().clearUser(); // Optional Zustand state clear
          window.location.href = "/auth/login";
          return Promise.reject(refreshError);
        }
      } else {
        return retryOriginalRequest(originalRequest);
      }
    }

    // // Handle other unauthorized (401) errors
    // if (status === 401) {
    //   console.warn("Unauthorized (401). Logging out.");
    //   useAuthStore.getState().clearUser(); // Optional Zustand state clear
    //   window.location.href = "/auth/login";
    // }

    return Promise.reject(error);
  }
);

export default axiosInstance;
