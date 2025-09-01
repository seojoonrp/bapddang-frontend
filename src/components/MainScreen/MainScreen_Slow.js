import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

import FoodCardNews from "./FoodCardNews";

const MainScreen_Slow = () => {
  return (
    <View style={styles.container}>
      <View style={styles.curStatusContainer}>
        <Text style={styles.curStreakText}>연속 0일차</Text>
        <TouchableOpacity
          style={styles.dietLogButton}
          onPress={() => navigation.navigate("식단 기록 화면")}
        >
          <Text>주간 식단 기록 화면 가기</Text>
        </TouchableOpacity>
      </View>
      <FoodCardNews mode="slow" />
    </View>
  );
};

export default MainScreen_Slow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,

    borderColor: "black",
    borderWidth: 1,
  },
  curStatusContainer: {
    alignSelf: "stretch",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
    marginTop: 180,
    marginBottom: 10,
    marginHorizontal: 16,

    borderColor: "black",
    borderWidth: 1,
  },
  curStreakText: {
    fontSize: 20,
  },
  dietLogButton: {
    padding: 5,
    marginTop: 5,

    borderColor: "black",
    borderWidth: 1,
  },
});
