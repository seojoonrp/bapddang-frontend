// src/services/food.js

import api from "../api/api";

export const syncUserWeekAndDay = async () => {
  try {
    const result = await api.patch("/users/me/sync-day");
    console.log("Successfully synced user week and day");
    return true;
  } catch (error) {
    console.log("FULL URL:", error?.config?.baseURL + error?.config?.url);
    throw error;
  }
};
