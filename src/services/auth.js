// src/services/auth.js

import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";

export const fetchMyInfo = async () => {
  try {
    const token = await AsyncStorage.getItem("jwt_token");
    if (!token) return null;

    const response = await api.get("/auth/me");

    if (response.status === 200) {
      return response.data;
    }

    return null;
  } catch (error) {
    console.log("세션 검증 실패:", error.message);
    await AsyncStorage.removeItem("jwt_token");
    return null;
  }
};
