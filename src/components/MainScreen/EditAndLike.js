// src/components/MainScreen/EditAndLike.js

import { TouchableOpacity, StyleSheet, View } from "react-native";
import EditIcon from "../../assets/icons/edit.svg";
import Colors from "../../constants/colors";
import { useModeStore } from "../../stores/modeStore";
import HeartIcon from "../svg/HeartIcon";

const EditAndLike = ({ onEdit, onLike }) => {
  const { modeColor } = useModeStore();

  return (
    <View style={[styles.container]}>
      <TouchableOpacity
        onPress={onEdit}
        style={[styles.button, { backgroundColor: modeColor }]}
        activeOpacity={0.7}
      >
        <EditIcon width={24} height={24} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onLike}
        style={[styles.button, { backgroundColor: modeColor }]}
        activeOpacity={0.7}
      >
        <HeartIcon size={24} fillColor={Colors.background_white} />
      </TouchableOpacity>
    </View>
  );
};

export default EditAndLike;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 10,
    right: 12,
    flexDirection: "row",
    gap: 6,
  },
  button: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderColor: Colors.background_white,
    borderWidth: 1,
    borderRadius: 20,
  },
});
