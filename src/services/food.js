import api from "../api/api";

export const fetchMainFeedFoods = async ({ speed }) => {
  try {
    const response = await api.get("/foods/main-feed", {
      params: { speed, count: 4 },
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

export const fetchRankedFoods = () => {
  return []; // Temporarily disable ranking feature
};
