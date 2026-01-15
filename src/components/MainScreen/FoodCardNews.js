import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  interpolateColor,
  Extrapolation,
  runOnJS, // TODO : Deprecated래서 scheduleOnRN 쓰면 에러뜸
} from "react-native-reanimated";
import FoodInfoBox from "./FoodInfoModal";
import Colors from "../../constants/colors";
import Pagination from "../common/Pagination";
import ReanimatedModal from "../common/ReanimatedModal";

const OVER_SCROLL_THRESHOLD = 80;

const FoodCardNews = ({
  foodsData,
  screenWidth,
  size,
  isLoading,
  paginationHeight,
  onEndSwipe,
  isExtraLoading,
}) => {
  const sidePadding = (screenWidth - size) / 2;
  const [selectedItem, setSelectedItem] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const scrollX = useSharedValue(0);

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
        runOnJS(onEndSwipe)();
      }
    },
  });

  const maxScrollX = size * (foodsData.length - 1);

  const animatedFooterStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      scrollX.value,
      [maxScrollX - sidePadding + 4, maxScrollX + OVER_SCROLL_THRESHOLD],
      [OVER_SCROLL_THRESHOLD, 0],
      Extrapolation.CLAMP
    );
    const borderColor = interpolateColor(
      scrollX.value,
      [maxScrollX, maxScrollX + OVER_SCROLL_THRESHOLD],
      [Colors.light_gray, Colors.point_red]
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
      [Colors.light_gray, Colors.point_red]
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
        data={foodsData}
        keyExtractor={(item) => item.id.toString()}
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
            onPress={() => {
              setSelectedItem(item);
              setShowInfo(true);
            }}
          />
        )}
      />

      <View style={[styles.paginationContainer, { height: paginationHeight }]}>
        <Pagination
          total={foodsData.length}
          scrollX={scrollX}
          cardSize={size}
        />
      </View>

      <ReanimatedModal visible={showInfo} onClose={() => setShowInfo(false)}>
        <FoodInfoBox item={selectedItem} onClose={() => setShowInfo(false)} />
      </ReanimatedModal>
    </View>
  );
};

const CardItem = React.memo(({ item, index, scrollX, size, onPress }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          scrollX.value,
          [(index - 1) * size, index * size, (index + 1) * size],
          [0.88, 1.0, 0.88],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        style={[
          styles.cardContainer,
          { width: size, height: size },
          animatedStyle,
        ]}
      >
        <Image source={{ uri: item.imageURL }} style={styles.cardImage} />
        <Text style={styles.foodText}>{item.name}</Text>
      </Animated.View>
    </Pressable>
  );
});

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
    bottom: 15,
    backgroundColor: "black",
    padding: 5,
    color: "white",
    fontSize: 24,
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

export default FoodCardNews;
