import api from "../api/api";

export const createReview = async ({
  name,
  foods,
  speed,
  mealTime,
  tags,
  imageURL,
  comment,
  rating,
}) => {
  try {
    const response = await api.post("/reviews", {
      name: name,
      foods: foods,
      speed: speed,
      mealTime: mealTime,
      tags: tags,
      imageURL: imageURL,
      comment: comment,
      rating: rating,
    });

    return response.data;
  } catch (error) {
    console.error("Failed to create review:", error);
    throw error;
  }
};

export const editReview = async (reviewId, updatedData) => {};

export const fetchReviewsByDay = async (day) => {
  try {
    const response = await api.get("/users/me/reviews", {
      params: { day },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch reviews by day:", error);
    return [];
  }
};
