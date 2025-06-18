import { Branch, Operator, User } from "~/types/types";
import axiosInstance from "../axiosInstance";
import axios from "axios";

// Helper to validate URL paths
const validateRelativeUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        throw new Error('Absolute URLs are not allowed.');
    }
    return url;
};

// fetching of users and operator map
export const fetchUsersByRole = async (
  roleId: number,
  operatorMap: Record<number, Operator> | null,
  pscoBranchMap: Record<number, Branch> | null,
  setData: (data: User[]) => void
): Promise<void> => {
  if (!roleId) {
    console.warn("No roleId provided");
    setData([]);
    return;
  }

  const userUrl = validateRelativeUrl("/users/getUsers");

  try {
    const response = await axiosInstance.get(userUrl, {
      params: { roleId },
      withCredentials: true,
    });

    const users: User[] = response.data?.data ?? [];

    if (!response.data.success) {
      setData([]);
      return;
    }

    const buildFullName = (user: User) =>
      [user.FirstName, user.LastName].filter(Boolean).join(" ");

    const filteredUsers = users
      .filter(user => user.UserTypeId === roleId)
      .map(user => {
        const operatorId = user.OperatorId;
        const operatorDetails = typeof operatorId === 'number' ? operatorMap?.[operatorId] ?? null : null;

        return {
          ...user,
          fullName: buildFullName(user),
          OperatorDetails: operatorDetails,
        };
      });

    setData(filteredUsers);
  } catch (error) {
    console.error("Error fetching users:", (error as Error).message);
    setData([]);
  }
};

export const fetchOperatorMap = async (): Promise<Record<number, Operator> | null> => {
  const operatorUrl = validateRelativeUrl("/operators/getOperators");

  try {
    const response = await axiosInstance.get(operatorUrl, { withCredentials: true });
    const operators: Operator[] = response.data?.data ?? [];

    if (!response.data.success) {
      return null;
    }

    const operatorMap = operators.reduce<Record<number, Operator>>((map, operator) => {
      const id = operator.OperatorId;
      if (typeof id === 'number') {
        map[id] = operator;
      }
      return map;
    }, {});

    return operatorMap;
  } catch (error) {
    console.error("Error fetching operators:", (error as Error).message);
    return null;
  }
};

// Add user function
export const addUser = async (userData: Record<string, any>) => {
  try {
    const url = validateRelativeUrl("/users/addUser");
    const response = await axiosInstance.post(url, userData, {
      withCredentials: true,
    });

    console.log("Backend response received:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error adding user:", error); // log entire error object
    return {
      success: false,
      message: (error as Error).message,
      data: {},
    };
  }
};

// Fetch user by ID function
export const fetchUserById = async (userId: string | number, ) => {
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

            return { success: !!user, message: user ? "User found" : "User not found", data: user || {} };
        }

        return response.data;
    } catch (error) {
        console.error("Error fetching user by ID:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: {} };
    }
};

// Update user function
export const updateUser = async (userData: Record<string, any>) => {
  try {
    const url = validateRelativeUrl("/users/edituser");
    const response = await axiosInstance.patch(
      url,
      userData
    );

    return response.data;
  } catch (error: any) {
    // More detailed error logging
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
      return {
        success: false,
        message: error.response.data?.message || "Server returned an error",
        data: error.response.data || {},
      };
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response received:", error.request);
      return {
        success: false,
        message: "No response received from server",
        data: {},
      };
    } else {
      // Something else happened while setting up the request
      console.error("Error setting up request:", error.message);
      return {
        success: false,
        message: error.message,
        data: {},
      };
    }
  }
};

// Get user edit log function
export const editLogUser = async (userId: number) => {
    try {
        const url = validateRelativeUrl("/users/getEditLog");
        const response = await axiosInstance.get(url, {
            params: { userId },
        });
        console.log("Edit log response:", response.data);

        return response.data;
    } catch (error) {
        console.error("Error fetching edit log:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: {} };
    }
};

export const suspendUser = async (userId: number, remarks?: string) => {
  try {
    const url = validateRelativeUrl(`/users/${userId}/suspend`);

    const payload = {
      userId,
      remarks,
    };

    console.log("[suspendUser] Endpoint URL:", url);
    console.log("[suspendUser] Payload:", payload);

    const response = await axiosInstance.patch(url, payload);

    return response.data;
  } catch (error) {
    console.error("Error suspending user:", (error as Error).message);
    return { success: false, message: (error as Error).message, data: {} };
  }
};






