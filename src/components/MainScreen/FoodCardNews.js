import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
  ActivityIndicator,
  Animated,
} from "react-native";
import Modal from "react-native-modal";

import useModeStore from "../../stores/modeStore";
import FoodInfoBox from "./FoodInfoBox";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const FoodCardNews = ({ pad, foodsData = [], isLoading }) => {
  const { mode } = useModeStore();

  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const handleLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    if (width > 0 && containerWidth === 0) {
      setContainerWidth(width);
    }
    if (height > 0 && containerHeight === 0) {
      setContainerHeight(height);
    }
  };

  const sidePadding = (containerWidth - containerHeight) / 2;
  const snapInterval = containerHeight;
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
  const itemWidth = containerHeight;

  const filteredData = useMemo(
    () => foodsData.filter((item) => item.speed === mode),
    [foodsData, mode]
  );
  const position = useMemo(() => {
    if (!snapInterval) return null;
    return Animated.divide(scrollX, snapInterval);
  }, [scrollX, snapInterval]);

  const renderItem = ({ item, index }) => {
    if (!containerHeight) return null;

    const inputRange = [
      (index - 1) * itemWidth,
      index * itemWidth,
      (index + 1) * itemWidth,
    ];

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
            width: containerHeight,
            height: containerHeight,
            transform: [{ scale }],
          },
        ]}
      >
        <Image source={{ uri: item.imageURL }} style={styles.cardImage} />
        <Text style={styles.foodText}>{item.name}</Text>
      </AnimatedTouchable>
    );
  };

  const renderPaginationDots = () => {
    if (!position || filteredData.length <= 1) return null;

    return (
      <View style={[styles.pagination]}>
        {filteredData.map((_, i) => {
          const opacity = position.interpolate({
            inputRange: [i - 1, i, i + 1],
            outputRange: [0.25, 1.0, 0.25],
            extrapolate: "clamp",
          });

          const scale = position.interpolate({
            inputRange: [i - 1, i, i + 1],
            outputRange: [0.9, 1.35, 0.9],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={`dot-${i}`}
              style={[
                styles.dot,
                {
                  bottom: -containerHeight / 2 - 16,
                  opacity,
                  transform: [{ scale }],
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : foodsData.length > 0 ? (
        <>
          <AnimatedFlatList
            ref={listRef}
            contentContainerStyle={{ paddingHorizontal: sidePadding }}
            data={filteredData}
            //data={foodsData.filter((item) => item.speed === mode)}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={containerHeight}
            decelerationRate="fast"
            scrollEventThrottle={16}
            initialNumToRender={0}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true }
            )}
          />
          {renderPaginationDots()}
        </>
      ) : (
        <Text>표시할 음식이 없습니다.</Text>
      )}

      <Modal
        isVisible={showInfo}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropOpacity={0}
        onModalHide={() => setSelectedItem(null)}
        style={{ margin: 0 }}
      >
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <FoodInfoBox item={selectedItem} mode={mode} onClose={handleClose} />
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
    width: 300,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 16,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 16,
    borderColor: "#A87C66",
    borderWidth: 1.5,
  },
  foodText: {
    position: "absolute",
    bottom: 15,
    backgroundColor: "black",
    padding: 5,
    color: "white",
    fontSize: 24,
  },
  pagination: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "black",
    marginHorizontal: 4,
  },
  backdrop: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
