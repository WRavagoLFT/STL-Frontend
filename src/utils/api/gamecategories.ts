import axiosInstance from '../axiosInstance';

const validateRelativeUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        throw new Error('Absolute URLs are not allowed.');
    }
    return url;
};

export const fetchGameCategories = async () => {
    try {
        const url = validateRelativeUrl("/gameTypes/getGameCategories");
        const response = await axiosInstance.get(url)

        return response.data
    }

    catch (error) {
        console.error("Error fetching game categories:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: [] };
    }
}

export const fetchGameSchedule = async () => {
    try {
        const url = validateRelativeUrl("/gameTypes/getGameSchedule");
        const response = await axiosInstance.get(url)

        return response.data
    }

    catch (error) {
        console.error("Error fetching game categories:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: [] };
    }
}

export const fetchGameTypes = async () => {
    try {
        const url = validateRelativeUrl("/gameTypes");
        const response = await axiosInstance.get(url)

        return response.data
    }

    catch (error) {
        console.error("Error fetching game categories:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: [] };
    }
}



