// src/components/MainScreen/MainBottomSheet.js

import { useState, memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import Colors from "../../constants/colors";
import { MAIN_LAYOUT } from "../../constants/layout";
import CategorySelector from "./CategorySelector";
import { useMainLayout } from "../../hooks/useMainLayout";
import FoodCardNews from "./FoodCardNews";
import LikedFoods from "./LikedFoods";
import RecentReviews from "./RecentReviews";

const MainBottomSheet = ({ animatedStyle, scrollThreshold }) => {
  const { screenWidth } = useMainLayout();

  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategorySelect = (categories) => {
    if (categories === selectedCategories) return;

    setSelectedCategories(categories);
  };

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { height: scrollThreshold + MAIN_LAYOUT.BOTTOM_SHEET_HANDLE },
        animatedStyle.bottomSheet,
      ]}
    >
      <View style={styles.handleArea}>
        <View style={styles.handleBar} />
        <Animated.Text
          style={[styles.handleText, animatedStyle.originalHandleText]}
        >
          카테고리별 추천 메뉴를 보려면 올려주세요!
        </Animated.Text>
        <Animated.Text
          style={[
            styles.handleText,
            animatedStyle.newHandleText,
            { marginTop: -32 },
          ]}
        >
          카테고리별 추천 메뉴 보기!
        </Animated.Text>
      </View>

      <Animated.View style={[styles.content, animatedStyle.bottomSheetContent]}>
        <View style={styles.categoryContainer}>
          <CategorySelector onSelect={handleCategorySelect} />

          <FoodCardNews
            type="category"
            screenWidth={screenWidth}
            size={screenWidth * 0.6}
            categories={selectedCategories}
            canLoadMore={false}
            animationRatio={0.93}
            pagination={false}
          />
        </View>

        <LikedFoods />

        <RecentReviews />
      </Animated.View>
    </Animated.View>
  );
};

export default memo(MainBottomSheet);

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: Colors.background_white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 30,
  },
  handleArea: {
    height: MAIN_LAYOUT.BOTTOM_SHEET_HANDLE,
    alignItems: "center",
    paddingTop: 8,
    gap: 16,
  },
  handleBar: {
    width: 36,
    height: 5,
    backgroundColor: Colors.slightly_burn,
    borderRadius: 99,
  },
  handleText: {
    color: Colors.slightly_burn,
    fontSize: 16,
    fontFamily: "NanumSquareRoundEB",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 24,
  },
  categoryContainer: {
    width: "100%",
    gap: 12,
  },
});
