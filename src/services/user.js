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
    const response = await api.get("/liked-foods"); //백엔드에서 rerturn 형식 수정하면 다시 고치기 배열 형태로 바꿔서 보내줘야될듯
    return response.data;
  } catch (error) {
    console.error("Error fetching liked foods:", error);
    return [];
  }
};
