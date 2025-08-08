import { useEffect, useRef, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import Colors from "../styles/colors";
import MarshmallowStick from "../components/DietLogScreen/MarshmallowStick";
import FoodSelectBox from "../components/DietLogScreen/FoodSelectBox";
import ReviewBox from "../components/DietLogScreen/ReviewBox";
import ReviewStar from "../components/svg/ReviewStar";

const DietLogScreen = () => {
  // 추가버튼 관련
  const [inputValue, setInputValue] = useState("");
  const [selectedFoodItem, setSelectedFoodItem] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  // BottomSheet 관련 설정
  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => [660], []);
  const sheetPosition = useSharedValue(0);
  const animatedTextStyle = useAnimatedStyle(() => {
    const fontSize = interpolate(
      sheetPosition.value,
      [0, 1],
      [30, 40],
      "clamp"
    );
    return {
      fontSize,
    };
  });

  // 나중에 초기값 받아와서 설정 필요
  const [selectedDay, setSelectedDay] = useState(1);

  // 리뷰 가져오기
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    const fetchUserReviews = async () => {
      const user = auth.currentUser;

      console.log("Fetching user reviews for:", user?.uid);

      if (!user) return;

      const docSnap = await getDoc(doc(db, "userReviews", user.uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setReviews(data.reviews || []);
      }
    };

    fetchUserReviews();
  }, []);

  const filteredReviews = reviews.filter(
    (review) => review.day === selectedDay
  );

  console.log(selectedDay);
  useEffect(() => {
    console.log("reviews changed:", reviews);
  }, [reviews]);

  return (
    <LinearGradient colors={["#FFFFFF", "#CCCCCC"]} style={styles.container}>
      <MarshmallowStick />

      <TouchableOpacity
        onPress={() => setActiveModal("foodSelect")}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>추가</Text>
      </TouchableOpacity>

      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        handleComponent={() => null}
        onAnimate={(fromIndex, toIndex) => {
          sheetPosition.value = withTiming(toIndex, {
            duration: 500,
            easing: Easing.out(Easing.exp),
          });
          setIsSheetOpen(toIndex > 0);
        }}
        backgroundComponent={() => (
          <View style={{ backgroundColor: "transparent" }} />
        )}
      >
        <BottomSheetView style={styles.sheetContainer}>
          <View style={styles.innerSheetContainer}>
            <View style={styles.sheetIndicator} />

            <Animated.Text style={[styles.sheetTitleText, animatedTextStyle]}>
              주간 식단기록
            </Animated.Text>

            {activeModal === "foodSelect" && (
              <FoodSelectBox
                onClose={() => setActiveModal(null)}
                onSelect={(foodName) => {
                  setActiveModal(null);

                  setTimeout(() => {
                    setSelectedFoodItem({ name: foodName });
                    setActiveModal("review");
                  }, 200);
                }}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
            )}

            {activeModal === "review" && (
              <ReviewBox
                onClose={() => setActiveModal(null)}
                item={selectedFoodItem}
                mode="fast"
              />
            )}
            <View style={styles.dayContainer}>
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <TouchableOpacity
                  key={num}
                  onPress={() => setSelectedDay(num)}
                  activeOpacity={1}
                  style={[
                    styles.dayButton,
                    selectedDay === num && { backgroundColor: "#521210" },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      selectedDay === num && { color: "white" },
                    ]}
                  >
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <ScrollView
              style={{ width: "100%" }}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              {isSheetOpen &&
                filteredReviews.map((review, index) => (
                  <View key={index} style={styles.reviewCard}>
                    <Text style={styles.reviewText}>
                      {review.times?.join(", ")}으로{" "}
                      <Text style={styles.foodText}>{review.food}</Text>을(를)
                      먹었어요!
                    </Text>

                    <View style={styles.starRow}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <ReviewStar
                          key={i}
                          fill={review.rating >= i ? Colors.point_red : "white"}
                        />
                      ))}
                    </View>

                    {review.imageUri && (
                      <Image
                        source={{ uri: review.imageUri }}
                        style={styles.reviewImage}
                      />
                    )}

                    <Text style={styles.tagText}>
                      {review.situations?.map((tag) => `#${tag}`).join(" ")}
                    </Text>

                    <Text style={styles.commentText}>“{review.comment}”</Text>
                  </View>
                ))}
            </ScrollView>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </LinearGradient>
  );
};

export default DietLogScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#F5F4F2",
  },
  addButton: {
    position: "absolute",
    top: 30,
    right: 25,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.burn,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 22,
    fontFamily: "NanumSquareB",
  },
  sheetContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    height: 260,
  },
  innerSheetContainer: {
    width: "100%",
    minHeight: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 13,

    backgroundColor: "white",
    borderRadius: 40,
  },
  sheetIndicator: {
    width: 144,
    height: 5,
    marginTop: 12,

    backgroundColor: "#D9D9D9",
    borderRadius: 2.5,
  },
  sheetTitleText: {
    marginTop: 20,
    fontFamily: "NanumSquareEB",
    color: Colors.burn,
  },
  dayContainer: {
    marginTop: 43,
    width: "100%",
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#D9D9D9",
    borderWidth: 1,
    borderRadius: 13,
  },
  dayButton: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 0,
    borderRadius: 21,
  },
  dayText: {
    color: Colors.burn,
    fontSize: 36,
    fontFamily: "NanumSquareB",
    marginTop: 2,
  },
  reviewCard: {
    width: "100%",
    marginTop: 20,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    padding: 18,
    gap: 12,
    justifyContent: "center",
    backgroundColor: "#fff",
    alignItems: "center",
    alignSelf: "stretch",
  },
  reviewText: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: "NanumSquareB",
    fontWeight: 400,
    color: Colors.slightly_burn,
  },
  foodText: {
    fontSize: 18,
    fontFamily: "NanumSquareB",
    fontWeight: 400,
    color: Colors.burn,
  },
  starRow: {
    flexDirection: "row",
    gap: 3,
  },
  reviewImage: {
    height: 240,
    gap: 10,
    borderRadius: 13,
    margin: 12,
    alignSelf: "stretch",
  },
  tagText: {
    fontSize: 15,
    color: Colors.burn,
    fontWeight: 700,
    fontFamily: "NanumSquareB",
  },
  commentText: {
    fontSize: 13,
    fontFamily: "NanumSquareB",
    fontWeight: 400,
    color: "#BBB",
  },
});
