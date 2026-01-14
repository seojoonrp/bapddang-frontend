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
} from "react-native";
import Modal from "react-native-modal";
import PaginationDot from "react-native-animated-pagination-dot";

import FoodInfoBox from "./FoodInfoBox";
import Colors from "../../constants/colors";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const FoodCardNews = ({
  foodsData,
  screenWidth,
  size,
  isLoading,
  paginationHeight,
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
  const [curPage, setCurPage] = useState(0);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(offsetX / size);
    if (pageIndex !== curPage) {
      setCurPage(pageIndex);
    }
  };

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
          { useNativeDriver: false, listener: handleScroll }
        )}
      />

      <View style={[styles.paginationContainer, { height: paginationHeight }]}>
        <PaginationDot
          activeDotColor={Colors.burn}
          curPage={curPage}
          maxPage={foodsData.length}
          sizeRatio={1.0}
        />
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
  backdrop: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
