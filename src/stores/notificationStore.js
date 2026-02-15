// src/stores/notificationStore.js

import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  newMarshmallow: true,

  addNotification: (notification) => {
    set((state) => ({
      notifications: [...state.notifications, notification],
    }));
  },

  toggleNewMarshmallow: async () => {
    set((state) => ({
      newMarshmallow: !state.newMarshmallow,
    }));
    await AsyncStorage.setItem(
      "newMarshmallow",
      JSON.stringify(!state.newMarshmallow),
    );
  },
}));
