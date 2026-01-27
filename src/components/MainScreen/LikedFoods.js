// src/components/MainScreen/LikedFoods.js

import { memo, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useModeStore } from "../../stores/modeStore";
import { useFoodStore } from "../../stores/foodStore";
import { fetchLikedFoods } from "../../services/like";
import Colors from "../../constants/colors";
import HeartIcon from "../../components/svg/HeartIcon";
import AllIcon from "../../assets/images/liked-all.svg";
import ReanimatedModal from "../common/ReanimatedModal";
import FoodInfoModal from "./FoodInfoModal";

const LikedFoods = () => {
  const navigation = useNavigation();

  const { mode, modeColor } = useModeStore();

  const [selectedFoodID, setSelectedFoodID] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const likedFoodIDs = useFoodStore((state) => state.likedFoodIDs);
  const foodsByID = useFoodStore((state) => state.foodsByID);
  const setLikedFoods = useFoodStore((state) => state.setLikedFoods);

  const [loading, setLoading] = useState(true);

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

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const displayItems = useMemo(() => {
    const fullList = likedFoodIDs.map((id) => foodsByID[id]).filter(Boolean);
    const shuffledList = shuffleArray(fullList);
    return shuffledList.slice(0, 4);
  }, [likedFoodIDs, foodsByID]);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <View style={styles.heartBorder}>
          <View style={styles.heartContainer}>
            <HeartIcon
              size={14}
              fillColor={Colors.background_white}
              strokeWidth={0}
            />
          </View>
        </View>
        <Text style={styles.questionText}>
          <Text style={{ color: Colors.point_red }}>찜해둔 메뉴&nbsp;</Text>
          중에서 골라볼까요?
        </Text>
      </View>
      <View style={styles.row}>
        <View style={styles.foodsContainer}>
          {displayItems.map((item) => (
            <TouchableOpacity
              key={item.food.id}
              style={styles.food}
              activeOpacity={0.7}
              onPress={() => {
                setSelectedFoodID(item.food.id);
                setShowInfo(true);
              }}
            >
              <Image
                source={{ uri: item.food.imageURL }}
                style={styles.foodImage}
              />
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.dotContainer}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        <TouchableOpacity
          style={styles.allContainer}
          onPress={() => navigation.navigate("Liked")}
        >
          <AllIcon width={55} height={56} />
        </TouchableOpacity>
      </View>

      <ReanimatedModal visible={showInfo} onClose={() => setShowInfo(false)}>
        <FoodInfoModal
          foodID={selectedFoodID}
          onClose={() => setShowInfo(false)}
        />
      </ReanimatedModal>
    </View>
  );
};

export default memo(LikedFoods);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    gap: 4,
    marginTop: 6,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: 6,
  },
  heartBorder: {
    width: 28,
    height: 28,
    borderRadius: 99,
    borderColor: Colors.border_yellow,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  heartContainer: {
    width: 22,
    height: 22,
    borderRadius: 99,
    backgroundColor: Colors.point_red,
    justifyContent: "center",
    alignItems: "center",
  },
  questionText: {
    fontSize: 16,
    fontFamily: "NanumSquareRoundEB",
    color: Colors.burn,
    letterSpacing: -0.3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  foodsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
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
  dotContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2.5,
  },
  dot: {
    width: 4.5,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: Colors.border_yellow,
  },
  allContainer: {
    marginTop: -2,
  },
  foodImage: {
    width: "92%",
    height: "92%",
    borderRadius: 99,
  },
});
