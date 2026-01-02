// src/api/auth.js

import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchMyInfoApi = async () => {
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

export const loginApi = async (username, password) => {
  const response = await api.post("/auth/login", {
    username: username,
    password: password,
  });

  return response.data;
};

export const loginWithGoogleApi = async (idToken) => {
  const response = await api.post("/auth/google", {
    idToken: idToken,
  });

  return response.data;
};

export const loginWithKakaoApi = async (accessToken) => {
  const response = await api.post("/auth/kakao", {
    accessToken: accessToken,
  });

  return response.data;
};

export const loginWithAppleApi = async (identityToken, fullName) => {
  const response = await api.post("/auth/apple", {
    identityToken: identityToken,
    fullName: fullName, // { givenName, familyName }
  });

  return response.data;
};
