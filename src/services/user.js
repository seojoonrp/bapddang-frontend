// src/services/food.js

import api from "../api/api";

export const syncUserWeekAndDay = async () => {
  try {
    await api.post(`/users/me/sync-day`);
    console.log("Successfully synced user week and day");
    return result;
  } catch (error) {
    throw error;
  }
};
