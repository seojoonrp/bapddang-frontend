import React from "react";
import { View } from "react-native";

import BalanceGame from "../components/MainScreen/BalanceGame";
import Colors from "../styles/colors";

const TestScreen = () => {
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
      <BalanceGame />
    </View>
  );
};

export default TestScreen;
