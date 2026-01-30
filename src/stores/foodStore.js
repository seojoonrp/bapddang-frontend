// src/stores/foodStore.js

import { create } from "zustand";

export const useFoodStore = create((set, get) => ({
  foodsByID: {},

  mainFoodIDs: [],
  categoryFoodIDs: [],
  likedFoodIDs: [],

  setFoodsByID: (foods) => {
    const { foodsByID } = get();
    const newFoodsByID = { ...foodsByID };

    foods.forEach((f) => {
      const newItem = {
        food: f,
        isLiked: get().likedFoodIDs.includes(f.id),
      };
      newFoodsByID[f.id] = newItem;
    });

    set({ foodsByID: newFoodsByID });
  },

  setFoods: (type, data) => {
    const { foodsByID } = get();
    const newFoodsByID = { ...foodsByID };
    const newIDs = data.map((item) => {
      newFoodsByID[item.food.id] = item;
      return item.food.id;
    });

    set({
      foodsByID: newFoodsByID,
      [`${type}FoodIDs`]: newIDs,
    });
  },

  appendFoods: (type, data) => {
    const { foodsByID } = get();
    const currentIDs = get()[`${type}FoodIDs`] || [];

    const currentIDSet = new Set(currentIDs);
    const newFoodsByID = { ...foodsByID };
    const newIDs = [];

    for (const item of data) {
      const id = item.food.id;
      if (!currentIDSet.has(id)) {
        newFoodsByID[id] = item;
        newIDs.push(id);
      }
    }

    if (newIDs.length === 0) return;

    set({
      foodsByID: newFoodsByID,
      [`${type}FoodIDs`]: [...currentIDs, ...newIDs],
    });
  },

  toggleLike: (foodID) => {
    const { foodsByID, likedFoodIDs } = get();
    const target = foodsByID[foodID];
    if (!target) return;

    const newIsLiked = !target.isLiked;
    const updatedFood = {
      ...target,
      isLiked: newIsLiked,
      food: {
        ...target.food,
        likeCount: newIsLiked
          ? target.food.likeCount + 1
          : Math.max(0, target.food.likeCount - 1),
      },
    };

    let newLikedIDs = [...likedFoodIDs];
    if (newIsLiked) {
      if (!newLikedIDs.includes(foodID)) {
        newLikedIDs.push(foodID);
      }
    } else {
      newLikedIDs = newLikedIDs.filter((id) => id !== foodID);
    }

    set({
      foodsByID: { ...foodsByID, [foodID]: updatedFood },
      likedFoodIDs: newLikedIDs,
    });
  },

  setLikedFoods: (foods) => {
    if (foods.length === 0) return;

    const { foodsByID } = get();
    const newFoodsByID = { ...foodsByID };

    const uniqueInputFoods = Array.from(
      new Map(foods.map((f) => [f.id, f])).values(),
    );

    const likedIDs = uniqueInputFoods.map((food) => {
      newFoodsByID[food.id] = {
        food: food,
        isLiked: true,
      };
      return food.id;
    });

    set({
      foodsByID: newFoodsByID,
      likedFoodIDs: likedIDs,
    });
  },

  clearStore: () => {
    set({
      foodsByID: {},
      mainFoodIDs: [],
      categoryFoodIDs: [],
      likedFoodIDs: [],
    });
  },
}));
