// src/services/auth.js

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginWithGoogleApi } from "../api/auth";

import api from "../api/api";
import useAuthStore from "../stores/authStore";

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

export const initGoogleLogin = () => {
  GoogleSignin.configure({
    webClientId:
      "636208679388-b89kfh97065p2pg8furebbge59kcun3h.apps.googleusercontent.com",
    iosClientId:
      "636208679388-4aa1ldr2j227cgki5oh5a3f2o9qqb9ip.apps.googleusercontent.com",
  });
};

export const handleGoogleLogin = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const { data } = await GoogleSignin.signIn();

    const result = await loginWithGoogleApi(data.idToken);

    if (result.accessToken) {
      await AsyncStorage.setItem("jwt_token", result.accessToken);
      await useAuthStore.getState().setLogin(result.user, result.accessToken);
    }

    console.log("Google Login Success:", result.user.email);
    return true;
  } catch (error) {
    console.log("Google Login Service Error:", error);
    throw error;
  }
};
