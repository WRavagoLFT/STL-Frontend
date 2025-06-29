import { AxiosError } from 'axios';
import axiosInstance from '../axiosInstance';

/**
 * A service function to fetch data from the Game Types API endpoint.

 * @template T - the expected response data type (defaults to unknown if not provided).
 * @param endpoint - The API endpoint to fetch data from.
 * @param queryParams - Optional query parameters (remain loosely typed for now)
 * @returns Promise containing either properly typed response or erro object.

 */


/*
    * Add type gradually as our API respose become clearer:

    Early usage (no type specified):
    const response = await getGameTypesData('/some/endpoint');

    Later usage (with type):
    interface MyResponseType {
        items: Array<{id: string, value: number}>;
        total: number;
    }
    const typedResponse = await getGameTypesData<MyResponseType>('/typed/endpoint');
*/

// <T> generic type parameter, placeholder for the actual type that will be provided when the function is called, unknown = default
export const getGameTypesData = async <T = unknown>(
    endpoint: string,
    queryParams: Record<string, unknown> = {}
):Promise<{
    success: boolean;
    message?: string;
    data: T | null; // on success: T which is generic, on error: null
}> => {

    try {
        const response = await axiosInstance.get<T>(endpoint, {
            params: queryParams,
        })

        return {
            success: true,
            message: "GET Request on Game Types Data Succeeded",
            data: response.data
        }
    } catch (error) {
        let errorMessage = "An unexpected error occured";

        if(error instanceof AxiosError){
            errorMessage = error.response?.data?.message || errorMessage;
            console.error(`API Error (${endpoint}):`, errorMessage)
        }else if (error instanceof Error) {
            errorMessage = error.message;
            console.error("Unexpected error:", error);
        }

        return {
            success: false,
            message: errorMessage,
            data: null, 
        }
    }
}