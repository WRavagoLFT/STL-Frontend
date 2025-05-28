import { Operator, User } from "~/types/types";
import axiosInstance from "../axiosInstance";

// Helper to validate URL paths
const validateRelativeUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        throw new Error('Absolute URLs are not allowed.');
    }
    return url;
};

// fetching of users and operator map
const fetchUsers = async (
  roleId: number,
  setData: (data: User[]) => void
): Promise<Record<number, Operator> | null> => {
  if (!roleId) {
    console.warn("No roleId provided");
    setData([]);
    return null;
  }

  // Cache URLs once
  const userUrl = validateRelativeUrl("/users/getUsers");
  const operatorUrl = validateRelativeUrl("/operators/getOperators");

  try {
    const [userResponse, operatorResponse] = await Promise.all([
      axiosInstance.get(userUrl, { params: { roleId }, withCredentials: true }),
      axiosInstance.get(operatorUrl, { withCredentials: true }),
    ]);

    const users: User[] = userResponse.data?.data ?? [];
    const operators: Operator[] = operatorResponse.data?.data ?? [];

    // Validate success flags and arrays early
    if (!userResponse.data.success || !operatorResponse.data.success) {
      setData([]);
      return null;
    }

    // Create operator map
    const operatorMap = operators.reduce<Record<number, Operator>>((map, operator) => {
      const id = operator.OperatorId;

      if (typeof id === 'number') {
        map[id] = operator;
      }

      return map;
    }, {});

    // Helper to build full name
    const buildFullName = (user: User) =>
      [user.FirstName, user.LastName].filter(Boolean).join(" ");

    // Filter and enrich users
    const filteredUsers = users
      .filter(user => user.UserTypeId === roleId)
        .map(user => {
          const operatorId = user.OperatorId;
          const operatorDetails = typeof operatorId === 'number' ? operatorMap[operatorId] ?? null : null;

          return {
            ...user,
            fullName: buildFullName(user),
            OperatorDetails: operatorDetails,
          };
        });

    setData(filteredUsers); // 
    return operatorMap;
  } catch (error) {
    console.error("Error fetching users or operators:", (error as Error).message);
    setData([]);
    return null;
  }
};

// Add user function
const addUser = async (userData: Record<string, any>) => {
    try {
        const url = validateRelativeUrl("/users/addUser");
        const response = await axiosInstance.post(url, userData, {
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        console.error("Error adding user:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: {} };
    }
};

// Fetch user by ID function
const fetchUserById = async (userId: string | number, ) => {
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
const updateUser = async (userData: Record<string, any>) => {
  try {
    const url = validateRelativeUrl("/users/edituser");

    console.log("Sending PATCH request to:", url);
    console.log("Payload:", JSON.stringify(userData, null, 2));

    const response = await axiosInstance.patch(
      url,
      userData  // <-- send userData directly, NOT wrapped inside { userData }
    );

    console.log("Response data:", response.data);

    return response.data;
  } catch (error: any) {
    // More detailed error logging
    if (error.response) {
      // Server responded with status code outside 2xx
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
const editLogUser = async (userId: number) => {
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

export { fetchUsers, addUser, updateUser, fetchUserById, editLogUser };