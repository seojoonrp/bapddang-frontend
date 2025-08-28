import { useEffect, useRef, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  FlatList,
} from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withTiming,
  Easing,
} from "react-native-reanimated";
import Modal from "react-native-modal";
import { getDoc, doc } from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";

import { db, auth } from "../services/firebase";
import Colors from "../styles/colors";
import MarshmallowStick from "../components/DietLogScreen/MarshmallowStick";
import FoodSelectBox from "../components/DietLogScreen/FoodSelectBox";
import ReviewCard from "../components/DietLogScreen/ReviewCard";
import ReviewBox from "../components/DietLogScreen/ReviewBox";

const DietLogScreen = () => {
  // 추가버튼 관련
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [activeModal, setActiveModal] = useState("none");
  const [nextModal, setNextModal] = useState(null);
  const [back, setBack] = useState(false);

  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
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

  const handleCloseModal = () => {
    setActiveModal("none");
  };

  const handleBack = () => {
    setActiveModal("none");
    setNextModal("foodSelect");
    setBack(true);
  };

  const handleHideFoodSelect = () => {
    if (nextModal) {
      setActiveModal(nextModal);
      setNextModal(null);
    } else {
      setSelectedFoods([]);
    }
  };

  const handleSelectFood = (foods) => {
    setSelectedFoods(foods);
    setActiveModal("none");
    setNextModal("review");
  };

  const handleHideReview = () => {
    if (!back) {
      setSelectedFoods([]);
      setActiveModal("none");
    } else {
      if (nextModal) {
        setActiveModal(nextModal);
        setNextModal(null);
      }
      setBack(false);
    }
  };
  const handleEditReview = (review, index) => {
    setSelectedReview(review);
    setActiveModal("review");
    setSelectedIndex(index);
  };
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

            <FlatList
              data={filteredReviews}
              style={{ width: "100%" }}
              contentContainerStyle={{ flexGrow: 1 }}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <ReviewCard
                  review={item}
                  index={index}
                  onEdit={handleEditReview}
                />
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </BottomSheetView>
      </BottomSheet>

      <Modal
        isVisible={activeModal === "foodSelect"}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropOpacity={0}
        onModalHide={handleHideFoodSelect}
        style={{ margin: 0 }}
      >
        <Pressable style={styles.backdrop} onPress={handleCloseModal} />
        <FoodSelectBox
          onClose={handleCloseModal}
          onSelect={(foods) => {
            handleSelectFood(foods);
          }}
          initialFoods={selectedFoods}
        />
      </Modal>

      <Modal
        isVisible={activeModal === "review"}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropOpacity={0}
        onModalHide={handleHideReview}
        style={{ margin: 0 }}
      >
        <Pressable style={styles.backdrop} onPress={handleCloseModal} />
        <ReviewBox
          onClose={handleCloseModal}
          onBack={handleBack}
          foods={selectedFoods}
          mode="fast"
          intent={selectedReview ? "edit" : "create"} // ★ 수정 여부
          reviewIndex={selectedIndex} // ★ 배열 인덱스
          initialReview={selectedReview}
        />
      </Modal>
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
    marginBottom: 10,
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
  backdrop: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
