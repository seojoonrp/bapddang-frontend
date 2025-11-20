import api from "../api/api";

export const fetchMainFeedFoods = async ({ type, speed }) => {
  try {
    const response = await api.get("/foods/main-feed", {
      params: { type, speed, count: 3 },
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
export const validateFoods = async (names) => {
  try {
    const res= await api.post("/foods/validate", {names});
    return res.data.results ?? [];
  }
  catch (error) {
    console.error("Error validating foods:", error);
    throw error;
  }
};
export const fetchRankedFoods = () => {
  return []; // Temporarily disable ranking feature
};
