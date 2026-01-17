// src/services/like.js

import api from "../api/api";

export const handleLike = async (foodID) => {
  try {
    await api.post(`/foods/${foodID}/likes`);
    console.log("Successfully liked food");
    return true;
  } catch (error) {
    throw error;
  }
};

export const handleUnlike = async (foodID) => {
  try {
    await api.delete(`/foods/${foodID}/likes`);
    console.log("Successfully unliked food");
    return true;
  } catch (error) {
    throw error;
  }
};

export const fetchLikedFoods = async () => {
  try {
    const likedFoods = await api.get("/users/me/liked-foods");
    return likedFoods || [];
  } catch (error) {
    console.error("Failed to fetch liked foods");
    throw error;
  }
};
