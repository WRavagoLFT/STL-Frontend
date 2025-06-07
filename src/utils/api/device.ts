import axiosInstance from '../axiosInstance';

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
