import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import fastFoodData from "../data/fastFoodData.json";
import slowFoodData from "../data/slowFoodData.json";
import InfoBox from "./InfoBox";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const cardMargin = 16;

const FoodCardNews = ({ mode }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showReview, setShowReview] = useState(false);

  // 애니메이션 좌표
  const infoX = useSharedValue(0);
  const reviewX = useSharedValue(width); // 오른쪽에서 시작

  const infoStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: infoX.value }],
  }));

  // 카드 선택 시 초기화
  const handleCardPress = (item) => {
    setShowReview(false);
    setSelectedItem(item);

    infoX.value = 0;
    reviewX.value = width;
  };

  // 종료
  const handleClose = () => {
    setShowReview(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  // 좋아요 눌렀을 때 슬라이드 전환
  const handleLike = () => {
    console.log("before:", infoX.value, reviewX.value);

    infoX.value = withTiming(-width, { duration: 300 });
    reviewX.value = withTiming(0, { duration: 300 }, () => {
      runOnJS(setShowReview)(true);
      console.log("after:", infoX.value, reviewX.value);
    });
  };

  // 카드 렌더링
  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        onPress={() => handleCardPress(item)}
        style={styles.cardImage}
      >
        <Text style={styles.name}>{item.name}</Text>
      </TouchableOpacity>
      {mode === "slow" && (
        <View style={styles.calorieBox}>
          <Text style={styles.calorieText}>{item.calorie} cal</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mode === "fast" ? fastFoodData : slowFoodData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: cardMargin }}
        ItemSeparatorComponent={() => (
          <View style={{ width: cardMargin * 2 }} />
        )}
      />

      {selectedItem && (
        <Animated.View style={[infoStyle, styles.animatedBox]}>
          <InfoBox
            visible={!showReview}
            item={selectedItem}
            mode={mode}
            onLike={handleLike}
            onClose={handleClose}
          />
        </Animated.View>
      )}
    </View>
  );
};

export default FoodCardNews;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  cardImage: {
    width: width - cardMargin * 2 - 2,
    height: width - cardMargin * 2 - 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fcfcfc",
    borderColor: "black",
    borderWidth: 1,
  },
  name: {
    fontSize: 50,
  },
  calorieBox: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginTop: -20,
    textAlign: "center",
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "black",
  },
  calorieText: {
    fontSize: 25,
  },
  animatedBox: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});
