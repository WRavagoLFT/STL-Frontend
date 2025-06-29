import { GameCombination } from '~/types/types';
import axiosInstance from '../../utils/axiosInstance';
import axios, { AxiosError } from 'axios'; // Import AxiosError for better typing

const validateRelativeUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        throw new Error('Absolute URLs are not allowed.');
    }
    return url;
};

const getTodaysWinningCombination = async () => {
    try {
        const url = validateRelativeUrl("/winningcombinations/getTodayWinningCombinations");
        const response = await axiosInstance.get(url, {
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching users:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: [] };
    }
};

const addWinningCombination = async (data: GameCombination) => {
  try {
    const url = validateRelativeUrl("/winningcombinations/addWinningCombination");
    const response = await axiosInstance.post(url, data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;

    let customMessage = "Something went wrong while adding the combination.";

    // Optional: match specific backend status or message content
    if (
      axiosError.response &&
      axiosError.response.status === 400
    ) {
      // Example: you *expect* this status to mean duplicate combination
      customMessage = "A winning combination already exists for the same game type and schedule today.";
    }

    return {
      success: false,
      message: customMessage,
      data: [],
    };
  }
};

export { getTodaysWinningCombination, addWinningCombination };



