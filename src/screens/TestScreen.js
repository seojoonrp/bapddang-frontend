import React from "react";
import { View } from "react-native";
import { useRoute } from "@react-navigation/native";

import BalanceGame from "../components/MainScreen/BalanceGame";
import Colors from "../styles/colors";

const TestScreen = () => {
  const route = useRoute();
  const foodsData = route.params?.foodsData || null;

  if (!foodsData) {
    console.warn("TestScreen: foodsData 파라미터 이상함");
    return null;
  }

  const shuffled = foodsData.sort(() => 0.5 - Math.random());
  const selectedFoods = shuffled.slice(0, 2);
  console.log("TestScreen: selectedFoods", selectedFoods);

  const question = "부장님이 퇴근 10분 전 추가업무\n야밤에 퇴근할 때, 야식은?";

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        padding: 12,
        alignItems: "center",
        backgroundColor: Colors.bg_white,
      }}
    >
      <BalanceGame question={question} selectedFoods={selectedFoods} />
    </View>
  );
};

export default TestScreen;
