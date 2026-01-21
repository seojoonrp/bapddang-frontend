import { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../../constants/colors";

const TimeQuestion = () => {
  return (
    <View style={styles.textRow}>
      <View style={styles.timePill}>
        <Text style={styles.timePillText}>점심식사</Text>
      </View>
      <Text style={styles.questionText}>를 고민 중인가요?</Text>
    </View>
  );
};

export default memo(TimeQuestion);

const styles = StyleSheet.create({
  textRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 4,
    marginBottom: 14,
  },
  timePill: {
    backgroundColor: Colors.background_white,
    borderWidth: 1.5,
    borderColor: Colors.nurim,
    borderRadius: 99,
    paddingVertical: 3,
    paddingHorizontal: 12,
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
});
