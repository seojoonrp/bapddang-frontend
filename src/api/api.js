import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  // 배포 서버
  // baseURL: "https://43.201.22.91.sslip.io/api/v1",

  // 로컬 서버 (ngrok)
  baseURL: "http://172.30.1.28:8080/api/v1",

  timeout: 10000,
});

// JWT 토큰 자동 삽입
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
  },
);

// 응답 구조 처리
api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success) {
      return response.data.data;
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const { method, url } = error.config;
      const errorDetail = error.response.data.error;

      console.log("===== [API ERROR] =====");
      console.log("Endpoint:", `${method.toUpperCase()} ${url}`);
      console.log("Status  :", error.response.status);
      if (errorDetail) {
        console.log("Code    :", errorDetail.code);
        console.log("Message :", errorDetail.message);
      }
      console.log("=======================");
    } else {
      console.log("===== [NETWORK ERROR] =====");
      console.log("Message:", error.message);
      console.log("===========================");
    }

    return Promise.reject(error);
  },
);

export default api;
