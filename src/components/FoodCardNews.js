import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Pressable,
} from "react-native";
import Modal from "react-native-modal";

import { fetchFoods } from "../services/food";
import InfoBox from "./InfoBox";

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
        style={styles.cardImage}
      >
        <Text style={styles.name}>{item.name}</Text>
      </TouchableOpacity>
      {mode === "slow" && (
        <View style={styles.calorieBox}>
          <Text style={styles.calorieText}>{item.calorie} cal</Text>
        </View>
      )}
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
          <InfoBox item={selectedItem} mode={mode} onClose={handleClose} />
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
    flexDirection: "column",
    alignItems: "center",
  },
  cardImage: {
    width: width - cardMargin * 2 - 2,
    height: width - cardMargin * 2 - 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fcfcfc",
    borderColor: "black",
    borderWidth: 1,
  },
  name: {
    fontSize: 50,
  },
  calorieBox: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginTop: -20,
    textAlign: "center",
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "black",
  },
  calorieText: {
    fontSize: 25,
  },
  backdrop: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
