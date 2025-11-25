import api from "../api/api";

export const createReview = async ({
  name,
  foods,
  speed,
  mealTime,
  tags,
  imageUrl,
  comment,
  rating,
}) => {
  try {
    const response = await api.post("/reviews", {
      name,
      foods,
      speed,
      mealTime,
      tags,
      imageUrl,
      comment,
      rating,
    });

    return response.data;
  } catch (error) {
    console.log("🔴 createReview error status:", error.response?.status);
  console.log(
    "🔴 createReview error data:",
    JSON.stringify(error.response?.data, null, 2)
  );
  throw error;
  }
};

export const editReview = async (reviewId, updatedData) => {};

export const fetchReviewsByDay = async (day) => {
  try {
    const response = await api.get("/reviews/me", {
      params: { day },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching reviews by day:", error);
    return [];
  }
};
