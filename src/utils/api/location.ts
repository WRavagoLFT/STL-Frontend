import axiosInstance from '../axiosInstance';

const validateRelativeUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        throw new Error('Absolute URLs are not allowed.');
    }
    return url;
};

export const fetchRegions = async () => {
    try {
        const url = validateRelativeUrl("/location/getRegions");
        const response = await axiosInstance.get(url)

        return response.data
    }

    catch (error) {
        console.error("Error fetching regions:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: [] };
    }
}

export const fetchProvinces = async (filters?: { regionId: number }) => {
  const timestamp = new Date().toISOString();
  try {
    const url = validateRelativeUrl("/location/getProvinces");
    const response = await axiosInstance.get(url, {
      params: {
        regionId: filters?.regionId,
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error(`[${timestamp}] [fetchProvinces] Error occurred: ${errorMessage}`);

    return {
      success: false,
      message: errorMessage,
      data: [],
    };
  }
};

export const fetchCities = async() => {
    try {
        const url = validateRelativeUrl("/location/getCities");
        const params: Record<string, any> = {};

        // filters?: { availableOnly?: boolean }
        // if (filters?.provinceId) params.provinceId = filters.provinceId;
        // if (filters?.availableOnly !== undefined) params.availableOnly = filters.availableOnly;

        const response = await axiosInstance.get(url, { params });

        return response.data;
    }
    catch (error) {
        console.error("Error fetching cities:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: [] };
    }
}

export const fetchAreaOfOperations = async () => {
    try {
        const url = validateRelativeUrl("/operators/getAreaOptions");
        const response = await axiosInstance.get(url)

        return response.data
    }

    catch (error) {
        console.error("Error fetching regions:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: [] };
    }
}

export const fetchPCSOBranch = async () => {
    try {
        const url = validateRelativeUrl("/location/pcso-branches");
        const response = await axiosInstance.get(url)
        return response.data
    }

    catch (error) {
        console.error("Error fetching regions:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: [] };
    }
}


