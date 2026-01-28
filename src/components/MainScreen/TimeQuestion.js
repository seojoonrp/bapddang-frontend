import { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../../constants/colors";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const TimeQuestion = ({ showTextBubble }) => {
  const hour = new Date().getHours();

  const getMealInfo = () => {
    if (hour >= 5 && hour < 10)
      return { label: "아침식사", suffix: "를", question: "아침을" };
    if (hour >= 10 && hour < 16)
      return { label: "점심식사", suffix: "를", question: "점심을" };
    if (hour >= 16 && hour < 22)
      return { label: "저녁식사", suffix: "를", question: "저녁을" };
    return { label: "야식", suffix: "을", question: "야식을" };
  };

  const mealInfo = getMealInfo();

  const animatedButtonOpacity = useAnimatedStyle(() => ({
    transform: [
      { scale: withTiming(1 - showTextBubble.value, { duration: 300 }) },
    ],
  }));

  const handlePress = () => {
    showTextBubble.value = 1;
  };

  return (
    <View style={styles.container}>
      <View style={styles.textRow}>
        <View style={styles.timePill}>
          <Text style={styles.timePillText}>{mealInfo.label}</Text>
        </View>
        <Text style={styles.questionText}>
          {mealInfo.suffix} 고민 중인가요?
        </Text>
      </View>
      <AnimatedTouchableOpacity
        style={[styles.alreadyButton, animatedButtonOpacity]}
        onPress={handlePress}
      >
        <Text style={styles.alreadyText}>
          이미 {mealInfo.question} 먹었다면?
        </Text>
      </AnimatedTouchableOpacity>
    </View>
  );
};

export default memo(TimeQuestion);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  textRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timePill: {
    backgroundColor: Colors.background_white,
    borderWidth: 1.5,
    borderColor: Colors.nurim,
    borderRadius: 99,
    paddingVertical: 3,
    paddingHorizontal: 12,
    boxShadow: "0 2px 0 0 #FDEDC0",
  },
  timePillText: {
    color: Colors.point_red,
    fontFamily: "NanumSquareRoundEB",
    letterSpacing: -0.3,
    fontSize: 18,
  },
  questionText: {
    color: Colors.burn,
    fontSize: 16,
    fontFamily: "NanumSquareRoundEB",
    letterSpacing: -0.3,
  },
  alreadyButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 2,
  },
  alreadyText: {
    color: Colors.text_gray,
    fontSize: 12,
    fontFamily: "NanumSquareRoundB",
    letterSpacing: -0.2,
  },
});
