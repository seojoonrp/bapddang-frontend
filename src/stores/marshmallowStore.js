// src/stores/marshmallowStore.js

import { create } from "zustand";
import { fetchMarshmallows } from "../services/marshmallow";

export const useMarshmallowStore = create((set) => ({
  marshmallows: [],
  isLoading: false,

  fetchMarshmallowsFromStore: async () => {
    set({ isLoading: true });

    try {
      const data = await fetchMarshmallows();

      const sorted = [...(data ?? [])].sort((a, b) => {
        const aw = Number(a.week ?? a.weekIndex ?? a.weekNumber ?? NaN);
        const bw = Number(b.week ?? b.weekIndex ?? b.weekNumber ?? NaN);
        if (Number.isFinite(aw) && Number.isFinite(bw)) return bw - aw;
        return Number(b.id) - Number(a.id);
      });

      set({ marshmallows: sorted });
    } catch (e) {
      console.log("Error fetching marshmallows:", e);
    } finally {
      set({ isLoading: false });
    }
  },

  clearStore: () => {
    set({ marshmallows: [] });
  },
}));
