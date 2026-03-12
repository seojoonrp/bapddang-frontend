// src/components/MainScreen/LikedFoods.js

import { memo, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useShallow } from "zustand/shallow";
import { useModeStore } from "../../stores/modeStore";
import { useFoodStore, selectLikedFoodItems } from "../../stores/foodStore";
import { fetchLikedFoods } from "../../services/like";
import Colors from "../../constants/colors";
import HeartIcon from "../../components/svg/HeartIcon";
import AllIcon from "../../assets/images/liked-all.svg";
import { useReviewStore } from "../../stores/reviewStore";
import ReanimatedModal from "../common/ReanimatedModal";
import FoodInfoModal from "./FoodInfoModal";
import CreateReviewModal from "../DietLogScreen/CreateReviewModal";

const LikedFoods = () => {
  const navigation = useNavigation();

  const mode = useModeStore((state) => state.mode);
  const modeColor = useModeStore((state) => state.modeColor);

  const [selectedFoodID, setSelectedFoodID] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewFoodName, setReviewFoodName] = useState("");

  const handleCreateReview = (name) => {
    setShowInfo(false);
    setReviewFoodName(name);
    setShowReviewModal(true);
  };

  const addReviewToStore = useReviewStore((state) => state.addReviewToStore);

  const handleReviewSuccess = (created) => {
    setShowReviewModal(false);
    setReviewFoodName("");
    if (created) addReviewToStore(created.day, created);
    Alert.alert("등록 완료", "식단이 성공적으로 등록되었습니다.", [
      { text: "확인", style: "cancel" },
      {
        text: "식단기록 화면으로 이동",
        onPress: () => navigation.navigate("DietLog"),
      },
    ]);
    return true;
  };

  const likedItems = useFoodStore(useShallow(selectLikedFoodItems));
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

  const modeFilteredItems = useMemo(() => {
    if (loading) return [];
    const filtered = likedItems.filter(
      (item) => item.food.speed.includes(mode) || item.food.speed === "both",
    );
    return shuffleArray(filtered).slice(0, 4);
  }, [likedItems, mode, loading]);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <View style={styles.heartBorder}>
          <View style={[styles.heartContainer, { backgroundColor: modeColor }]}>
            <HeartIcon
              size={14}
              fillColor={Colors.background_white}
              strokeWidth={0}
            />
          </View>
        </View>
        <Text style={styles.questionText}>
          <Text style={{ color: modeColor }}>찜해둔 메뉴&nbsp;</Text>
          중에서 골라볼까요?
        </Text>
      </View>

      {modeFilteredItems.length === 0 ? (
        <View
          style={[
            styles.row,
            { height: 60, justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Text style={styles.placeholderText}>음식의&nbsp;</Text>
          <HeartIcon size={15} fillColor={modeColor} strokeWidth={0} />
          <Text style={styles.placeholderText}>
            를 눌러 음식을&nbsp;
            <Text
              style={{
                color: modeColor,
                fontFamily: "NanumSquareRoundEB",
              }}
            >
              찜해보세요!
            </Text>
          </Text>
        </View>
      ) : (
        <View style={styles.row}>
          <View style={styles.foodsContainer}>
            {modeFilteredItems.map((item) => (
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
      )}

      <ReanimatedModal visible={showInfo} onClose={() => setShowInfo(false)}>
        <FoodInfoModal
          foodID={selectedFoodID}
          onClose={() => setShowInfo(false)}
          onCreateReview={handleCreateReview}
        />
      </ReanimatedModal>

      <ReanimatedModal
        visible={showReviewModal}
        onClose={() => setShowReviewModal(false)}
      >
        <CreateReviewModal
          onClose={() => setShowReviewModal(false)}
          foodNames={[reviewFoodName]}
          onCreateSuccess={handleReviewSuccess}
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
    color: Colors.burn,
    fontSize: 16,
    fontFamily: "NanumSquareRoundEB",
    letterSpacing: -0.3,
  },
  placeholderText: {
    color: Colors.slightly_burn,
    fontSize: 13,
    fontFamily: "NanumSquareRoundB",
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
  foodImage: {
    width: "92%",
    height: "92%",
    borderRadius: 99,
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
});
