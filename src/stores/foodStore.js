// src/stores/foodStore.js

import { create } from "zustand";

export const useFoodStore = create((set, get) => ({
  foodsByID: {},

  mainFoodIDs: [],
  categoryFoodIDs: [],
  likedFoodIDs: [],

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

    const newFoodsByID = { ...foodsByID };
    const newIDs = data
      .filter((item) => !currentIDs.includes(item.food.id))
      .map((item) => {
        newFoodsByID[item.food.id] = item;
        return item.food.id;
      });

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
    const { foodsByID } = get();
    const newFoodsByID = { ...foodsByID };

    const likedIDs = foods.map((food) => {
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
}));
