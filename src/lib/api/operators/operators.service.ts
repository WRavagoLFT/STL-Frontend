import axiosInstance from "../axiosInstance";

// Define interfaces (if not globally declared)
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
    if (url.startsWith('http://') || url.startsWith('https://')) {
        throw new Error('Absolute URLs are not allowed.');
    }
    return url;
};

// Generic error handler
const handleError = (label: string, error: any) => {
  const message = error?.response?.data?.message || error?.message || "Unknown error";
  console.error(`[${label}] Error:`, message);
  return { success: false, message, data: error?.response?.data || {} };
};

export interface OperatorsItem {
  OperatorId: number;
  OperatorName: string;
  CreatedAt: string; // ISO Date string
  CreatedBy: string;
  Status: number;
  OperatorEmail: string;
  DateOfOperation: string; // ISO Date string
  AreaOfOperations: string | null;
  OperatorAddress: string;
  OperatorContactNos: string;
  OperatorRepresentative: string;
  IsDeleted: number;
  Email: string;
  Executive: string;
  ContactNo: string;
  Managers: {
    Name: string;
  }[];
  Cities: {
    CityId: number;
    CityName: string;
  }[];
  Region: {
    RegionId: number;
    RegionName: string;
    RegionFull: string;
    PSGC: string;
  };
  GameTypes: {
    GameCategory: string;
    GameCategoryId: number;
  }[];
  LastUpdatedBy: string;
  LastUpdatedDate: string; // ISO Date string
}

export interface OperatorsResponse {
  success: boolean;
  data: OperatorsItem[];
  message?: string;
}

export const fetchOperators = async (): Promise<OperatorsResponse> => {
  const url = validateRelativeUrl("/operators/getOperators");
  const response = await axiosInstance.get<OperatorsResponse>(url);
  return response.data;
};

// Add operator (POST)
export const addOperator = async (userData: Record<string, any>) => {
  try {
    const url = validateRelativeUrl("/operators/addOperator");
    const response = await axiosInstance.post(url, userData);
    return response.data;
  } catch (error) {
    return handleError("addOperator", error);
  }
};

// Update operator (PATCH)
export const updateOperator = async (userData: Record<string, any>) => {
  try {
    const url = validateRelativeUrl("/operators/editOperator");
    const response = await axiosInstance.patch(url, userData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data?.message || "Server returned an error",
        data: error.response.data || {},
      };
    } else if (error.request) {
      return {
        success: false,
        message: "No response received from server",
        data: {},
      };
    } else {
      return {
        success: false,
        message: error.message,
        data: {},
      };
    }
  }
};

// Fetch operator edit logs
export const editLogOperator = async (operatorId: number): Promise<EditLogResponse> => {
  try {
    const url = validateRelativeUrl(`/operators/getOperatorEdits/${operatorId}`);
    const response = await axiosInstance.get<EditLogResponse>(url);
    return response.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      message,
      data: [],
    };
  }
};
