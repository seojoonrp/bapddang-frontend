// src/screens/LikedScreen.js

import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import { fetchLikedFoods } from "../services/like";
import { useFoodStore } from "../stores/foodStore";
import ChevronIcon from "../assets/icons/chevron.svg";
import Colors from "../constants/colors";
import FoodInfoModal from "../components/MainScreen/FoodInfoModal";
import ReanimatedModal from "../components/common/ReanimatedModal";
import { FlatList } from "react-native-gesture-handler";

const LikedScreen = () => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);

  const [selectedFoodID, setSelectedFoodID] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const likedFoodIDs = useFoodStore((state) => state.likedFoodIDs);
  const foodsByID = useFoodStore((state) => state.foodsByID);
  const setLikedFoods = useFoodStore((state) => state.setLikedFoods);

  useEffect(() => {
    const loadLikedFoods = async () => {
      try {
        const foods = await fetchLikedFoods();
        setLikedFoods(foods);
      } catch (error) {
        console.log("Error fetching liked foods:", error);
      } finally {
        setLoading(false);
      }
    };

    loadLikedFoods();
  }, []);

  const displayItems = useMemo(() => {
    const fullList = likedFoodIDs.map((id) => foodsByID[id]).filter(Boolean);
    return fullList;
  }, [likedFoodIDs, foodsByID]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backContainer}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ChevronIcon width={28} height={28} color={Colors.setting_gray} />
        </TouchableOpacity>
        <Text style={styles.headerText}>찜한 음식</Text>
      </View>

      <View style={styles.foodsContainer}>
        <FlatList
          data={displayItems}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.food.id}
              style={styles.food}
              onPress={() => {
                setSelectedFoodID(item.food.id);
                setShowInfo(true);
              }}
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: item.food.imageURL }}
                style={styles.foodImage}
              />
            </TouchableOpacity>
          )}
          numColumns={4}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
        />
      </View>

      <ReanimatedModal visible={showInfo} onClose={() => setShowInfo(false)}>
        <FoodInfoModal
          foodID={selectedFoodID}
          onClose={() => setShowInfo(false)}
        />
      </ReanimatedModal>
    </SafeAreaView>
  );
};

export default LikedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background_white,
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 24,
  },
  header: {
    width: "100%",
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: Colors.light_text_gray,
    borderBottomWidth: 0.5,
  },
  backContainer: {
    position: "absolute",
    left: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: Colors.point_red,
    fontSize: 24,
    fontFamily: "NanumSquareRoundEB",
  },
  foodsContainer: {
    flex: 1,
    width: "100%",
  },
  listContent: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  row: {
    justifyContent: "flex-start",
    width: 270,
    gap: 10,
    marginBottom: 10,
  },
  food: {
    width: 60,
    height: 60,
    borderRadius: 99,
    overflow: "hidden",
    borderColor: Colors.border_yellow,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  foodImage: {
    width: "92%",
    height: "92%",
    borderRadius: 99,
  },
});
