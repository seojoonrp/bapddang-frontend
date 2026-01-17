// src/services/review.js

import api from "../api/api";

export const createReview = async (reviewData) => {
  try {
    const result = await api.post("/reviews", reviewData);
    console.log("Review created successfully");
    return result;
  } catch (error) {
    throw error;
  }
};

export const updateReview = async (reviewId, updatedData) => {
  try {
    const result = await api.patch(`/reviews/${reviewId}`, updatedData);
    console.log("Review updated successfully");
    return result;
  } catch (error) {
    throw error;
  }
};

export const fetchReviewsByDay = async (day) => {
  try {
    const reviews = await api.get("/users/me/reviews", {
      params: { day },
    });
    console.log(
      `Successfully fetched ${reviews.length} reviews on day ${day}.`,
    );
    return reviews || [];
  } catch (error) {
    throw error;
  }
};
