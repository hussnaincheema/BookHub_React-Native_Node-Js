import axios from "axios";
import { Platform } from "react-native";

// Change this to your machine's IP address if testing on a real device
// For Android Emulator, use "http://10.0.2.2:3000"
// For iOS Simulator, use "http://localhost:3000"
const getBaseUrl = () => {
  if (__DEV__) {
    return "http://192.168.11.8:3000"; 
  }
  return "https://your-production-api.com";
};
const api = axios.create({
    baseURL: getBaseUrl() + "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
