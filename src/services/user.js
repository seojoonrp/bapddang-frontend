import api from "../api/api";

export const likeFood = async (foodID) => {
  try {
    const response = await api.post(`/foods/${foodID}/like`);
  } catch (error) {
    console.error("Error liking food:", error);
  }
};

export const unlikeFood = async (foodID) => {
  try {
    await api.delete(`/foods/${foodID}/like`);
  } catch (error) {
    console.error("Error unliking food:", error);
  }
};

export const fetchLikedFoods = async () => {
  try {
    const response = await api.get("/liked-foods");
    return response.data.likedFoods;
  } catch (error) {
    console.error("Error fetching liked foods:", error);
    return [];
  }
};
