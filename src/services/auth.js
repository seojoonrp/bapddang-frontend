// src/services/auth.js

import * as AppleAuthentication from "expo-apple-authentication";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { login, logout as kakaoLogout } from "@react-native-seoul/kakao-login";

import {
  loginWithAppleApi,
  loginWithGoogleApi,
  loginWithKakaoApi,
} from "../api/auth";

import {
  EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
} from "@env";

import useAuthStore from "../stores/authStore";

export const initGoogleLogin = () => {
  GoogleSignin.configure({
    webClientId: EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  });
};

export const handleGoogleLogin = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const { data } = await GoogleSignin.signIn();

    const result = await loginWithGoogleApi(data.idToken);

    if (result.accessToken) {
      await useAuthStore.getState().setLogin(result.user, result.accessToken);

      console.log("Google Login Success:", result.user.email);
      console.log("Token:", result.accessToken);
      return true;
    }

    return false;
  } catch (error) {
    console.log("Google Login Service Error:", error);
    throw error;
  }
};

export const handleKakaoLogin = async () => {
  try {
    const token = await login();

    const result = await loginWithKakaoApi(token.accessToken);

    if (result.accessToken) {
      await useAuthStore.getState().setLogin(result.user, result.accessToken);

      console.log("Kakao Login Success:");
      console.log("Token:", result.accessToken);
      return true;
    }

    return false;
  } catch (error) {
    console.log("Kakao Login Service Error:", error);
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

    const result = await loginWithAppleApi(
      credential.identityToken,
      credential.fullName
    );

    if (result.accessToken) {
      await useAuthStore.getState().setLogin(result.user, result.accessToken);
      console.log("Apple Login Success:", result.user.email);
      console.log("Token:", result.accessToken);
      return true;
    }

    return false;
  } catch (error) {
    if (error.code === "ERR_REQUEST_CANCELED") {
      console.log("Apple Login Canceled by User");
      return false;
    }
    console.log("Apple Login Service Error:", error);
    throw error;
  }
};

export const handleLogout = async () => {
  try {
    const user = useAuthStore.getState().user;
    const loginMethod = user?.loginMethod;

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
