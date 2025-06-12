import axiosInstance from "../axiosInstance";

interface EditLog {
  id: number;
  User: string;
  Action: string;
  Timestamp: string;
  Details?: string;
}

interface EditLogResponse {
  success: boolean;
  message?: string;
  data: EditLog[];
}

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
export const updateOperator = async (userData: Record<string, any>) => {
  try {
    const url = validateRelativeUrl("/operators/editOperator");

    // Log the URL and payload before sending
    console.log("[updateOperator] URL:", url);
    console.log("[updateOperator] Payload:", userData);
    console.log("[updateOperator] Stringified Payload:", JSON.stringify(userData, null, 2));

    const response = await axiosInstance.patch(url, userData);

    // Log response details
    console.log("[updateOperator] Response status:", response.status);
    console.log("[updateOperator] Response data:", response.data);

    return response.data;
  } catch (error: any) {
    console.error("[updateOperator] ❌ Error occurred during PATCH request");

    if (error.response) {
      // Backend responded with a status code outside 2xx
      console.error("[updateOperator] Response status:", error.response.status);
      console.error("[updateOperator] Response data:", error.response.data);
      console.error("[updateOperator] Response headers:", error.response.headers);

      return {
        success: false,
        message: error.response.data?.message || "Server returned an error",
        data: error.response.data || {},
      };
    } else if (error.request) {
      // Request was made but no response
      console.error("[updateOperator] Request made but no response received");
      console.error("[updateOperator] Request details:", error.request);

      return {
        success: false,
        message: "No response received from server",
        data: {},
      };
    } else {
      // Something else happened
      console.error("[updateOperator] Error setting up request:", error.message);

      return {
        success: false,
        message: error.message,
        data: {},
      };
    }
  }
};


// Get user edit log function
const editLogOperator = async (
  operatorId: number
): Promise<EditLogResponse> => {
  try {
    const url = validateRelativeUrl(`/operators/getOperatorEdits/${operatorId}`);
    console.log(`[editLogOperator] Fetching logs for OperatorId: ${operatorId} from URL: ${url}`);

    const response = await axiosInstance.get<EditLogResponse>(url);

    console.log("[editLogOperator] Response received:", response.data);

    return response.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[editLogOperator] Error fetching edit logs for OperatorId ${operatorId}:`, message);
    
    return {
      success: false,
      message,
      data: []
    };
  }
};


export { fetchOperators, fetchOperator, addOperator, editLogOperator };