// src/services/food.js

import api from "../api/api";
import { useAuthStore } from "../stores/authStore";

export const syncUserWeekAndDay = async () => {
  try {
    const result = await api.patch("/users/me/sync");

    const user = result.updatedUser;
    useAuthStore.getState().updateUser(user);

    if (result.isNewWeek) {
      useAuthStore.getState().setLastWeekData({
        lastMarshmallow: result.lastMarshmallow,
      });

      console.log("A new week has started for the user.");
    }

    console.log("Successfully synced user week and day");
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const result = await api.patch("/users/me/password", {
      currentPassword,
      newPassword,
    });
    return result;
  } catch (error) {
    throw error;
  }
};
