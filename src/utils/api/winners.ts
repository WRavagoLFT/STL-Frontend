import axiosInstance from "../axiosInstance";

// Helper to validate URL paths
const validateRelativeUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        throw new Error('Absolute URLs are not allowed.');
    }
    return url;
};

export const fetchWinners = async (params?: {
  from: string;
  to: string;
  gameCategoryId?: number; // accept gameCategoryId here
}) => {
  try {
    const url = validateRelativeUrl("/winners/getWinners");

    const response = await axiosInstance.get(url, {
      params: {
        from: params?.from,
        to: params?.to,
        gameType: params?.gameCategoryId, // map gameCategoryId to gameType here
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching winners:", (error as Error).message);
    return { success: false, message: (error as Error).message, data: [] };
  }
};


export const fetchCompareHistoricalWinnersDate = async (
  urlPath: string,
  chartType: string,
  query: Record<string, any>
) => {
  try {
    const url = validateRelativeUrl(`${urlPath}${chartType}`);
    const response = await axiosInstance.get(url, {
      params: query,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching historical date comparison:", (error as Error).message);
    return { success: false, message: (error as Error).message, data: [] };
  }
};

export const fetchCompareHistoricalWinnersRange = async (
  urlPath: string,
  chartType: string,
  query: Record<string, any>
) => {
  try {
    const url = validateRelativeUrl(`${urlPath}${chartType}`);
    const response = await axiosInstance.get(url, {
      params: query,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching historical data:", (error as Error).message);
    return { success: false, message: (error as Error).message, data: [] };
  }
};
