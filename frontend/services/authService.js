import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const authService = {
    register: async (userData) => {
        try {
            const isFormData = userData instanceof FormData;
            const headers = isFormData ? { "Content-Type": "multipart/form-data" } : {};

            const response = await api.post("/auth/register", userData, { headers });

            if (response.data.success) {
                await AsyncStorage.setItem("token", response.data.token);
                await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: error.message || "An error occurred during registration" };
        }
    },

    login: async (userData) => {
        try {
            const response = await api.post("/auth/login", userData);
            if (response.data.success) {
                await AsyncStorage.setItem("token", response.data.token);
                await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: error.message || "An error occurred during login" };
        }
    },

    logout: async () => {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
    },

    getCurrentUser: async () => {
        const user = await AsyncStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    },
};

export default authService;
