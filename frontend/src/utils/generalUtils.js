import axios from 'axios';
import { API_URL } from "../utils/constans";

// Get the minimum date and time (for date picker)
export const getMinDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Fetch all main professions
export const getMainProfessions = async () => {
    try {
        const response = await axios.get(`${API_URL}/main-professions`);
        return response.data.slice(1);  // Remove the first element if needed
    } catch (error) {
        console.error('Error fetching main professions:', error);
        throw error;
    }
};

// Fetch sub professions based on the selected main profession
export const getSubProfessions = async (main) => {
    try {
        const response = await axios.get(`${API_URL}/sub-professions/${main}`);
        return response.data.slice(1);  // Remove the first element if needed
    } catch (error) {
        console.error('Error fetching sub professions:', error);
        throw error;
    }
};

// Get the direction based on language
export const getDirection = (language) => {
    return language === 'ar' || language === 'he' ? 'rtl' : 'ltr';
};

// Check if the language is RTL
export const isRtl = (language) => {
    return ['ar', 'he'].includes(language);
};
