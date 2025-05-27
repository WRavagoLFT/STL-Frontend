import axiosInstance from "../axiosInstance";

const validateRelativeUrl = (url: string) => {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    throw new Error("Absolute URLs are not allowed.");
  }
  return url;
};

const fetchOperators = async () => {
  try {
    const url = validateRelativeUrl("/operators/getOperators");
    const response = await axiosInstance.get(url, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching users:", (error as Error).message);
    return { success: false, message: (error as Error).message, data: [] };
  }
};

const fetchOperator = async (operatorId: string | number) => {
  try {
    // Ensure the URL is valid using the validateRelativeUrl function
    const url = validateRelativeUrl("/operators/getOperator");
    const response = await axiosInstance.get(url, {
      params: { operatorId },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching operator:", (error as Error).message);

    return { success: false, message: (error as Error).message, data: [] };
  }
};

const addOperator = async (userData: Record<string, any>) => {
    try {
        const url = validateRelativeUrl("/operators/addOperator");
        const response = await axiosInstance.post(url, userData, {
        });

        return response.data;
    } catch (error) {
        console.error("Error adding user:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: {} };
    }
};

// Get user edit log function
const editLogOperator = async (operatorId: number) => {
    try {
        const url = validateRelativeUrl("/users/getEditLog");
        const response = await axiosInstance.get(url, {
            params: { operatorId },
        });

        console.log("Edit log response:", response.data);

        return response.data;
    } catch (error) {
        console.error("Error fetching edit log:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: {} };
    }
};

export { fetchOperators, fetchOperator, addOperator, editLogOperator };