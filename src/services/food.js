// src/services/food.js

import api from "../api/api";

export const fetchMainFoods = async ({ speed, count }) => {
  try {
    const result = await api.get("/foods/main-feed", {
      params: { speed, count },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const fetchCategoryFoods = async ({ categories, speed, count }) => {
  try {
    const result = await api.get("/foods/", {
      params: { category: categories, speed, count },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const fetchFoodById = async (foodId) => {
  try {
    const food = await api.get(`/foods/${foodId}`);
    return food;
  } catch (error) {
    throw error;
  }
};

export const fetchFoodItemsByNames = async (foodNames) => {
  try {
    const res = await api.post("/foods/resolve", {
      names: foodNames,
    });
    return res;
  } catch (error) {
    throw error;
  }
};
