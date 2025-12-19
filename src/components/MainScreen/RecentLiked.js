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

import Colors from "../../styles/colors";
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

  const textColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.point_green, Colors.burn_red],
  });

  return (
    <View style={styles.container}>
      <View style={styles.foodContainer}>
        {isLoading ? (
          <ActivityIndicator color={modeColor} />
        ) : (
          likedFoods.map((food) => (
            <TouchableOpacity key={food.id} style={styles.food}>
              {food.imageURL !== "temp" ? (
                <Image
                  source={{ uri: food.imageURL }}
                  style={styles.foodImage}
                />
              ) : (
                <Text>{food.name}</Text>
              )}
            </TouchableOpacity>
          ))
        )}
      </View>
    </View>
  );
};

export default RecentLiked;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    flexShrink: 0,
  },
  likedText: {
    fontSize: 15,
    fontFamily: "NanumSquareRoundB",
    marginBottom: 6,
  },
  foodContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    minHeight: 48,
    gap: 8,
  },
  food: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e0e0e0",
  },
  foodImage: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
  },
});
