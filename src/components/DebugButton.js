// src/components/DebugButton.js

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const DebugButton = ({ label, onPress, index = 0 }) => {
  const topPosition = 80 + index * 50;

  return (
    <TouchableOpacity
      style={[styles.button, { top: topPosition }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
};

export default DebugButton;

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    left: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    zIndex: 0,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
