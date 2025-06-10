import { GameCombination } from '~/types/types';
import axiosInstance from '../axiosInstance';
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
    console.log("Backend Success Response:", response.data); // Log success response too
    return response.data;
  } catch (error) {
    // Cast the error to AxiosError for type safety and better access to properties
    const axiosError = error as AxiosError;

    console.error("--- Backend Error Debugging Logs ---");
    console.error("Original Error Object:", axiosError); // Log the full error object

    if (axiosError.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error Response Data:", axiosError.response.data);
      console.error("Error Response Status:", axiosError.response.status);
      console.error("Error Response Headers:", axiosError.response.headers);
      console.error("Message from backend (if available):", (axiosError.response.data as any)?.message); // Attempt to access a common 'message' property
      console.error("Errors from backend (if validation errors):", (axiosError.response.data as any)?.errors); // Attempt to access common 'errors' array
    } else if (axiosError.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an http.ClientRequest in node.js
      console.error("No response received. Request details:", axiosError.request);
      console.error("Is it a network issue or CORS error?");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up the request:", axiosError.message);
    }
    console.error("Axios config:", axiosError.config); // The config that was used for the request
    console.error("--- End Backend Error Debugging Logs ---");

    // Return a consistent error structure for your frontend
    return { success: false, message: axiosError.message, data: [] };
  }
}
export { getTodaysWinningCombination, addWinningCombination };



