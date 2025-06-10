import axiosInstance, { isRefreshing, refreshSubscribers } from "./axiosInstance";
import { getCurrentUser as fetchCurrentUser } from "./api/auth";

export const waitUntilNotRefreshing = () =>
  new Promise<void>((resolve) => {
    if (!isRefreshing) {
      resolve();
    } else {
      refreshSubscribers.push(() => resolve());
    }
  });

export async function refreshToken() {
  try {
    await axiosInstance.post("/auth/tokenRefresh", {}, { withCredentials: true });
  } catch (error) {
    throw new Error("Token refresh failed");
  }
}

export async function checkAuth(): Promise<{ userTypeId: number | null }> {
  try {
    await waitUntilNotRefreshing();
    
    //console.log('Calling fetchCurrentUser...');
    const data = await fetchCurrentUser({});
    //console.log('fetchCurrentUser result:', data);
    
    if (data?.success) {
      return { userTypeId: data.data?.UserTypeId ?? data.user?.UserTypeId ?? null };
    }
    
    console.log('fetchCurrentUser success=false, throwing error');
    throw new Error("No valid auth found");
  } catch (error) {
    console.log('checkAuth caught error:', error);
    throw error; // Re-throw to be handled by useAuth
  }
}