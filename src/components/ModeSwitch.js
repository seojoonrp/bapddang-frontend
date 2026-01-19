import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  interpolateColor,
} from "react-native-reanimated";
import Colors from "../constants/colors";

const ModeSwitch = ({ value, onValueChange }) => {
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: 200 });
  }, [value]);

  const animatedTrackStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [Colors.point_green, "#C6341B"],
    );
    return { backgroundColor };
  });

  const animatedThumbStyle = useAnimatedStyle(() => {
    const translateX = interpolate(progress.value, [0, 1], [1, 19]);
    return { transform: [{ translateX }] };
  });

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onValueChange}>
      <Animated.View style={[styles.switchTrack, animatedTrackStyle]}>
        <Animated.View style={[styles.switchThumb, animatedThumbStyle]} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switchTrack: {
    width: 45,
    height: 28,
    borderRadius: 14,
    padding: 1,
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.background_yellow,
    shadowColor: "rgba(82, 18, 16, 0.25)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.background_yellow,
    shadowColor: "rgba(82, 18, 16, 0.25)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
});

export default ModeSwitch;
