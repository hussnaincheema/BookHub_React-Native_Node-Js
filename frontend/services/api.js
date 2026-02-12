import axios from "axios";
import { Platform } from "react-native";

// Change this to your machine's IP address if testing on a real device
// For Android Emulator, use "http://10.0.2.2:5000"
// For iOS Simulator, use "http://localhost:5000"
const BASE_URL = Platform.OS === "android" ? "http://10.0.2.2:5000" : "http://localhost:5000";

const api = axios.create({
    baseURL: BASE_URL + "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
