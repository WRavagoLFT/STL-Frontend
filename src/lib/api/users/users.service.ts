import axiosInstance from "../axiosInstance";

// Helper to validate URL paths
const validateRelativeUrl = (url: string) => {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    throw new Error("Absolute URLs are not allowed.");
  }
  return url;
};

// Utility error handler
const handleError = (label: string, error: any) => {
  const message =
    error?.response?.data?.message || error?.message || "Unknown error";

  console.error(`[${label}] Error:`, message);

  return {
    success: false,
    message,
    data: error?.response?.data || {},
  };
};

export interface UsersItem {
  UserId: number;
  FirstName: string;
  LastName: string;
  Suffix: string | null;
  UserTypeId: number;
  CreatedBy: number | null;
  Email: string;
  PhoneNumber: string;
  SupervisorName: string | null;
  DeviceId: string | null;
  LastLogin?: string | null;
  LastTokenRefresh?: string | null;
  DateOfRegistration?: string;
  UserStatusId: number;
  IsDeleted: number;
  IsVerified: number;
  VerifiedAt: string | null;
  LastUpdatedBy: number | null;
  LastUpdatedDate: string | null;
  BranchId: number;
  BranchName: string;
  BranchRegion: number;
  Region?: any;
}

export interface UsersResponse {
  success: boolean;
  data: UsersItem[];
  message?: string;
}

export const fetchUsers = async (): Promise<UsersResponse> => {
  const url = validateRelativeUrl("/users/getUsers");
  const response = await axiosInstance.get<UsersResponse>(url);
  return response.data;
};

// Add user (POST)
export const addUser = async (userData: Record<string, any>) => {
  try {
    const url = validateRelativeUrl("/users/addUser");
    const response = await axiosInstance.post(url, userData, {
      withCredentials: true,
    });

    return {
      success: true,
      message: "User added successfully",
      data: response.data?.data || {},
    };
  } catch (error) {
    return handleError("addUser", error);
  }
};

// Update user (PATCH)
export const updateUser = async (userData: Record<string, any>) => {
  try {
    const url = validateRelativeUrl("/users/edituser");
    const response = await axiosInstance.patch(url, userData);

    return {
      success: true,
      message: "User updated successfully",
      data: response.data?.data || {},
    };
  } catch (error) {
    return handleError("updateUser", error);
  }
};

// Get edit log for a user (GET)
export const editLogUser = async (userId: number) => {
  try {
    const url = validateRelativeUrl("/users/getEditLog");
    const response = await axiosInstance.get(url, {
      params: { userId },
    });

    return {
      success: true,
      message: "Edit log fetched",
      data: response.data?.data || [],
    };
  } catch (error) {
    return handleError("editLogUser", error);
  }
};

// Suspend user (PATCH)
export const suspendUser = async (userId: number, remarks?: string) => {
  try {
    const url = validateRelativeUrl(`/users/${userId}/suspend`);
    const payload = { userId, remarks };

    const response = await axiosInstance.patch(url, payload);

    return {
      success: true,
      message: "User suspended",
      data: response.data?.data || {},
    };
  } catch (error) {
    return handleError("suspendUser", error);
  }
};

// Fetch user by ID function
export const fetchUserById = async (userId: string | number) => {
  try {
    const url = validateRelativeUrl("/users/getUsers");
    const response = await axiosInstance.get(url, {
      params: { userId },
      withCredentials: true,
    });

    if (Array.isArray(response.data.data)) {
      const user = response.data.data.find((u: any) => u.UserId == userId);

      if (user) {
        // Compute status if missing
        user.Status = user.IsActive ? "Active" : "Inactive";

        // Format date in "YYYY/MM/DD" format
        if (user.DateOfRegistration) {
          const date = new Date(user.DateOfRegistration);
          user.formattedDate = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
        } else {
          user.formattedDate = "N/A";
        }
      }

      return {
        success: !!user,
        message: user ? "User found" : "User not found",
        data: user || {},
      };
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID:", (error as Error).message);
    return { success: false, message: (error as Error).message, data: {} };
  }
};
