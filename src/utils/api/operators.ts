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