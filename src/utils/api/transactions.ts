import axios from "axios";
import axiosInstance from "../axiosInstance";

const validateRelativeUrl = (url: string) => {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    throw new Error("Absolute URLs are not allowed.");
  }
  return url;
};

export const fetchHistoricalSummary = async (filters?: {
  from?: string;
  to?: string;
}) => {
  try {
    const url = validateRelativeUrl("/transactions/getHistorical");
    const response = await axiosInstance.get(url, {
      params: filters,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching users:", (error as Error).message);
    return { success: false, message: (error as Error).message, data: [] };
  }
};

export const fetchHistoricalRegion = async <T = any>(p0?: { date: string }): Promise<T> => {
  try {
    const url = validateRelativeUrl("/transactions/getHistoricalRegion");
    const response = await axiosInstance.get(url, {});

    return response.data;
  } catch (error) {
    console.error("Error fetching historical region data:", (error as Error).message);
    throw error; // optionally throw or handle differently
  }
};

export const fetchTransactions = async (filters?: {
  from?: string;
  to?: string;
}) => {
  try {
    const url = validateRelativeUrl("/transactions/getTransactions");
    const response = await axiosInstance.get(url, {
      params: filters,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching users:", (error as Error).message);
    return { success: false, message: (error as Error).message, data: [] };
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

export const fetchRetailReceiptsDashboard = async (
  year: number,
  month: number
) => {
  try {
    const url = `/transactions/getRetailReceipts/metrics/${year}/${month}`;
    const { data } = await axiosInstance.get(url);
    return data;
  } catch (error: any) {
    console.error(
      "Error fetching retail receipts:",
      error?.response?.data || error.message
    );
    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong",
      data: [],
    };
  }
};

export const fetchRetailReceipts = async (
  year: number,
  month: number,
  operatorId?: number
) => {
  try {
    const url = `/transactions/getRetailReceipts/${year}/${month}`;
    const { data } = await axiosInstance.get(url, {
      params: operatorId ? { operatorId } : {}, // Add query param only if operatorId exists
    });
    return data;
  } catch (error: any) {
    console.error(
      "Error fetching retail receipts:",
      error?.response?.data || error.message
    );
    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong",
      data: [],
    };
  }
};

interface CompareHistoricalDateParams {
  chartType: string;
  query: {
    first: string;
    second: string;
    [key: string]: any; // for dynamic gameCategoryParam
  };
}

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
    return response.data;
  } catch (error) {
    console.error("Error fetching historical data:", (error as Error).message);
    return { success: false, message: (error as Error).message, data: [] };
  }
};







  
