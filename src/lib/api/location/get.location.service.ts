import axiosInstance from '../../../utils/axiosInstance';
import { AxiosError } from 'axios';

/**
 * A service function to fetch data from the Location API endpoint.

 * @template T - the expected response data type (defaults to unknown if not provided).
 * @param endpoint - The API endpoint to fetch data from.
 * @param queryParams - Optional query parameters (remain loosely typed for now)
 * @returns Promise containing either properly typed response or erro object.

 */


/*
    * Add type gradually as our API respose become clearer:

    Early usage (no type specified):
    const response = await getLocation('/some/endpoint');

    Later usage (with type):
    interface MyResponseType {
        items: Array<{id: string, value: number}>;
        total: number;
    }
    const typedResponse = await getLocation<MyResponseType>('/typed/endpoint');
*/

// <T> generic type parameter, placeholder for the actual type that will be provided when the function is called, unknown = default
export const getLocation = async <T = unknown>(
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
            message: "GET Request on Location Data Succeeded",
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