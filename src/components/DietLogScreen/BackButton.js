import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BackButton({ icon, onPress, index = 0 }) {
  const topPosition = 80 + index * 50;

  return (
    <TouchableOpacity
      style={[styles.button, { top: topPosition }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={{
          width: 52,
          height: 52,
          position: "absolute",
          top: 0,
          left: 0,
          backgroundColor: "rgba(0,0,0,0.05)",
          borderRadius: 99,
        }}
      />
      <View style={styles.iconWrap}>{icon}</View>
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
    zIndex: 0,
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
