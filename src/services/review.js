import api from "../api/api";

export const createReview = async ({
  name,
  foods,
  speed,
  mealTime,
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
      imageURL: imageURL,
      comment: comment,
      rating: rating,
    });

    console.log("Review created successfully:", response.data.review);
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

    const reviews = response.data?.reviews ?? [];

    console.log(
      `Successfully fetched ${reviews.length} reviews on day ${day}.`
    );

    return reviews;
  } catch (error) {
    console.error("Failed to fetch reviews by day:", error);
    return [];
  }
};
