// src/components/MainScreen/Pagination.js
import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import Colors from "../../constants/colors";

const DOT_SIZE = 8;
const DOT_MARGIN = 2;
const DOT_WIDTH = DOT_SIZE + DOT_MARGIN * 2;

const Pagination = ({ total, scrollX, cardSize }) => {
  const translateX = scrollX.interpolate({
    inputRange: [
      0,
      cardSize * 2,
      cardSize * (total - 3),
      cardSize * (total - 1),
    ],
    outputRange: [0, 0, -(total - 5) * DOT_WIDTH, -(total - 5) * DOT_WIDTH],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.viewPort}>
      <Animated.View
        style={[styles.container, { transform: [{ translateX }] }]}
      >
        {Array.from({ length: total }).map((_, i) => {
          const centerPos = i * cardSize;

          const scale = scrollX.interpolate({
            inputRange: [
              centerPos - cardSize * 3,
              centerPos - cardSize * 2,
              centerPos - cardSize,
              centerPos,
              centerPos + cardSize,
              centerPos + cardSize * 2,
              centerPos + cardSize * 3,
            ],
            outputRange: [0.3, 0.6, 0.9, 1, 0.9, 0.6, 0.3],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange: [
              centerPos - cardSize * 2,
              centerPos - cardSize,
              centerPos,
              centerPos + cardSize,
              centerPos + cardSize * 2,
            ],
            outputRange: [0.15, 0.25, 1, 0.25, 0.15],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  transform: [{ scale }],
                  opacity,
                },
              ]}
            />
          );
        })}
      </Animated.View>
    </View>
  );
};

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
