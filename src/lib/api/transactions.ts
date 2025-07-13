import { WebDashboard } from "@/types/types";
import axiosInstance from "./axiosInstance";

const validateRelativeUrl = (url: string) => {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    throw new Error("Absolute URLs are not allowed.");
  }
  return url;
};

const handleError = (label: string, error: any) => {
  const message = error?.response?.data?.message || error?.message || "Unknown error";
  console.error(`[${label}] Error:`, message);
  return { success: false, message, data: [] };
};

// Fetch historical summary
export const fetchHistoricalSummary = async (filters?: {from?: string; to?: string;}) => {
  try {
    const url = validateRelativeUrl("/transactions/getHistorical");
    const response = await axiosInstance.get(url, { params: filters });
    return response.data;
  } catch (error) {
    return handleError("fetchHistoricalSummary", error);
  }
};

// Fetch historical summary by region
export const fetchHistoricalRegion = async <T = any>(filters?: { date?: string }): Promise<T> => {
  try {
    const url = validateRelativeUrl("/transactions/getHistoricalRegion");
    const response = await axiosInstance.get(url, {
      params: filters,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching historical region data:");
    console.error("Status:", error?.response?.status);
    console.error("Details:", error?.response?.data);
    throw error;
  }
};

// Fetch detailed transactions
export const fetchTransactions = async (filters?: {
  from?: string;
  to?: string;
}) => {
  try {
    const url = validateRelativeUrl("/transactions/getTransactions");
    const response = await axiosInstance.get(url, { params: filters });
    console.log("Response data:", response.data);
    return response.data;
  } catch (error) {
    return handleError("fetchTransactions", error);
  }
};

export const fetchDrawSummary = async (
  provinceId: number,
  gameCategoryId: number,
  month: number
) => {
  try {
    const url = validateRelativeUrl("/transactions/getDrawSummary");
    const response = await axiosInstance.get(url, {
      params: {
        provinceId: provinceId,
        gameCategoryId: gameCategoryId,
        month: month,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching draw summary:", (error as Error).message);
    return { success: false, message: (error as Error).message, data: [] };
  }
};

export const fetchRetailReceiptsMetrics = async (
  year: number,
  month?: number
) => {
  try {
    // Choose endpoint based on presence of month param
    const url = month
      ? `/transactions/getRetailReceipts/metrics/${year}/${month}`
      : `/transactions/getRetailReceipts/metrics/${year}`;

    const { data } = await axiosInstance.get(url);
    return data;
  } catch (error: any) {
    console.error(
      "Error fetching retail receipts metrics:",
      error?.response?.data || error.message
    );
    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong",
      data: [],
    };
  }
};

export const fetchRetailReceiptsData = async (
  year: number,
  month?: number,
  filterByParam?: number, // if still needed
  operatorId?: number
) => {
  try {
    const baseUrl = month
      ? `/transactions/getRetailReceipts/${year}/${month}`
      : `/transactions/getRetailReceipts/${year}`;

    const params: Record<string, any> = {};

    if (operatorId) params.operatorId = operatorId;
    if (filterByParam) params.filterBy = filterByParam;

    const { data } = await axiosInstance.get(baseUrl, { params });

    return data;
  } catch (error: any) {
    console.error(
      "Error fetching retail receipts data:",
      error?.response?.data || error.message
    );
    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong",
      data: [],
    };
  }
};

export const fetchCompareHistoricalDate = async (
  urlPath: string,
  chartType: string,
  query: Record<string, any>
) => {
  try {
    const url = validateRelativeUrl(`${urlPath}${chartType}`);
    const response = await axiosInstance.get(url, {
      params: query,
    });
    console.log("Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching historical date comparison:", (error as Error).message);
    return { success: false, message: (error as Error).message, data: [] };
  }
};

export const fetchCompareHistoricalRange = async (
  urlPath: string,
  chartType: string,
  query: Record<string, any>
) => {
  try {
    const url = validateRelativeUrl(`${urlPath}${chartType}`);
    const response = await axiosInstance.get(url, {
      params: query,
    });
    console.log("Response data:", response.data);
    return response.data;
    
  } catch (error) {
    console.error("Error fetching historical data:", (error as Error).message);
    return { success: false, message: (error as Error).message, data: [] };
  }
};

export const fetchWebDashboard = async ( filters?: {
  region?: number, 
  province?: number, 
  city?: number, 
  gameCategory?: number, 
  gameSchedule?: number, 
  from?: string, 
  to?: string,
  operator?: number
}) => {
  try {
    const url = validateRelativeUrl("/transactions/dashboard/web");
    const response = await axiosInstance.get(url, { params: filters });
    console.log("Web Dashboard Response:", response.data);
    return response.data;
  }
  catch (error) {
    return handleError("fetchWebDashboard", error);
  }
}