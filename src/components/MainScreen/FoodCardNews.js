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
import { useFoodStore } from "../../stores/foodStore";
import { useFoodFeed } from "../../hooks/useFoodFeed";

const OVER_SCROLL_THRESHOLD = 90;

const CardItem = memo(({ foodID, index, scrollX, size, onPress, ratio }) => {
  const item = useFoodStore((state) => state.foodsByID[foodID]);
  if (!item) return null;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          scrollX.value,
          [(index - 1) * size, index * size, (index + 1) * size],
          [ratio, 1.0, ratio],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  return (
    <TouchableOpacity onPress={() => onPress(foodID)} activeOpacity={0.7}>
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

const FoodCardNews = ({
  type,
  screenWidth,
  size,
  categories,
  canLoadMore = true,
  animationRatio,
}) => {
  const { foodIDs, isLoading, isExtraLoading, loadMore } = useFoodFeed(type, {
    categories,
  });

  const sidePadding = (screenWidth - size) / 2;

  const [selectedFoodID, setSelectedFoodID] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const scrollX = useSharedValue(0);
  const maxScrollX = size * (foodIDs.length - 1);
  const flatListRef = useRef(null);
  const prevLengthRef = useRef(foodIDs.length);

  useEffect(() => {
    scrollX.value = 0;
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: false });
    }
    prevLengthRef.current = foodIDs.length;
  }, [type, categories]);

  const handleCardPress = useCallback((foodID) => {
    setSelectedFoodID(foodID);
    setShowInfo(true);
  }, []);

  useEffect(() => {
    if (!isExtraLoading && foodIDs.length > prevLengthRef.current) {
      const newIndex = prevLengthRef.current;
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToIndex({
          index: newIndex,
          animated: true,
        });
      });
      prevLengthRef.current = foodIDs.length;
    } else if (!isExtraLoading) {
      prevLengthRef.current = foodIDs.length;
    }
  }, [isExtraLoading, foodIDs.length]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
    onEndDrag: (event) => {
      const overScroll =
        event.contentOffset.x +
        event.layoutMeasurement.width -
        event.contentSize.width;
      if (overScroll > OVER_SCROLL_THRESHOLD && canLoadMore) {
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
    const backgroundColor = interpolateColor(
      scrollX.value,
      [maxScrollX, maxScrollX + OVER_SCROLL_THRESHOLD],
      [Colors.background_yellow, Colors.point_red],
    );
    const borderRadius = interpolate(
      scrollX.value,
      [maxScrollX, maxScrollX + OVER_SCROLL_THRESHOLD],
      [16, 32],
      Extrapolation.CLAMP,
    );

    return {
      borderColor,
      backgroundColor,
      borderTopLeftRadius: borderRadius,
      borderBottomLeftRadius: borderRadius,
      transform: [{ translateX }, { translateY: size * 0.1 }],
    };
  });

  if (isLoading) return null;

  return (
    <View style={styles.container}>
      {canLoadMore && (
        <Animated.View
          style={[styles.footer, { height: size * 0.8 }, animatedFooterStyle]}
        >
          <Animated.Text style={styles.footerText}>
            당겨서{"\n"}음식{"\n"}더 보기
          </Animated.Text>
        </Animated.View>
      )}

      <Animated.FlatList
        ref={flatListRef}
        data={foodIDs}
        keyExtractor={(id) => id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={size}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: sidePadding }}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        renderItem={({ item: id, index }) => (
          <CardItem
            foodID={id}
            index={index}
            scrollX={scrollX}
            size={size}
            onPress={handleCardPress}
            ratio={animationRatio}
          />
        )}
        getItemLayout={(data, index) => ({
          length: size,
          offset: size * index,
          index,
        })}
      />

      <View style={styles.paginationContainer}>
        <Pagination total={foodIDs.length} scrollX={scrollX} cardSize={size} />
      </View>

      <ReanimatedModal visible={showInfo} onClose={() => setShowInfo(false)}>
        <FoodInfoModal
          foodID={selectedFoodID}
          onClose={() => setShowInfo(false)}
        />
      </ReanimatedModal>
    </View>
  );
};

export default memo(FoodCardNews);

const styles = StyleSheet.create({
  container: { justifyContent: "center", alignItems: "center" },
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
    color: Colors.background_yellow,
    fontSize: 14,
    fontFamily: "NanumSquareRoundB",
    lineHeight: 20,
    marginLeft: -2,
  },
  backdrop: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
