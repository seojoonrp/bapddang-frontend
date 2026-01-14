// src/services/food.js

import api from "../api/api";

export const fetchMainFeedFoods = async ({ speed, count }) => {
  try {
    const response = await api.get("/foods/main-feed", {
      params: { speed, count },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching main feed foods:", error);
    return [];
  }
};

export const fetchFoodById = async (foodId) => {
  try {
    const response = await api.get(`/foods/${foodId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching food by ID:", error);
    return null;
  }
};

export const fetchFoodItemsByNames = async (foodNames) => {
  try {
    const response = await api.post("/foods/resolve", {
      names: foodNames,
    });

    return response.data;
  } catch (error) {
    console.log("Failed to fetch food items by names:", error);
    throw error;
  }
};

export const fetchRankedFoods = () => {
  return []; // Temporarily disable ranking feature
};
