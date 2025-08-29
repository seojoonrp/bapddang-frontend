import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Pressable,
  Image,
} from "react-native";
import Modal from "react-native-modal";

import { fetchFoods } from "../services/food";
import FoodInfoBox from "./FoodInfoBox";

const { width } = Dimensions.get("window");
const cardMargin = 16;

const FoodCardNews = ({ mode }) => {
  const [foodsData, setFoodsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchFoods();
      setFoodsData(data);
      console.log("Fetched foods data:", data);
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

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        onPress={() => handleCardPress(item)}
        activeOpacity={0.7}
        style={styles.foodButtonContainer}
      >
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.foodImage}
          resizeMode="cover"
        />
        <Text style={styles.foodText}>{item.name}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={foodsData.filter((item) => item.type === mode)}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: cardMargin }}
        ItemSeparatorComponent={() => (
          <View style={{ width: cardMargin * 2 }} />
        )}
      />

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
  },
  cardContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  foodButtonContainer: {
    width: width - cardMargin * 2 - 2,
    height: width - cardMargin * 2 - 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fcfcfc",
    borderColor: "black",
    borderWidth: 1,
  },
  foodImage: {
    width: "100%",
    height: "100%",
  },
  foodText: {
    position: "absolute",
    color: "white",
    backgroundColor: "black",
    fontSize: 18,
    padding: 5,
    bottom: 12,
  },
  name: {
    fontSize: 50,
  },
  backdrop: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
