// src/stores/modeStore.js

import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Colors from "../constants/colors";

const useModeStore = create((set, get) => ({
  mode: "fast",
  modeColor: Colors.point_red,

  toggleMode: async () => {
    const currentMode = get().mode;
    const newMode = currentMode === "fast" ? "slow" : "fast";
    const newModeColor =
      newMode === "fast" ? Colors.point_red : Colors.point_green;
    set({
      mode: newMode,
      modeColor: newModeColor,
    });
    await AsyncStorage.setItem("mode", newMode);
    await AsyncStorage.setItem("modeColor", newModeColor);
  },

  setMode: async (newMode) => {
    const newModeColor =
      newMode === "fast" ? Colors.point_red : Colors.point_green;
    set({
      mode: newMode,
      modeColor: newModeColor,
    });
    await AsyncStorage.setItem("mode", newMode);
    await AsyncStorage.setItem("modeColor", newModeColor);
  },
}));

export default useModeStore;
