// src/components/DebugButton.tsx

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DebugButton({ icon, onPress, index = 0 }) {
  const topPosition = 80 + index * 50;

  return (
    <TouchableOpacity
      style={[styles.button, { top: topPosition }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={ styles.iconWrap }>{icon}</View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    left: 20,
    width: 52,
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 8,
    zIndex: 9999,
  },
  iconWrap: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
