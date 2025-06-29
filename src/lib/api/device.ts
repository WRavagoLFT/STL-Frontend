import { AxiosError } from 'axios';
import axiosInstance from '../../utils/axiosInstance';

const validateRelativeUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        throw new Error('Absolute URLs are not allowed.');
    }
    return url;
};

export const fetchDevices = async () => {
    try {
        const url = validateRelativeUrl("/devices");
        const response = await axiosInstance.get(url)
        return response.data
    }

    catch (error) {
        console.error("Error fetching regions:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: [] };
    }
}

export const fetchDeviceById = async (deviceId: number | string) => {
  try {
    const url = validateRelativeUrl(`/devices/?deviceId=${deviceId}`);
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching device:", (error as Error).message);
    return {
      success: false,
      message: (error as Error).message,
      data: [],
    };
  }
};

export const fetchUsageNotes = async () => {
    try {
        const url = validateRelativeUrl("/devices/usage-notes");
        const response = await axiosInstance.get(url)
        return response.data
    }

    catch (error) {
        console.error("Error fetching regions:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: [] };
    }
}

export const addDevice = async (userData: Record<string, any>) => {
  try {
    const url = validateRelativeUrl("/devices/");
    //console.log("Sending Device Data:", userData);

    const response = await axiosInstance.post(url, userData, {});
    //console.log("Backend Response:", response.data);

    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Unknown error occurred";

    console.error("Error adding device:", message);
    if (error?.response) {
      console.error("📥 Error Response Data:", error.response.data);
    }

    return { success: false, message, data: {} };
  }
};

export const updateDevice = async (
  deviceId: string | number,
  data: Record<string, any>
) => {
  try {
    const url = validateRelativeUrl(`/devices/${deviceId}`);
    //console.log("Sending PATCH request to:", url);

    const response = await axiosInstance.patch(url, data);

    //console.log("Response data:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
      return {
        success: false,
        message: error.response.data?.message || "Server returned an error",
        data: error.response.data || {},
      };
    } else if (error.request) {
      console.error("No response received:", error.request);
      return {
        success: false,
        message: "No response received from server",
        data: {},
      };
    } else {
      console.error("Error setting up request:", error.message);
      return {
        success: false,
        message: error.message,
        data: {},
      };
    }
  }
};

export const editLogDevice = async (deviceId: number) => {
  try {
    const url = `/devices/${deviceId}/edit-log`; // replaced :deviceId with actual ID

    const response = await axiosInstance.get(url);

    console.log("Edit log response:", response.data);

    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Error fetching edit log:", err.message);
    return {
      success: false,
      message: err.message || "Something went wrong",
      data: {},
    };
  }
};

