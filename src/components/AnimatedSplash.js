import { useEffect } from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import Colors from "../constants/colors";
import AppLogo from "../assets/images/logo.svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const AnimatedSplash = ({ isReady, onAnimationComplete }) => {
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (isReady) {
      translateX.value = withTiming(
        -SCREEN_WIDTH,
        {
          duration: 500,
          easing: Easing.out(Easing.cubic),
        },
        (finished) => {
          if (finished && onAnimationComplete) {
            runOnJS(onAnimationComplete)();
          }
        },
      );
    }
  }, [isReady]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <AppLogo width={122} height={211} color={Colors.point_red} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background_white,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});

export default AnimatedSplash;
