// src/hooks/useHeroAnimations.js

import {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import useModeStore from "../stores/modeStore";
import { useMainLayout } from "./useMainLayout";
import { MAIN_LAYOUT } from "../constants/layout";

const HORIZONTAL_PADDING = 12;

export const useHeroAnimations = (scrollY, scrollThreshold) => {
  const { screenWidth, insets, headerHeight, heroHeight } = useMainLayout();
  const { modeColor } = useModeStore();

  const containerStyle = useAnimatedStyle(() => {
    return {
      height: heroHeight,
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, scrollThreshold],
            [headerHeight + MAIN_LAYOUT.HEADER_HERO_GAP, 0],
            Extrapolation.CLAMP,
          ),
        },
      ],
      left: interpolate(
        scrollY.value,
        [0, scrollThreshold],
        [HORIZONTAL_PADDING, 0],
        Extrapolation.CLAMP,
      ),
      width: interpolate(
        scrollY.value,
        [0, scrollThreshold],
        [screenWidth - HORIZONTAL_PADDING * 2, screenWidth],
        Extrapolation.CLAMP,
      ),
      paddingHorizontal: interpolate(
        scrollY.value,
        [0, scrollThreshold],
        [14, 10 + HORIZONTAL_PADDING],
        Extrapolation.CLAMP,
      ),
      paddingTop: interpolate(
        scrollY.value,
        [0, scrollThreshold],
        [14, insets.top + 10],
        Extrapolation.CLAMP,
      ),
      borderRadius: interpolate(
        scrollY.value,
        [scrollThreshold * 0.7, scrollThreshold],
        [24, 0],
        Extrapolation.CLAMP,
      ),
      backgroundColor: modeColor,
    };
  });

  const textStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, scrollThreshold],
          [0, -20],
          Extrapolation.CLAMP,
        ),
      },
    ],
    opacity: interpolate(
      scrollY.value,
      [0, scrollThreshold * 0.8],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  const editAndLikeStyle = useAnimatedStyle(() => ({
    position: "absolute",
    right: HORIZONTAL_PADDING + 14,
    top: headerHeight + MAIN_LAYOUT.HEADER_HERO_GAP + heroHeight - 40 - 12,
    zIndex: 9999,
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, scrollThreshold],
          [0, -heroHeight + 40 + 8],
          Extrapolation.CLAMP,
        ),
      },
      {
        translateX: interpolate(
          scrollY.value,
          [0, scrollThreshold],
          [0, HORIZONTAL_PADDING],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  return {
    containerStyle,
    textStyle,
    editAndLikeStyle,
  };
};
