import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { EXPO_PUBLIC_API_BASE_URL } from "@env";

const api = axios.create({
  // baseURL: EXPO_PUBLIC_API_BASE_URL,
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
    return Promise.reject(error);
  }
);

export default api;
