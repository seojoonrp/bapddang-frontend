import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, Image, ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../styles/colors";

// listenToLikedFoods 함수를 import
import { listenToLikedFoods } from "../../services/user";
import { auth } from "../../services/firebase";

// 컴포넌트 이름을 RecentLiked로 수정했습니다. (이전 답변 참고)
const RecentLiked = ({ isFast }) => {
  const navigation = useNavigation();
  const [animValue] = useState(new Animated.Value(isFast ? 1 : 0));
  const [likedFoods, setLikedFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: isFast ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isFast, animValue]);

  useEffect(() => {
    const currentUser = auth.currentUser;
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
          <ActivityIndicator color={isFast ? Colors.burn_red : Colors.point_green} />
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
    alignSelf: "stretch",
    flexDirection: "column",
    marginHorizontal: 18,
    marginBottom: 12,
  },
  likedText: {
    fontSize: 15,
    fontFamily: "NanumSquareRoundB",
    marginBottom: 6,
    marginLeft: 4,
  },
  foodContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    minHeight: 48,
  },
  food: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 6,
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
    marginHorizontal: 6,
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