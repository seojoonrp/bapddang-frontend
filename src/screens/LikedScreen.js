// src/screens/LikedScreen.js

import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DebugButton from "../components/DebugButton";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { fetchLikedFoods } from "../services/like";
import { useFoodStore } from "../stores/foodStore";

const LikedScreen = () => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);

  const likedFoodIDs = useFoodStore((state) => state.likedFoodIDs);
  const foodsByID = useFoodStore((state) => state.foodsByID);
  const setLikedFoods = useFoodStore((state) => state.setLikedFoods);

  useEffect(() => {
    const initLikedFoods = async () => {
      if (likedFoodIDs.length === 0) setLoading(true);

      try {
        const foods = await fetchLikedFoods();
        setLikedFoods(foods);
      } catch (error) {
        console.log("Error fetching liked foods:", error);
      } finally {
        setLoading(false);
      }
    };

    initLikedFoods();
  }, []);

  const likedItems = likedFoodIDs.map((id) => foodsByID[id]).filter(Boolean);

  return (
    <SafeAreaView style={styles.container}>
      <Text>좋아요화면임</Text>

      {likedItems.map((item) => (
        <Text key={item.food.id}>{item.food.name}</Text>
      ))}

      <DebugButton
        index={0}
        label="Go back"
        onPress={() => navigation.goBack()}
      />
    </SafeAreaView>
  );
};

export default LikedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
