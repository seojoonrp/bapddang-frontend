// src/components/MainScreen/EditAndLike.js

import { TouchableOpacity, StyleSheet, View } from "react-native";
import EditIcon from "../../assets/icons/edit.svg";
import Colors from "../../constants/colors";
import useModeStore from "../../stores/modeStore";
import { useHeroAnimations } from "../../hooks/useHeroAnimations";
import Animated from "react-native-reanimated";
import HeartIcon from "../svg/HeartIcon";

const EditAndLike = ({ onEdit, onLike, scrollY, scrollThreshold }) => {
  const { modeColor } = useModeStore();

  const { editAndLikeStyle } = useHeroAnimations(scrollY, scrollThreshold);

  return (
    <Animated.View style={[styles.container, editAndLikeStyle]}>
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
    </Animated.View>
  );
};

export default EditAndLike;

const styles = StyleSheet.create({
  container: {
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
