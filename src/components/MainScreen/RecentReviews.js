// src/components/MainScreen/RecentReviews.js

import { View, Text, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../constants/colors";
import CheckIcon from "../../assets/icons/check.svg";
import RecentReviewCard from "./RecentReviewCard";
import { useEffect, useState } from "react";
import { fetchRecentReviews } from "../../services/review";
import ReanimatedModal from "../common/ReanimatedModal";
import FoodInfoModal from "./FoodInfoModal";
import CreateReviewModal from "../DietLogScreen/CreateReviewModal";
import { useFoodStore } from "../../stores/foodStore";
import { useReviewStore } from "../../stores/reviewStore";
import { useModeStore } from "../../stores/modeStore";

const RecentReviews = () => {
  const navigation = useNavigation();
  const modeColor = useModeStore((state) => state.modeColor);

  const [reviewData, setReviewData] = useState([]);
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const data = await fetchRecentReviews();
        setReviewData(data);
      } catch (error) {
        console.log("Error fetching recent reviews:", error);
      }
    };

    fetchRecent();
  }, []);

  useEffect(() => {
    const updateFoodStore = async () => {
      const foods = reviewData.map((review) => review.food);
      useFoodStore.getState().setFoodsByID(foods);
    };

    updateFoodStore();
  }, [reviewData]);

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

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <View style={styles.checkBorder}>
          <View style={[styles.checkContainer, { backgroundColor: modeColor }]}>
            <CheckIcon width={18} height={18} />
          </View>
        </View>
        <Text style={styles.questionText}>
          <Text style={{ color: modeColor }}>지금 선택받은 메뉴</Text>
          에요!
        </Text>
      </View>

      <View style={styles.cardContainer}>
        {reviewData.map((review, index) => (
          <RecentReviewCard
            key={index}
            data={review}
            setSelectedFoodID={setSelectedFoodID}
            setShowInfo={setShowInfo}
          />
        ))}
      </View>

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

export default RecentReviews;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: 6,
  },
  checkBorder: {
    width: 28,
    height: 28,
    borderRadius: 99,
    borderColor: Colors.border_yellow,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  checkContainer: {
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
  cardContainer: {
    width: "100%",
    marginTop: 8,
    gap: 12,
  },
});
