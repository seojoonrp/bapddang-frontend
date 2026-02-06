// src/stores/authStore.js

import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoggedIn: false,
  lastWeekData: null,

  setLogin: async (userData, token) => {
    await AsyncStorage.setItem("jwt_token", token);
    set({
      user: userData,
      token: token,
      isLoggedIn: true,
    });
  },

  setLogout: async () => {
    await AsyncStorage.removeItem("jwt_token");
    set({
      user: null,
      token: null,
      isLoggedIn: false,
    });
  },

  updateUser: (userData) => {
    set({ user: userData });
  },

  setLastWeekData: (weekData) => {
    set({ lastWeekData: weekData });
  },

  clearLastWeekData: () => {
    set({ lastWeekData: null });
  },
}));
