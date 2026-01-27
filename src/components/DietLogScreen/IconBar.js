import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import ChevronIcon from "../../assets/icons/chevron.svg";
import Colors from "../../constants/colors";

const IconBar = ({ onClose }) => {
  return (
    <View style={styles.iconBar}>
      <TouchableOpacity onPress={onClose} style={styles.iconLeft}>
        <ChevronIcon width={24} height={24} color={Colors.icon_gray} />
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
  },
  iconText: {
    color: Colors.icon_gray,
    fontSize: 17,
    fontFamily: "NanumSquareB",
    marginTop: 1.5,
  },
});
