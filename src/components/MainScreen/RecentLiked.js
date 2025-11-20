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
import { listenToLikedFoods } from "../../services/user";

import useModeStore from "../../stores/modeStore";

import Colors from "../../styles/colors";

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
    const currentUser = user;
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = listenToLikedFoods(currentUser.uid, (foods) => {
      setLikedFoods(foods.slice(0, 4));
      if (isLoading) setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const textColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.point_green, Colors.burn_red],
  });

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.likedText, { color: textColor }]}>
        최근 좋아요한 음식들
      </Animated.Text>
      <View style={styles.foodContainer}>
        {isLoading ? (
          <ActivityIndicator color={modeColor} />
        ) : (
          likedFoods.map((food) => (
            <TouchableOpacity key={food.id} style={styles.food}>
              <Image source={{ uri: food.imageUrl }} style={styles.foodImage} />
            </TouchableOpacity>
          ))
        )}
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>&gt;&gt;</Text>
        </TouchableOpacity>
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
    gap: 6,
  },
  food: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e0e0e0",
  },
  foodImage: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
  },
  viewAllButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#CCC",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 2,
  },
  viewAllText: {
    fontSize: 17,
    fontFamily: "NanumSquareRoundEB",
    color: "#FFF",
    textAlign: "center",
  },
});
