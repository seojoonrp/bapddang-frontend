import React, { useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Animated } from "react-native";
import Colors from "../constants/colors";

const ModeSwitch = ({ value, onValueChange }) => {
  const moveAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(moveAnim, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const backgroundColor = moveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.point_green, "#C6341B"],
  });

  const translateX = moveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 19],
  });

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onValueChange}>
      <Animated.View style={[styles.switchTrack, { backgroundColor }]}>
        <Animated.View
          style={[styles.switchThumb, { transform: [{ translateX }] }]}
        />
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
    boxShadow: "0 2px 1px 1px rgba(82, 18, 16, 0.25) inset",
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.background_yellow,
    boxShadow: "0 2px 1px 0 rgba(82, 18, 16, 0.25)",
  },
});

export default ModeSwitch;
