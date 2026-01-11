import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { EXPO_PUBLIC_API_BASE_URL } from "@env";

const api = axios.create({
  // baseURL: "https://43.201.22.91.sslip.io/api/v1",
  baseURL: "https://nontheological-unpostered-addyson.ngrok-free.dev/api/v1",
  headers: {
    "ngrok-skip-browser-warning": "69420",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("jwt_token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.log("===== [API Response Error] =====");
      console.log("Status:", error.response.status);
      console.log("Data  :", error.response.data.error);
    } else if (error.request) {
      console.log("===== [No Response Received] =====");
      console.log(error.request);
    } else {
      console.log("===== [Request Setup Error] =====");
      console.log("Error Message:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
