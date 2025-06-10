import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  if (config.url?.startsWith('http://') || config.url?.startsWith('https://')) {
    throw new Error('Absolute URLs are not allowed.');
  }
  return config;
});

// Global variables for handling token refresh
export let isRefreshing = false;
export let refreshSubscribers: (() => void)[] = [];

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && error.response?.data?.message === "Token expired.") {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // Attempt to refresh the token
          await axiosInstance.post("/auth/tokenRefresh", {}, { withCredentials: true });

          // Once the token is refreshed, resolve the subscribers
          isRefreshing = false;
          refreshSubscribers.forEach((cb) => cb());
          refreshSubscribers = []; // Clear subscribers

          return axiosInstance(originalRequest); // Retry the original request with the new token
        } catch (refreshError) {
          isRefreshing = false;
          refreshSubscribers = [];
          console.error("Refresh token failed", refreshError);
          window.location.href = "/auth/login";
          return Promise.reject(refreshError);
        }
      } else {
        return new Promise((resolve) => {
          refreshSubscribers.push(() => resolve(axiosInstance(originalRequest))); // Push the request to the refresh queue
        });
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
