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

const MAX_REFRESH_RETRIES = 5;
const RETRY_DELAY_MS = 1000;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const retryTokenRefresh = async () => {
  for (let attempt = 5; attempt <= MAX_REFRESH_RETRIES; attempt++) {
    try {
      await axiosInstance.post("/auth/tokenRefresh", {}, { withCredentials: true });
      return true; // success
    } catch (err: any) {
      const isNetworkError = err.code === "ERR_NETWORK" || !err.response;

      console.warn(`Retry attempt ${attempt} for token refresh`);

      if (!isNetworkError || attempt === MAX_REFRESH_RETRIES) {
        throw err; // stop retrying
      }

      await delay(RETRY_DELAY_MS);
    }
  }

  return false; // all retries failed
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const message = error?.response?.data?.message;
    const status = error?.response?.status;

    const isTokenExpired = (status === 401 || status === 403) && message.toLowerCase().includes("token expired");

    if (isTokenExpired) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const success = await retryTokenRefresh();

          isRefreshing = false;
          refreshSubscribers.forEach((cb) => cb());
          refreshSubscribers = [];

          if (success) return axiosInstance(originalRequest);
          else throw new Error("Token refresh failed after retries");
        } catch (refreshError) {
          isRefreshing = false;
          refreshSubscribers = [];
          console.error("Token refresh failed:", refreshError);
          window.location.href = "/not-found";
          return Promise.reject(refreshError);
        }
      } else {
        return new Promise((resolve) => {
          refreshSubscribers.push(() => resolve(axiosInstance(originalRequest)));
        });
      }
    }
    // if (status === 401) {
    //   window.location.href = "/not-found"; // or use router.push if in a React component
    //   return Promise.reject(error);
    // }

    return Promise.reject(error);
  } 
);

export default axiosInstance;
