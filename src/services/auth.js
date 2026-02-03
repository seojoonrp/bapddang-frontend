// src/services/auth.js

import * as AppleAuthentication from "expo-apple-authentication";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  login as kakaoLogin,
  logout as kakaoLogout,
} from "@react-native-seoul/kakao-login";
import api from "../api/api";
import {
  EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
} from "@env";
import { syncUserWeekAndDay } from "./user";
import { useAuthStore } from "../stores/authStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFoodStore } from "../stores/foodStore";

export const checkUsernameAvailability = async (username) => {
  try {
    const result = await api.get("/auth/check-username", {
      params: { username },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const handleLoginSession = async () => {
  try {
    const token = await AsyncStorage.getItem("jwt_token");
    if (!token) {
      console.log("No stored token found.");
      return false;
    }

    const user = await api.get("/users/me");

    if (user) {
      await useAuthStore.getState().setLogin(user, token);
      await syncUserWeekAndDay();
      console.log("Session restored for:", user.email || user.username);
      return true;
    }

    return false;
  } catch (error) {
    console.log("Failed to restore login session:", error);
    await useAuthStore.getState().setLogout();
    return false;
  }
};

const processAuthResult = async (result, method) => {
  if (result && result.accessToken) {
    await useAuthStore.getState().setLogin(result.user, result.accessToken);
    await syncUserWeekAndDay();
    console.log(
      `${method} Login Success:`,
      result.user.email || result.user.username,
    );
    console.log("Token:", result.accessToken);
    return true;
  }
  return false;
};

export const handleSignUp = async (username, password) => {
  try {
    await api.post("/auth/signup", { username, password });
    return true;
  } catch (error) {
    throw error;
  }
};

export const handleLocalLogin = async (username, password) => {
  try {
    const result = await api.post("/auth/login", { username, password });
    return await processAuthResult(result, "Local");
  } catch (error) {
    throw error;
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

    const result = await api.post("/auth/google", { idToken: data.idToken });
    return await processAuthResult(result, "Google");
  } catch (error) {
    throw error;
  }
};

export const handleKakaoLogin = async () => {
  try {
    const token = await kakaoLogin();

    const result = await api.post("/auth/kakao", {
      accessToken: token.accessToken,
    });
    return await processAuthResult(result, "Kakao");
  } catch (error) {
    throw error;
  }
};

export const handleAppleLogin = async () => {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    const result = await api.post("/auth/apple", {
      identityToken: credential.identityToken,
      authorizationCode: credential.authorizationCode,
    });
    return await processAuthResult(result, "Apple");
  } catch (error) {
    if (error.code === "ERR_REQUEST_CANCELED") {
      console.log("Apple Login Canceled by User");
      return false;
    }

    throw error;
  }
};

export const handleLogout = async () => {
  try {
    const user = useAuthStore.getState().user;
    const loginMethod = user?.loginMethod;
    await useFoodStore.getState().clearStore();

    if (loginMethod === "google") {
      await GoogleSignin.signOut();
    } else if (loginMethod === "kakao") {
      await kakaoLogout();
    }

    await useAuthStore.getState().setLogout();
    console.log(`Logout Success (${loginMethod})`);
  } catch (error) {
    console.log("Logout Service Error:", error);
    await useAuthStore.getState().setLogout();
    throw error;
  }
};
