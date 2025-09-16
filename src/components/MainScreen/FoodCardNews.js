import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import Modal from "react-native-modal";

import { fetchFoods } from "../../services/food";

import useModeStore from "../../stores/modeStore";

import FoodInfoBox from "./FoodInfoBox";

const { width: screenWidth } = Dimensions.get("window");
const cardMargin = 16;
const calculatedCardSize = screenWidth - (cardMargin * 2) * 2;

const FoodCardNews = () => {
  const { mode } = useModeStore();

  const [foodsData, setFoodsData] = useState([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFoods();
        setFoodsData(data);
      } catch (error) {
        console.error("Error fetching food data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const [selectedItem, setSelectedItem] = useState(null);
  const [showReview, setShowReview] = useState(false);

  const handleCardPress = (item) => {
    setSelectedItem(item);
    setShowReview(true);
  };

  const handleClose = () => {
    setShowReview(false);
  };

  // 2. onLayout은 이제 컨테이너의 너비를 얻는 역할만 합니다.
  const onLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.cardContainer, { width: containerWidth }]}>
      <TouchableOpacity
        onPress={() => handleCardPress(item)}
        activeOpacity={0.7}
        // 3. 카드 크기를 `calculatedCardSize`로 고정합니다.
        style={[
          styles.foodButtonContainer,
          { width: calculatedCardSize, height: calculatedCardSize },
        ]}
      >
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.foodImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.foodImage, styles.imagePlaceholder]} />
        )}
        <Text style={styles.foodText}>{item.name}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container} onLayout={onLayout}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : foodsData.length > 0 ? (
        <FlatList
          data={foodsData.filter((item) => item.type === mode)}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
        />
      ) : (
        <Text>표시할 음식이 없습니다.</Text>
      )}

      <Modal
        isVisible={showReview}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropOpacity={0}
        onModalHide={() => setSelectedItem(null)}
        style={{ margin: 0 }}
      >
        <Pressable style={styles.backdrop} onPress={handleClose} />
        {selectedItem && (
          <FoodInfoBox item={selectedItem} mode={mode} onClose={handleClose} />
        )}
      </Modal>
    </View>
  );
};

export default FoodCardNews;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'center',
  },
  cardContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  foodButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fcfcfc",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  foodImage: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    backgroundColor: '#E0E0E0',
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