import { useEffect, useRef, useMemo, useState, useCallback } from "react";
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
  setDynamicFeatureFlag,
} from "react-native-reanimated";
import Modal from "react-native-modal";
import { LinearGradient } from "expo-linear-gradient";
import useAuthStore from "../stores/authStore";
import { fetchReviewsByDay } from "../services/review";
import Colors from "../constants/colors";
import MarshmallowStick from "../components/DietLogScreen/MarshmallowStick";
import FoodSelectModal from "../components/DietLogScreen/FoodSelectModal";
import ReviewCard from "../components/DietLogScreen/ReviewCard";
import CreateReviewModal from "../components/DietLogScreen/CreateReviewModal";

//weekandday 동기화
import { useFocusEffect } from "@react-navigation/native";
import { syncUserWeekAndDay } from "../services/user";

const DietLogScreen = () => {
  // 추가버튼 관련
  const { user } = useAuthStore();

  const [displayMonth, setDisplayMonth] = useState(null);
  const [weekDates, setWeekDates] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [selectedMode, setSelectedMode] = useState("fast"); // 'fast' | 'slow'
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [activeModal, setActiveModal] = useState("none");
  const [nextModal, setNextModal] = useState(null);
  const [back, setBack] = useState(false);

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

  const userDay = user?.day || 1;
  const initialWeek = Math.ceil(userDay / 7);
  const initialDay = ((userDay - 1) % 7) + 1;
  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [currentMaxWeek, setCurrentMaxWeek] = useState(initialWeek);
  const [selectedWeek, setSelectedWeek] = useState(initialWeek);
  // 리뷰 가져오기
  const [dailyReviews, setDailyReviews] = useState([]);
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  // 이 부분 좀 정리 필요
  useFocusEffect(
    useCallback(() => {
      let alive = true;

      (async () => {
        const uid = user?.uid;
        if (!uid) return;

        try {
          await syncUserWeekAndDay(uid);
        } catch (e) {
          console.log("syncUserWeek failed:", e);
        }

        // user의 day/week 읽어서 selectedWeek 세팅
        try {
          const userDay = user?.day ?? 1;

          const calculatedWeek = Math.ceil(userDay / 7);
          const currentDayofThisWeek = ((userDay - 1) % 7) + 1;
          if (alive) {
            setCurrentMaxWeek(calculatedWeek);
            setSelectedWeek(calculatedWeek);
            setSelectedDay(currentDayofThisWeek);
          }
        } catch (e) {
          console.log("getUserWeek failed:", e);
        }
      })();

      return () => {
        alive = false;
      };
    }, [user])
  );

  useEffect(() => {
    if (!user?.createdAt) return;
    const startDate = new Date(user.createdAt);
    const weekStartOffset = (selectedWeek - 1) * 7;
    startDate.setDate(startDate.getDate() + weekStartOffset);

    setDisplayMonth(startDate.getMonth() + 1);
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date.getDate());
    }
    setWeekDates(dates);
  }, [selectedWeek, user?.createdAt]);

  useEffect(() => {
    const fetchDailyData = async () => {
      const targetAbsoluteDay = (selectedWeek - 1) * 7 + selectedDay;
      console.log(
        `Fetching reviews for Week ${selectedWeek}, Day ${selectedDay} (Absolute: ${targetAbsoluteDay})`
      );
      try {
        const reviews = await fetchReviewsByDay(targetAbsoluteDay);
        setDailyReviews(reviews || []);
      } catch (e) {
        console.log("Failed to fetch reviews for day:", e);
        setDailyReviews([]);
      }
    };

    fetchDailyData();
  }, [selectedWeek, selectedDay]);

  const handleMarshmallowClick = (offset) => {
    const targetWeek = currentMaxWeek - offset;
    if (targetWeek < 1) {
      return;
    }

    setSelectedWeek(targetWeek);
    setSelectedDay(1);
  };

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

  const handleSelectFood = (foods, mode) => {
    setSelectedFoods(foods);
    setSelectedMode(mode);
    setSelectedReviewId(null);
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

  const handleEditReview = (reviewId) => {
    setSelectedReviewId(reviewId);
    setActiveModal("review");
  };

  return (
    <LinearGradient colors={["#FFFFFF", "#CCCCCC"]} style={styles.container}>
      <MarshmallowStick
        currentMaxWeek={currentMaxWeek}
        selectedWeek={selectedWeek}
        onClick={handleMarshmallowClick}
      />

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
            <Text style={styles.monthText}>{displayMonth}월</Text>

            <View style={styles.dayContainer}>
              {[1, 2, 3, 4, 5, 6, 7].map((num, index) => (
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
                    {weekDates[index]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <FlatList
              data={dailyReviews}
              style={{ width: "100%" }}
              renderItem={({ item }) => (
                <ReviewCard review={item} onEdit={handleEditReview} />
              )}
              // 데이터가 없을 때 표시할 UI (옵션)
              ListEmptyComponent={() => (
                <View style={{ alignItems: "center", marginTop: 50 }}>
                  <Text style={{ color: "#999", fontFamily: "NanumSquareR" }}>
                    기록된 식단이 없습니다.
                  </Text>
                </View>
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
        <FoodSelectModal
          onClose={handleCloseModal}
          onSelect={(foods, mode) => {
            handleSelectFood(foods, mode);
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
        <CreateReviewModal
          onClose={handleCloseModal}
          onBack={handleBack}
          foods={selectedFoods}
          reviewMode={selectedMode}
          intent={selectedReviewId ? "edit" : "create"}
          reviewId={selectedReviewId}
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
