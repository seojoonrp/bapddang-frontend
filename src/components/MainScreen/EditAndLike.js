// src/components/MainScreen/EditAndLike.js

import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import EditIcon from "../../assets/icons/edit.svg";
import Colors from "../../constants/colors";
import { useModeStore } from "../../stores/modeStore";
import HeartIcon from "../svg/HeartIcon";
import TextBubble from "../../assets/images/textbubble-main.svg";
import { useHeroAnimations } from "../../hooks/useHeroAnimations";
import Animated, {
  useAnimatedStyle,
  withSpring,
  ZoomInUp,
  ZoomOutUp,
} from "react-native-reanimated";

const BUBBLE_HEIGHT = 32.5;

const EditAndLike = ({ onEdit, onLike, animatedStyle, showTextBubble }) => {
  const { modeColor } = useModeStore();

  const dashedLineAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withSpring(1 - showTextBubble.value),
  }));

  const bubbleAnimatedStyle = useAnimatedStyle(() => {
    const scale = withSpring(showTextBubble.value, {
      damping: 6,
      stiffness: 75,
      mass: 0.6,
    });
    const translateY = -(BUBBLE_HEIGHT / 2) * (1 - showTextBubble.value);
    return {
      opacity: showTextBubble.value,
      transform: [{ scale }, { translateY }],
      pointerEvents: showTextBubble.value === 0 ? "none" : "auto",
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle.editAndLike]}>
      <Animated.View
        style={[
          styles.dashedLine,
          dashedLineAnimatedStyle,
          animatedStyle.dashedLine,
        ]}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <View key={i} style={styles.dash} />
        ))}
      </Animated.View>

      <View style={styles.editButtonWrapper}>
        <TouchableOpacity
          onPress={onEdit}
          style={[styles.button, { backgroundColor: modeColor }]}
          activeOpacity={0.7}
        >
          <EditIcon width={24} height={24} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={onLike}
        style={[styles.button, { backgroundColor: modeColor }]}
        activeOpacity={0.7}
      >
        <HeartIcon size={24} fillColor={Colors.background_white} />
      </TouchableOpacity>

      {showTextBubble && (
        <Animated.View
          style={[styles.textBubbleContainer, bubbleAnimatedStyle]}
        >
          <TextBubble />
          <Text style={styles.textBubbleText}>식단기록 하러가기</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
};

export default EditAndLike;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 6,
    zIndex: 10,
  },
  editButtonWrapper: {
    alignItems: "center",
  },
  dashedLine: {
    position: "absolute",
    top: 40,
    left: 20,
    height: 24,
    justifyContent: "space-between",
  },
  dash: {
    width: 1,
    height: 2.8,
    backgroundColor: Colors.text_gray,
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
  textBubbleContainer: {
    position: "absolute",
    bottom: -36,
    right: 13,
  },
  textBubbleText: {
    position: "absolute",
    bottom: 6.4,
    left: 10.8,
    color: Colors.nurim,
    fontSize: 12,
    fontFamily: "NanumSquareRoundB",
  },
});
