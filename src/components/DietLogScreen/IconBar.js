import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../../constants/colors";

const IconBar = ({ onClose }) => {
  return (
    <View style={styles.iconBar}>
      <TouchableOpacity onPress={onClose} style={styles.iconLeft}>
        <Ionicons name="arrow-back" size={18} color={Colors.icon_gray} />
        <Text style={styles.iconText}>CALENDAR</Text>
      </TouchableOpacity>
    </View>
  );
};

export default IconBar;

const styles = StyleSheet.create({
  iconBar: {
    width: "100%",
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingBottom: 10,
  },
  iconLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  iconText: {
    color: Colors.icon_gray,
    fontWeight: "bold",
    fontSize: 18,
    fontFamily: "NanumSquareEB",
  },
});
