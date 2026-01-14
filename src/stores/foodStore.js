// src/stores/foodStore.js

import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useFoodStore = create((set, get) => ({
  mainFeedFoods: [],
  currentIndex: 0,

  setMainFeedFoodData: async (data, index = 0) => {
    set({ mainFeedFoods: data, currentIndex: index });
    await AsyncStorage.setItem("main_feed_foods", JSON.stringify(data));
    await AsyncStorage.setItem("main_feed_current_index", index.toString());
  },

  appendMainFeedFoodData: async (data) => {
    const currentFoods = get().mainFeedFoods;

    const uniqueNewFoods = data.filter(
      (newFood) =>
        !currentFoods.some((existingFood) => existingFood.id === newFood.id)
    );
    if (uniqueNewFoods.length === 0) return;

    if (uniqueNewFoods.length < data.length) {
      console.log("Duplicate foods detected. Removing...");
    }

    const updatedFoods = [...currentFoods, ...uniqueNewFoods];
    set({ mainFeedFoods: updatedFoods });
    await AsyncStorage.setItem("main_feed_foods", JSON.stringify(updatedFoods));
  },

  updateIndex: async (index) => {
    set({ currentIndex: index });
    await AsyncStorage.setItem("main_feed_current_index", index.toString());
  },

  loadPersistedData: async () => {
    try {
      const foodsData = await AsyncStorage.getItem("main_feed_foods");
      const indexData = await AsyncStorage.getItem("main_feed_current_index");

      if (foodsData) {
        const parsedFoods = JSON.parse(foodsData);
        const parsedIndex = indexData ? parseInt(indexData, 10) : 0;
        set({ mainFeedFoods: parsedFoods, currentIndex: parsedIndex });
        return true;
      }
    } catch (error) {
      console.error("Failed to load persisted food data:", error);
    }
    return false;
  },

  clearData: async () => {
    await AsyncStorage.removeItem("main_feed_foods");
    await AsyncStorage.removeItem("main_feed_current_index");
    set({ mainFeedFoods: [], currentIndex: 0 });
  },
}));

export default useFoodStore;
