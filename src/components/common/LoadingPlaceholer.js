// src/components/common/LoadingPlaceholer.js

import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/colors";

const LoadingPlaceholer = ({
  color = Colors.point_red,
  text = "Loading...",
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={color} />
      <Text style={[styles.text, { marginTop: 8, color: color }]}>{text}</Text>
    </View>
  );
};

export default LoadingPlaceholer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  text: {
    fontSize: 14,
    fontFamily: "NanumSquareRoundB",
    letterSpacing: -0.3,
  },
});
