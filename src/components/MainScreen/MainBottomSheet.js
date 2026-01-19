// src/components/MainScreen/MainBottomSheet.js

import { View, Text, StyleSheet } from "react-native";
import Colors from "../../constants/colors";
import CategorySelector from "./CategorySelector";
import { useState } from "react";

const MainBottomSheet = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const handleCategorySelect = (selectedCategories) => {
    setSelectedCategories(selectedCategories);
    console.log("Selected Categories:", selectedCategories);
    // TODO : API 요청
  };

  return (
    <View style={styles.container}>
      <View style={styles.categorySelectorContainer}>
        <CategorySelector onSelect={handleCategorySelect} />
        <Text style={styles.selectQuestionText}>중에서 골라볼까요?</Text>
      </View>
    </View>
  );
};

export default MainBottomSheet;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  categorySelectorContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  selectQuestionText: {
    marginLeft: 6,
    fontSize: 16,
    fontFamily: "NanumSquareRoundEB",
    color: Colors.burn,
  },
});
