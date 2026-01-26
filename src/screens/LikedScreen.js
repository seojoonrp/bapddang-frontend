// src/screens/LikedScreen.js

import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DebugButton from "../components/DebugButton";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { fetchLikedFoods } from "../services/like";

const LikedScreen = () => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);

  const [likedFoods, setLikedFoods] = useState([]);
  useEffect(() => {
    const InitLikedFoods = async () => {
      setLoading(true);

      try {
        const foods = await fetchLikedFoods();
        setLikedFoods(foods);
      } catch (error) {
        console.log("Error fetching liked foods:", error);
      } finally {
        setLoading(false);
      }
    };

    InitLikedFoods();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text>좋아요화면임</Text>

      {likedFoods.map((food) => (
        <Text key={food.id}>{food.name}</Text>
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
