import { Branch, Operator, User } from "~/types/types";
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

// fetching of users and operator map
export const fetchUsersByRole = async (
  roleId: number,
  operatorMap: Record<number, Operator> | null = null,
  pscoBranchMap: Record<number, Branch> | null = null
): Promise<{ success: boolean; message: string; data: User[] }> => {
  if (!roleId) {
    return {
      success: false,
      message: "No roleId provided",
      data: [],
    };
  }

  const url = validateRelativeUrl("/users/getUsers");
  try {
    const response = await axiosInstance.get(url, {
      params: { roleId },
    });

    const rawUsers: User[] = response.data?.data ?? [];

    if (!response.data.success) {
      return {
        success: false,
        message: "API returned unsuccessful",
        data: [],
      };
    }

    const buildFullName = (user: User) =>
      [user.FirstName, user.LastName].filter(Boolean).join(" ");

    const users = rawUsers
      .filter((user) => user.UserTypeId === roleId)
      .map((user) => {
        const operatorId = user.OperatorId;
        const operatorDetails =
          typeof operatorId === "number"
            ? (operatorMap?.[operatorId] ?? null)
            : null;

        return {
          ...user,
          fullName: buildFullName(user),
          OperatorDetails: operatorDetails,
        };
      });

    return {
      success: true,
      message: "Users fetched successfully",
      data: users,
    };
  } catch (error) {
    return handleError("fetchUsers", error);
  }
};

export const fetchOperatorMap = async (): Promise<{
  success: boolean;
  message: string;
  data: Record<number, Operator>;
}> => {
  const operatorUrl = validateRelativeUrl("/operators/getOperators");

  try {
    const response = await axiosInstance.get(operatorUrl, {
      withCredentials: true,
    });

    const operators: Operator[] = response.data?.data ?? [];

    if (!response.data.success || !operators.length) {
      return {
        success: false,
        message: "No operators found or request failed",
        data: {},
      };
    }

    const operatorMap = operators.reduce<Record<number, Operator>>(
      (map, operator) => {
        if (typeof operator.OperatorId === "number") {
          map[operator.OperatorId] = operator;
        }
        return map;
      },
      {}
    );

    return {
      success: true,
      message: "Fetched operators successfully",
      data: operatorMap,
    };
  } catch (error) {
    return handleError("fetchOperatorMap", error);
  }
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
