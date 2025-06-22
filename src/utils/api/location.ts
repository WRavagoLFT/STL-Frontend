import axiosInstance from "~/utils/axiosInstance";

const validateRelativeUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        throw new Error('Absolute URLs are not allowed.');
    }
    return url;
};

// Common error handler
const handleError = (context: string, error: any) => {
  const message = error?.response?.data?.message || error?.message || "Unknown error";
  console.error(`[${context}] Error:`, message);
  return { success: false, message, data: [] };
};

// Regions
export const fetchRegions = async () => {
  try {
    const url = validateRelativeUrl("/location/getRegions");
    const response = await axiosInstance.get(url);
    return { success: true, message: "Regions fetched", data: response.data?.data || [] };
  } catch (error) {
    return handleError("fetchRegions", error);
  }
};

// Provinces
export const fetchProvinces = async (filters?: { regionId: number }) => {
  try {
    const url = validateRelativeUrl("/location/getProvinces");
    const response = await axiosInstance.get(url, {
      params: { regionId: filters?.regionId },
    });
    return { success: true, message: "Provinces fetched", data: response.data?.data || [] };
  } catch (error) {
    return handleError("fetchProvinces", error);
  }
};

// Cities
export const fetchCities = async () => {
  try {
    const url = validateRelativeUrl("/location/getCities");
    const response = await axiosInstance.get(url);
    return { success: true, message: "Cities fetched", data: response.data?.data || [] };
  } catch (error) {
    return handleError("fetchCities", error);
  }
};

// PCSO Branches
export const fetchPCSOBranch = async () => {
  try {
    const url = validateRelativeUrl("/location/pcso-branches");
    const response = await axiosInstance.get(url);
    return { success: true, message: "PCSO branches fetched", data: response.data?.data || [] };
  } catch (error) {
    return handleError("fetchPCSOBranch", error);
  }
};

// Area of Operations
export const fetchAreaOfOperations = async () => {
  try {
    const url = validateRelativeUrl("/operators/getAreaOption");
    const response = await axiosInstance.get(url);
    return { success: true, message: "Cities fetched", data: response.data?.data || [] };
  } catch (error) {
    return handleError("fetchCities", error);
  }
};
