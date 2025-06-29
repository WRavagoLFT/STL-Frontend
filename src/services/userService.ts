// services/userService.ts

import axiosInstance from "~/lib/api/axiosInstance";
import { getGameTypesData } from "~/lib/api/gameTypes/get.gameTypes.service";

export async function fetchOperatorById(operatorId: number | string) {
  if (!operatorId) {
    console.warn("fetchOperatorById: No operatorId provided.");
    return null;
  }

  try {
    const response = await axiosInstance.get("/operators/getOperator", {
      params: { operatorId },
    });

    // Optional: Check if data actually exists
    if (!response.data) {
      console.warn("fetchOperatorById: Empty response for operatorId", operatorId);
      return null;
    }

    return response.data;
  } catch (error: any) {
    console.error(`Failed to fetch operator by ID (${operatorId}):`, error?.response?.data || error.message);
    return null;
  }
}








