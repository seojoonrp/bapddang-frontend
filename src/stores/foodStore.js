// src/stores/foodStore.js

import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useFoodStore = create((set, get) => ({
  mainFeedFoods: [],

  setMainFeedFoods: async (data) => {
    set({ mainFeedFoods: data });
    await AsyncStorage.setItem("main_feed_foods", JSON.stringify(data));
  },

  appendMainFeedFoods: async (data) => {
    const currentFoods = get().mainFeedFoods;

    const uniqueNewFoods = data.filter(
      (newFood) =>
        !currentFoods.some(
          (existingFood) => existingFood.food.id === newFood.food.id,
        ),
    );
    if (uniqueNewFoods.length === 0) return;

    if (uniqueNewFoods.length < data.length) {
      console.log("Duplicate foods detected. Removing...");
    }

    const updatedFoods = [...currentFoods, ...uniqueNewFoods];
    set({ mainFeedFoods: updatedFoods });
    await AsyncStorage.setItem("main_feed_foods", JSON.stringify(updatedFoods));
  },

  toggleLike: async (foodID) => {
    const currentFoods = get().mainFeedFoods;
    const updatedFoods = currentFoods.map((foodItem) => {
      if (foodItem.food.id === foodID) {
        const newIsLiked = !foodItem.isLiked;
        return {
          ...foodItem,
          isLiked: newIsLiked,
          food: {
            ...foodItem.food,
            likeCount: newIsLiked
              ? foodItem.food.likeCount + 1
              : Math.max(0, foodItem.food.likeCount - 1),
          },
        };
      }
      return foodItem;
    });

    set({ mainFeedFoods: updatedFoods });
    await AsyncStorage.setItem("main_feed_foods", JSON.stringify(updatedFoods));
  },

  loadPersistedData: async () => {
    try {
      const foodsData = await AsyncStorage.getItem("main_feed_foods");

      if (foodsData) {
        const parsedFoods = JSON.parse(foodsData);
        set({ mainFeedFoods: parsedFoods });
        return true;
      }
    } catch (error) {
      console.error("Failed to load persisted food data:", error);
    }
    return false;
  },

  clearData: async () => {
    await AsyncStorage.removeItem("main_feed_foods");
    set({ mainFeedFoods: [] });
  },
}));

export default useFoodStore;
