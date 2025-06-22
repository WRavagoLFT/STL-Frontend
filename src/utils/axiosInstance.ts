import axios from "axios";

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

export const waitUntilNotRefreshing = (): Promise<void> => {
  if (!isRefreshing) return Promise.resolve();
  return new Promise((resolve) => {
    refreshSubscribers.push(resolve);
  });
};

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const message = error?.response?.data?.message;
    const status = error?.response?.status;

    const isTokenExpired = status === 403 && message === "Token expired.";

    if (isTokenExpired) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await axiosInstance.post("/auth/tokenRefresh", {}, { withCredentials: true });

          isRefreshing = false;
          refreshSubscribers.forEach((cb) => cb());
          refreshSubscribers = [];

          return axiosInstance(originalRequest); // Retry original request
        } catch (refreshError) {
          isRefreshing = false;
          refreshSubscribers = [];
          console.error("Token refresh failed:", refreshError);
          window.location.href = "/auth/login";
          return Promise.reject(refreshError);
        }
      } else {
        // Queue the request until refresh is done
        return new Promise((resolve) => {
          refreshSubscribers.push(() => resolve(axiosInstance(originalRequest)));
        });
      }
    }

    // Handle 401 Unauthorized by redirecting to "/"
    if (status === 401) {
      console.warn("Unauthorized: redirecting to home.");
      window.location.href = "/";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;