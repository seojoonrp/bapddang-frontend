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

const MARGIN_MULTIPLIER = 1.04;
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
  const itemWidth = containerHeight * MARGIN_MULTIPLIER;

  const filteredData = useMemo(
    () => foodsData.filter((item) => item.speed === mode),
    [foodsData, mode]
  );

  const loopData = useMemo(() => {
    if (filteredData.length <= 1) return filteredData; // 0~1개면 루프 의미 없음
    const first = filteredData[0];
    const last = filteredData[filteredData.length - 1];
    return [last, ...filteredData, first];
  }, [filteredData]);

  useEffect(() => {
    if (!containerHeight) return;
    if (loopData.length <= 1) return;

    const startOffset = itemWidth * 1; // index 1
    listRef.current?.scrollToOffset({ offset: startOffset, animated: false });
    scrollX.setValue(startOffset); // scale 보간값도 즉시 동기화(깜빡임 방지)
  }, [containerHeight, itemWidth, loopData.length]);

  const handleMomentumEnd = (e) => {
    if (loopData.length <= 1) return;

    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / itemWidth);

    const lastIndex = loopData.length - 1;

    // index 0 (앞에 붙인 last) -> 진짜 마지막(= filteredData의 마지막) 위치로 점프
    if (index === 0) {
      const targetIndex = filteredData.length; // loopData에서 진짜 마지막은 이 인덱스
      const targetOffset = targetIndex * itemWidth;
      listRef.current?.scrollToOffset({ offset: targetOffset, animated: false });
      scrollX.setValue(targetOffset);
      return;
    }

    // index lastIndex (뒤에 붙인 first) -> 진짜 처음(= index 1)로 점프
    if (index === lastIndex) {
      const targetIndex = 1;
      const targetOffset = targetIndex * itemWidth;
      listRef.current?.scrollToOffset({ offset: targetOffset, animated: false });
      scrollX.setValue(targetOffset);
    }
  };

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
            width: containerHeight * MARGIN_MULTIPLIER,
            height: containerHeight,
            transform: [{ scale }]
          },
        ]}
      >
        <Image
          source={{ uri: item.imageURL }} style={styles.cardImage}
        />
        <Text style={styles.foodText}>{item.name}</Text>
      </AnimatedTouchable>
    );
  }

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : foodsData.length > 0 ? (
        <AnimatedFlatList
          ref={listRef}
          contentContainerStyle={{ paddingHorizontal: pad }}
          data={loopData}
          //data={foodsData.filter((item) => item.speed === mode)}
          renderItem={renderItem}
          keyExtractor={(item, idx) => `${item.id ?? "x"}-${idx}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={containerHeight * MARGIN_MULTIPLIER}
          decelerationRate="fast"
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleMomentumEnd}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
        />
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
    width :300,
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
  },
  foodText: {
    position: "absolute",
    bottom: 15,
    backgroundColor: "black",
    padding: 5,
    color: "white",
    fontSize: 24,
  },
  backdrop: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
