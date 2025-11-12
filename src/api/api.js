import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_BASE_URL } from "@env";

const api = axios.create({
  baseURL: API_BASE_URL,
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
