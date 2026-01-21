// src/components/MainScreen/FoodCardNews.js

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  interpolateColor,
  Extrapolation,
  runOnJS, // TODO : Deprecated래서 scheduleOnRN 쓰면 에러뜸
} from "react-native-reanimated";
import FoodInfoModal from "./FoodInfoModal";
import Colors from "../../constants/colors";
import Pagination from "../common/Pagination";
import ReanimatedModal from "../common/ReanimatedModal";
import { useMainFeedFood } from "../../hooks/useMainFeedFood";

const OVER_SCROLL_THRESHOLD = 80;

const CardItem = memo(({ item, index, scrollX, size, onPress }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          scrollX.value,
          [(index - 1) * size, index * size, (index + 1) * size],
          [0.88, 1.0, 0.88],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  return (
    <TouchableOpacity onPress={() => onPress(item)} activeOpacity={0.7}>
      <Animated.View
        style={[
          styles.cardContainer,
          { width: size, height: size },
          animatedStyle,
        ]}
      >
        <Image source={{ uri: item.food.imageURL }} style={styles.cardImage} />
        <Text style={styles.foodText}>{item.food.name}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
});

const FoodCardNews = ({ screenWidth, size = screenWidth * 0.8 }) => {
  const { foods, isLoading, isExtraLoading, loadMore } = useMainFeedFood();

  const sidePadding = (screenWidth - size) / 2;

  const [selectedItem, setSelectedItem] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const scrollX = useSharedValue(0);
  const maxScrollX = size * (foods.length - 1);

  const flatListRef = useRef(null);
  const prevLengthRef = useRef(foods.length);

  const handleCardPress = useCallback((item) => {
    setSelectedItem(item);
    setShowInfo(true);
  }, []);

  useEffect(() => {
    if (!isExtraLoading && foods.length > prevLengthRef.current) {
      const newIndex = prevLengthRef.current;
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToIndex({
          index: newIndex,
          animated: true,
        });
      });
      prevLengthRef.current = foods.length;
    } else if (!isExtraLoading) {
      prevLengthRef.current = foods.length;
    }
  }, [isExtraLoading, foods.length]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
    onEndDrag: (event) => {
      const overScroll =
        event.contentOffset.x +
        event.layoutMeasurement.width -
        event.contentSize.width;
      if (overScroll > OVER_SCROLL_THRESHOLD) {
        runOnJS(loadMore)();
      }
    },
  });

  const animatedFooterStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      scrollX.value,
      [maxScrollX - sidePadding + 4, maxScrollX + OVER_SCROLL_THRESHOLD],
      [OVER_SCROLL_THRESHOLD, 0],
      Extrapolation.CLAMP,
    );
    const borderColor = interpolateColor(
      scrollX.value,
      [maxScrollX, maxScrollX + OVER_SCROLL_THRESHOLD],
      [Colors.light_gray, Colors.point_red],
    );

    return {
      borderColor,
      transform: [{ translateX }, { translateY: size * 0.1 }],
    };
  });
  const animatedFooterTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      scrollX.value,
      [maxScrollX, maxScrollX + OVER_SCROLL_THRESHOLD],
      [Colors.light_gray, Colors.point_red],
    ),
  }));

  if (isLoading) return null;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.footer, { height: size * 0.8 }, animatedFooterStyle]}
      >
        <Animated.Text style={[styles.footerText, animatedFooterTextStyle]}>
          당겨서{"\n"}음식{"\n"}더 보기
        </Animated.Text>
      </Animated.View>

      <Animated.FlatList
        ref={flatListRef}
        data={foods}
        keyExtractor={(item) => item.food.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={size}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: sidePadding }}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        renderItem={({ item, index }) => (
          <CardItem
            item={item}
            index={index}
            scrollX={scrollX}
            size={size}
            onPress={handleCardPress}
          />
        )}
        getItemLayout={(data, index) => ({
          length: size,
          offset: size * index,
          index,
        })}
      />

      <View style={styles.paginationContainer}>
        <Pagination total={foods.length} scrollX={scrollX} cardSize={size} />
      </View>

      <ReanimatedModal visible={showInfo} onClose={() => setShowInfo(false)}>
        <FoodInfoModal item={selectedItem} onClose={() => setShowInfo(false)} />
      </ReanimatedModal>
    </View>
  );
};

export default memo(FoodCardNews);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  cardContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#A87C66",
    borderWidth: 2,
    borderRadius: 16,
    overflow: "hidden",
  },
  cardImage: { width: "100%", height: "100%" },
  foodText: {
    position: "absolute",
    bottom: 18,
    color: Colors.background_white,
    fontFamily: "NanumSquareRoundB",
    fontSize: 16,
    textShadowColor: "black",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 50,
    shadowOpacity: 1,
  },
  paginationContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 8,
  },
  footer: {
    position: "absolute",
    right: 0,
    top: 0,
    width: OVER_SCROLL_THRESHOLD,
    justifyContent: "center",
    alignItems: "center",
    borderColor: Colors.light_gray,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    borderWidth: 1.5,
    borderRightWidth: 0,
  },
  footerText: {
    textAlign: "left",
    fontSize: 14,
    fontFamily: "NanumSquareRoundR",
    lineHeight: 20,
  },
  backdrop: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
