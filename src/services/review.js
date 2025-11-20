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
    console.error("Error creating review:", error);
    return null;
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
