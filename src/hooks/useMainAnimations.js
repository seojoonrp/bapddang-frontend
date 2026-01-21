// src/hooks/useMainAnimations.js

import {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  interpolateColor,
  withSpring,
  Extrapolation,
} from "react-native-reanimated";
import { Gesture } from "react-native-gesture-handler";
import Colors from "../constants/colors";
import { MAIN_LAYOUT } from "../constants/layout";

export const useMainAnimations = (scrollThreshold, headerHeight) => {
  const scrollY = useSharedValue(0);
  const startY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startY.value = scrollY.value;
    })
    .onUpdate((e) => {
      const newValue = startY.value - e.translationY;
      scrollY.value = Math.max(0, Math.min(newValue, scrollThreshold));
    })
    .onEnd((e) => {
      const velocity = -e.velocityY;
      let toValue = 0;
      if (
        velocity > 500 ||
        (scrollY.value > scrollThreshold / 2 && velocity > -500)
      ) {
        toValue = scrollThreshold;
      }
      scrollY.value = withSpring(toValue, {
        damping: 20,
        stiffness: 90,
        mass: 1,
        overshootClamping: true,
      });
    });

  const animatedLogoStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      scrollY.value,
      [0, scrollThreshold],
      [Colors.point_red, Colors.yellow],
    ),
  }));

  const animatedIconOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, scrollThreshold],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const animatedHeaderLineStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, scrollThreshold * 0.25],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  const animatedHeroStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, scrollThreshold],
          [0, -(headerHeight + MAIN_LAYOUT.HEADER_HERO_GAP)],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const animatedBottomSheetStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, scrollThreshold],
          [scrollThreshold, 0],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const animatedCircleStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      scrollY.value,
      [0, scrollThreshold],
      [Colors.point_red, Colors.yellow],
    ),
  }));

  return {
    scrollY,
    panGesture,
    animatedStyles: {
      logo: animatedLogoStyle,
      iconOverlay: animatedIconOverlayStyle,
      headerLine: animatedHeaderLineStyle,
      hero: animatedHeroStyle,
      bottomSheet: animatedBottomSheetStyle,
      circle: animatedCircleStyle,
    },
  };
};
