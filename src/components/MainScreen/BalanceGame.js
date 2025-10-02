import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "../../styles/colors";

const BalanceGame = ({ question, foodIds }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.balanceGameText}>밸런스게임</Text>
      <Text style={styles.questionText}>
        부장님이 퇴근 10분 전 추가업무{"\n"}
        야밤에 퇴근할 때, 야식은?
      </Text>
      <View style={styles.choiceContainer}>
        <View style={styles.choiceBox}>
          <Text style={styles.choiceText}>쫄깃쫄깃! 야채곱창</Text>
        </View>
        <View style={styles.choiceBox}>
          <Text style={styles.choiceText}>알싸~한 마늘족발</Text>
        </View>
      </View>
      <Text style={styles.curPlayerText}>1928명이 참여중, 4시간 남았어요!</Text>
    </View>
  );
};

export default BalanceGame;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    gap: 8,
    backgroundColor: Colors.bg_white,
    borderColor: "#A87C66",
    borderWidth: 1.5,
    borderRadius: 16,
    boxShadow: "0 4px 0 2px #FDEDC0",
  },
  balanceGameText: {
    color: Colors.slightly_burn,
    fontFamily: "NanumSquareB",
    fontSize: 16,
  },
  questionText: {
    textAlign: "center",
    color: Colors.pressed_button,
    fontFamily: "NanumSquareEB",
    fontSize: 24,
  },
  choiceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  choiceBox: {
    width: "49%",
    height: 130,
    justifyContent: "center",
    backgroundColor: Colors.burn,
    borderRadius: 8,
    borderColor: "#A87C66",
    borderWidth: 1.5,
  },
  choiceText: {
    textAlign: "center",
    color: Colors.bg_white,
    fontFamily: "NanumSquareB",
    fontSize: 16,
  },
  curPlayerText: {
    width: "100%",
    alignSelf: "flex-end",
    textAlign: "right",
    marginTop: 4,
    marginRight: 4,
    color: Colors.text_gray,
    fontFamily: "NanumSquareB",
    fontSize: 12,
  },
});
