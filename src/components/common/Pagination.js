// src/components/common/Pagination.js

import { memo } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import Colors from "../../constants/colors";
import { MAIN_LAYOUT } from "../../constants/layout";

const DOT_SIZE = 8;
const DOT_MARGIN = 2;
const DOT_WIDTH = DOT_SIZE + DOT_MARGIN * 2;

const Pagination = ({ total, scrollX, cardSize }) => {
  const animatedContainerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      scrollX.value,
      [0, cardSize * 2, cardSize * (total - 3), cardSize * (total - 1)],
      [0, 0, -(total - 5) * DOT_WIDTH, -(total - 5) * DOT_WIDTH],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ translateX }],
    };
  });

  return (
    <View style={styles.viewPort}>
      <Animated.View style={[styles.container, animatedContainerStyle]}>
        {Array.from({ length: total }).map((_, i) => (
          <Dot key={i} index={i} scrollX={scrollX} cardSize={cardSize} />
        ))}
      </Animated.View>
    </View>
  );
};

const Dot = memo(({ index, scrollX, cardSize }) => {
  const animatedDotStyle = useAnimatedStyle(() => {
    const centerPos = index * cardSize;

    const scale = interpolate(
      scrollX.value,
      [
        centerPos - cardSize * 3,
        centerPos - cardSize * 2,
        centerPos - cardSize,
        centerPos,
        centerPos + cardSize,
        centerPos + cardSize * 2,
        centerPos + cardSize * 3,
      ],
      [0.3, 0.6, 0.9, 1, 0.9, 0.6, 0.3],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      scrollX.value,
      [
        centerPos - cardSize * 2,
        centerPos - cardSize,
        centerPos,
        centerPos + cardSize,
        centerPos + cardSize * 2,
      ],
      [0.15, 0.25, 1, 0.25, 0.15],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return <Animated.View style={[styles.dot, animatedDotStyle]} />;
});

const styles = StyleSheet.create({
  viewPort: {
    width: DOT_WIDTH * 5,
    overflow: "hidden",
    height: DOT_WIDTH,
    justifyContent: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: Colors.burn,
    marginHorizontal: DOT_MARGIN,
  },
});

export default Pagination;
