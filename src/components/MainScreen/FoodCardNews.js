// src/components/MainScreen/FoodCardNews.js

import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
  Animated,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";

import FoodInfoBox from "./FoodInfoBox";
import Colors from "../../constants/colors";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

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

  const handleCardPress = (item) => {
    setSelectedItem(item);
    setShowInfo(true);
  };

  const handleClose = () => {
    setShowInfo(false);
  };

  // card scroll animation
  const listRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleEndSwipe = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;

    const overScroll =
      contentOffset.x + layoutMeasurement.width - contentSize.width;
    if (overScroll > OVER_SCROLL_THRESHOLD) {
      onEndSwipe();
    }
  };

  const maxScrollX = size * (foodsData.length - 1);
  const footerTranslateX = scrollX.interpolate({
    inputRange: [
      maxScrollX - sidePadding + 4,
      maxScrollX + OVER_SCROLL_THRESHOLD,
    ],
    outputRange: [OVER_SCROLL_THRESHOLD, 0],
    extrapolate: "clamp",
  });
  const footerColor = scrollX.interpolate({
    inputRange: [maxScrollX, maxScrollX + OVER_SCROLL_THRESHOLD],
    outputRange: [Colors.light_gray, Colors.point_red],
    extrapolate: "clamp",
  });

  const renderItem = ({ item, index }) => {
    if (!size) return null;

    const inputRange = [(index - 1) * size, index * size, (index + 1) * size];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.88, 1.0, 0.88],
      extrapolate: "clamp",
    });

    return (
      <AnimatedTouchable
        onPress={() => handleCardPress(item)}
        activeOpacity={0.7}
        style={[
          styles.cardContainer,
          {
            width: size,
            height: size,
            transform: [{ scale }],
          },
        ]}
      >
        <Image source={{ uri: item.imageURL }} style={styles.cardImage} />
        <Text style={styles.foodText}>{item.name}</Text>
      </AnimatedTouchable>
    );
  };

  if (isLoading) return null;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.footer,
          {
            borderColor: footerColor,
            transform: [
              { translateX: footerTranslateX },
              { translateY: size * 0.1 },
            ],
            height: size * 0.8,
          },
        ]}
      >
        <Animated.Text style={[styles.footerText, { color: footerColor }]}>
          당겨서{"\n"}음식{"\n"}더 보기
        </Animated.Text>
      </Animated.View>

      <AnimatedFlatList
        ref={listRef}
        contentContainerStyle={{ paddingHorizontal: sidePadding }}
        data={foodsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        disableIntervalMomentum={true}
        snapToInterval={size}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onScrollEndDrag={handleEndSwipe}
      />

      <View style={[styles.paginationContainer, { height: paginationHeight }]}>
        <Text>Pagination</Text>
      </View>

      <Modal
        isVisible={showInfo}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropOpacity={0}
        onModalHide={() => setSelectedItem(null)}
        style={{ margin: 0 }}
      >
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <FoodInfoBox item={selectedItem} onClose={handleClose} />
      </Modal>
    </View>
  );
};

export default FoodCardNews;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#A87C66",
    borderWidth: 2,
    borderRadius: 16,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
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
