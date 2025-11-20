import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";

import useModeStore from "../../stores/modeStore";

import FoodInfoBox from "./FoodInfoBox";

const MARGIN_MULTIPLIER = 1.02;

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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleCardPress(item)}
      activeOpacity={0.7}
      style={[
        styles.cardContainer,
        { width: containerHeight * MARGIN_MULTIPLIER, height: containerHeight },
      ]}
    >
      {item.imageUrl && item.imageUrl !== "temp" ? (
        <Image
          source={{ uri: item.imageUrl }}
          style={[styles.cardImage, { height: containerHeight }]}
        />
      ) : (
        <View style={[styles.cardImage, styles.imagePlaceholder]} />
      )}
      <Text style={styles.foodText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : foodsData.length > 0 ? (
        <FlatList
          paddingHorizontal={pad}
          data={foodsData.filter((item) => item.speed === mode)}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={containerHeight * MARGIN_MULTIPLIER}
          decelerationRate="fast"
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
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  cardImage: {
    aspectRatio: 1,
  },
  imagePlaceholder: {
    backgroundColor: "#E0E0E0",
  },
  foodText: {
    position: "absolute",
    color: "white",
    backgroundColor: "rgba(0,0,0,0.5)",
    fontSize: 18,
    padding: 8,
    borderRadius: 5,
    bottom: 12,
  },
  backdrop: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
