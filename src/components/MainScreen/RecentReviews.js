// src/components/MainScreen/RecentReviews.js

import { View, Text, StyleSheet } from "react-native";
import Colors from "../../constants/colors";
import CheckIcon from "../../assets/icons/check.svg";
import RecentReviewCard from "./RecentReviewCard";
import { useEffect, useState } from "react";
import { fetchRecentReviews } from "../../services/review";
import ReanimatedModal from "../common/ReanimatedModal";
import FoodInfoModal from "./FoodInfoModal";
import { useFoodStore } from "../../stores/foodStore";

const RecentReviews = () => {
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

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <View style={styles.checkBorder}>
          <View style={styles.checkContainer}>
            <CheckIcon width={18} height={18} />
          </View>
        </View>
        <Text style={styles.questionText}>
          <Text style={{ color: Colors.point_red }}>지금 선택받은 메뉴</Text>
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
    fontSize: 16,
    fontFamily: "NanumSquareRoundEB",
    color: Colors.burn,
  },
  cardContainer: {
    width: "100%",
    marginTop: 8,
    gap: 12,
  },
});
