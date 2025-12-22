// src/services/auth.js

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { loginWithGoogleApi } from "../api/auth";

import useAuthStore from "../stores/authStore";

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
      await useAuthStore.getState().setLogin(result.user, result.accessToken);
    }

    console.log("Google Login Success:", result.user.email);
    console.log("Token:", result.accessToken);
    return true;
  } catch (error) {
    console.log("Google Login Service Error:", error);
    throw error;
  }
};

export const handleLogout = async () => {
  try {
    await GoogleSignin.signOut();
    await useAuthStore.getState().setLogout();

    console.log("Logout Success");
  } catch (error) {
    console.log("Logout Service Error:", error);
    throw error;
  }
};
