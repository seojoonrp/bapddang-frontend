// src/components/MainScreen/FoodCardNews.js

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
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
import LoadingPlaceholer from "../common/LoadingPlaceholer";
import { useShallow } from "zustand/shallow";
import { useModeStore } from "../../stores/modeStore";

const OVER_SCROLL_THRESHOLD = 90;
const SKELETON_DATA = [null, null];

const CardItem = memo(
  ({ foodID, index, scrollX, size, onPress, ratio, modeColor }) => {
    const item = useFoodStore(
      useShallow((state) => (foodID ? state.foodsByID[foodID] : null)),
    );
    const [imageLoaded, setImageLoaded] = useState(false);

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

    if (!item || !foodID) {
      return (
        <Animated.View
          style={[
            styles.cardContainer,
            { width: size, height: size },
            animatedStyle,
          ]}
        >
          <LoadingPlaceholer
            text="음식 정보를 불러오는 중..."
            color={modeColor}
          />
        </Animated.View>
      );
    }

    return (
      <TouchableOpacity onPress={() => onPress(foodID)} activeOpacity={0.7}>
        <Animated.View
          style={[
            styles.cardContainer,
            { width: size, height: size },
            animatedStyle,
          ]}
        >
          {!imageLoaded && (
            <View style={[StyleSheet.absoluteFill]}>
              <LoadingPlaceholer text="이미지 로딩 중..." color={modeColor} />
            </View>
          )}

          <Image
            source={{ uri: item.food.imageURL }}
            style={[styles.cardImage]}
            contentFit="cover"
            cachePolicy={"memory-disk"}
            onLoad={() => setImageLoaded(true)}
            transition={300}
          />

          {imageLoaded && <Text style={styles.foodText}>{item.food.name}</Text>}
        </Animated.View>
      </TouchableOpacity>
    );
  },
);

const FoodCardNews = ({
  type,
  screenWidth,
  size,
  categories,
  canLoadMore = true,
  animationRatio,
  pagination = true,
}) => {
  const { foodIDs, isLoading, isExtraLoading, loadMore } = useFoodFeed(type, {
    categories,
  });

  const mode = useModeStore((state) => state.mode);
  const modeColor = useModeStore((state) => state.modeColor);
  const noFoodMessage =
    type === "main"
      ? "오류가 발생했습니다. 다시 시도해주세요."
      : "선택한 카테고리에 해당되는 " +
        (mode === "fast" ? "고속" : "저속") +
        "노화 음식이 없어요.";

  const displayData = isLoading ? SKELETON_DATA : foodIDs;

  const sidePadding = (screenWidth - size) / 2;

  const [selectedFoodID, setSelectedFoodID] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const scrollX = useSharedValue(0);
  const maxScrollX = size * (displayData.length - 1);
  const flatListRef = useRef(null);
  const prevLengthRef = useRef(foodIDs.length);

  useEffect(() => {
    scrollX.value = 0;
    prevLengthRef.current = 0;

    if (flatListRef.current) {
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
      });
    }
  }, [type, categories]);

  const handleCardPress = useCallback((foodID) => {
    setSelectedFoodID(foodID);
    setShowInfo(true);
  }, []);

  useEffect(() => {
    if (
      !isExtraLoading &&
      foodIDs.length > prevLengthRef.current &&
      prevLengthRef.current !== 0
    ) {
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
      [Colors.light_gray, modeColor],
    );
    const borderRadius = interpolate(
      scrollX.value,
      [maxScrollX, maxScrollX + OVER_SCROLL_THRESHOLD],
      [16, 32],
      Extrapolation.CLAMP,
    );

    return {
      borderColor,
      borderTopLeftRadius: borderRadius,
      borderBottomLeftRadius: borderRadius,
      transform: [{ translateX }, { translateY: size * 0.1 }],
    };
  });
  const animatedFooterTextStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        scrollX.value,
        [maxScrollX, maxScrollX + OVER_SCROLL_THRESHOLD],
        [Colors.background_yellow, modeColor],
      ),
    };
  });

  const renderItem = useCallback(
    ({ item: id, index }) => {
      return (
        <CardItem
          foodID={id}
          index={index}
          scrollX={scrollX}
          size={size}
          onPress={handleCardPress}
          ratio={animationRatio}
          modeColor={modeColor}
        />
      );
    },
    [size, handleCardPress, animationRatio, modeColor],
  );

  if (foodIDs.length === 0) {
    return (
      <View style={[styles.container, { height: size }]}>
        <Text style={styles.noFoodText}>{noFoodMessage}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {canLoadMore && (
        <Animated.View
          style={[styles.footer, { height: size * 0.8 }, animatedFooterStyle]}
        >
          <Animated.Text style={[styles.footerText, animatedFooterTextStyle]}>
            당겨서{"\n"}음식{"\n"}더 보기
          </Animated.Text>
        </Animated.View>
      )}

      <Animated.FlatList
        ref={flatListRef}
        data={displayData}
        keyExtractor={(item, index) =>
          item ? item.toString() : `skeleton-${index}`
        }
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={size}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: sidePadding }}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        initialNumToRender={2}
        windowSize={3}
        maxToRenderPerBatch={3}
        renderItem={renderItem}
        getItemLayout={(data, index) => ({
          length: size,
          offset: size * index,
          index,
        })}
        removeClippedSubviews={true}
      />

      {pagination && (
        <View style={styles.paginationContainer}>
          <Pagination
            total={foodIDs.length}
            scrollX={scrollX}
            cardSize={size}
          />
        </View>
      )}

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
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  cardImage: { width: "100%", height: "100%" },
  foodText: {
    position: "absolute",
    bottom: 18,
    color: Colors.background_white,
    fontFamily: "NanumSquareRoundB",
    fontSize: 16,
    textShadowColor: "black",
    textShadowRadius: 20,
    shadowOpacity: 1,
  },
  paginationContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 10,
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
  noFoodText: {
    color: Colors.slightly_burn,
    fontSize: 12,
    fontFamily: "NanumSquareRoundR",
    letterSpacing: -0.3,
  },
});
