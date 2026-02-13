import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

// Adapted Base URL logic
const getBaseUrl = () => {
    if (__DEV__) {
        // Use localhost for iOS simulator and 10.0.2.2 for Android emulator
        // Or specific IP if needed
        return Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000";
    }
    return "https://your-production-api.com";
};

const BASE_URL = getBaseUrl() + "/api";

// Helper to get token (since we aren't using the exact Context pattern yet, but the API demands it as arg usually)
// For now, we'll keep the token management in the view or a small helper, but follow the API signature.

// Auth APIs
//@author Hussnain
export const register = async (userData) => {
    try {
        // Check if it's formData (for image upload)
        const isFormData = userData instanceof FormData;
        const headers = isFormData ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" };

        const res = await axios.post(`${BASE_URL}/auth/register`, userData, {
            headers: headers,
        });
        return res.data;
    } catch (e) {
        if (e.response) {
            console.error('Server responded with:', e.response.data);
            throw e.response.data;
        } else if (e.request) {
            console.error('No response received:', e.request);
            throw { message: "No response from server" };
        } else {
            console.error('Request setup error:', e.message);
            throw e;
        }
    }
};

export const login = async (credentials) => {
    try {
        const res = await axios.post(`${BASE_URL}/auth/login`, credentials, {
            timeout: 10000, // 10 second timeout
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        return res.data;
    } catch (e) {
        console.error('Error in login:', e);

        if (e.code === 'NETWORK_ERROR' || e.message === 'Network Error') {
            const networkError = new Error(
                'Unable to connect to server. Please check your internet connection and try again.',
            );
            networkError.originalError = e;
            throw networkError;
        }
        // Propagate the actual error data if available
        if (e.response && e.response.data) {
            throw e.response.data;
        }
        throw e;
    }
};


// Helper functions for Token Management (to replace authService)
export const storeSession = async (token, user) => {
    try {
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(user));
    } catch (e) {
        console.error("Error storing session", e);
    }
};

export const clearSession = async () => {
    try {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
    } catch (e) {
        console.error("Error clearing session", e);
    }
};

export const logout = async () => {
    try {
        await clearSession();
        // If there was a backend logout endpoint, we would call it here
        // await axios.post(`${BASE_URL}/auth/logout`); 
    } catch (e) {
        console.error("Error logging out", e);
    }
};

export const getCurrentUser = async () => {
    try {
        const user = await AsyncStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    } catch (e) {
        return null;
    }
};

export const getToken = async () => {
    try {
        return await AsyncStorage.getItem("token");
    } catch (e) {
        return null;
    }
};

export const getSession = async () => {
    try {
        const token = await AsyncStorage.getItem("token");
        const user = await AsyncStorage.getItem("user");
        return { token, user: user ? JSON.parse(user) : null };
    } catch (e) {
        return { token: null, user: null };
    }
};
