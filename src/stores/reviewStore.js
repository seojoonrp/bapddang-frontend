// src/stores/reviewStore.js

import { create } from "zustand";
import { fetchReviewsByDay } from "../services/review";

export const useReviewStore = create((set, get) => ({
  reviewsByDay: {},
  isLoading: false,

  getReviewsForDay: async (day) => {
    const { reviewsByDay } = get();

    if (reviewsByDay[day] !== undefined) {
      return reviewsByDay[day];
    }

    set({ isLoading: true });

    try {
      const reviews = await fetchReviewsByDay(day);
      set((state) => ({
        reviewsByDay: {
          ...state.reviewsByDay,
          [day]: reviews || [],
        },
      }));
      return reviews || [];
    } catch (error) {
      console.log("Failed to fetch reviews:", error);
      return [];
    } finally {
      set({ isLoading: false });
    }
  },

  addReviewToStore: (day, newReview) => {
    set((state) => ({
      reviewsByDay: {
        ...state.reviewsByDay,
        [day]: [newReview, ...(state.reviewsByDay[day] || [])],
      },
    }));
  },

  updateReviewInStore: (day, updatedReview) => {
    set((state) => ({
      reviewsByDay: {
        ...state.reviewsByDay,
        [day]: (state.reviewsByDay[day] || []).map((review) =>
          review.id === updatedReview.id ? updatedReview : review,
        ),
      },
    }));
  },

  deleteReviewFromStore: (day, reviewID) => {
    set((state) => ({
      reviewsByDay: {
        ...state.reviewsByDay,
        [day]: (state.reviewsByDay[day] || []).filter(
          (review) => review.id !== reviewID,
        ),
      },
    }));
  },
}));
