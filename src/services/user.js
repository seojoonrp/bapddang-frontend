import api from "../api/api";

export const likeFood = async (foodID) => {
  try {
    await api.post(`/foods/${foodID}/likes`);

    console.log("Successfully liked food");
  } catch (error) {
    console.error("Error liking food:", error);
  }
};

export const unlikeFood = async (foodID) => {
  try {
    await api.delete(`/foods/${foodID}/likes`);

    console.log("Successfully unliked food");
  } catch (error) {
    console.error("Error unliking food:", error);
  }
};

export const fetchLikedFoods = async () => {
  try {
    const response = await api.get("/users/me/liked-foods");
    return response.data;
  } catch (error) {
    console.error("Error fetching liked foods:", error);
    return [];
  }
};
