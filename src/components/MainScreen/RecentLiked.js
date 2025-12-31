import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import useAuthStore from "../../stores/authStore";
import useModeStore from "../../stores/modeStore";

import Colors from "../../constants/colors";
import { fetchLikedFoods } from "../../services/user";

const RecentLiked = () => {
  const { user } = useAuthStore();
  const navigation = useNavigation();

  const { mode, modeColor } = useModeStore();

  const [animValue] = useState(new Animated.Value(mode === "fast" ? 1 : 0));
  const [likedFoods, setLikedFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: mode === "fast" ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [mode, animValue]);

  useEffect(() => {
    const loadLikedFoods = async () => {
      if (!user) {
        setLikedFoods([]);
        setIsLoading(false);
        return;
      }

      try {
        const foods = await fetchLikedFoods();
        setLikedFoods(foods.slice(0, 5));
      } catch (error) {
        console.error("Error fetching liked foods:", error);
        setLikedFoods([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadLikedFoods();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator color={modeColor} />
      ) : (
        likedFoods.map((food) => (
          <TouchableOpacity key={food.id} style={styles.food}>
            {food.imageURL !== "temp" ? (
              <Image source={{ uri: food.imageURL }} style={styles.foodImage} />
            ) : (
              <Text>{food.name}</Text>
            )}
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

export default RecentLiked;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 16,
  },
  food: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.background_yellow,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#FDEDC0",
    borderWidth: 2.5,
  },
  foodImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
