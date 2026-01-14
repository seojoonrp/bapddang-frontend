// src/stores/modeStore.js

import { create } from "zustand";

import Colors from "../constants/colors";

const useModeStore = create((set) => ({
  mode: "fast",
  modeColor: Colors.point_red,

  toggleMode: () =>
    set((state) => ({
      mode: state.mode === "fast" ? "slow" : "fast",
      modeColor: state.mode === "fast" ? Colors.point_green : Colors.point_red,
    })),

  setMode: (newMode) =>
    set({
      mode: newMode,
      modeColor: newMode === "fast" ? Colors.point_red : Colors.point_green,
    }),
}));

export default useModeStore;
