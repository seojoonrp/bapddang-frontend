import { useEffect, useRef, useMemo, useState, useCallback} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  FlatList,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withSpring,
  Extrapolation,
} from "react-native-reanimated";
import { useMainAnimations } from "../hooks/useMainAnimations";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Modal from "react-native-modal";
import { LinearGradient } from "expo-linear-gradient";
import useAuthStore from "../stores/authStore";
import { fetchReviewsByDay } from "../services/review";
import { syncUserWeekAndDay } from "../services/user";
import Colors from "../constants/colors";
import MarshmallowStick from "../components/DietLogScreen/MarshmallowStick";
import FoodSelectModal from "../components/DietLogScreen/FoodSelectModal";
import ReviewCard from "../components/DietLogScreen/ReviewCard";
import CreateReviewModal from "../components/DietLogScreen/CreateReviewModal";
import DebugButton from "../components/DebugButton";
import BellIcon from "../assets/icons/bell.svg";
import SettingsIcon from "../assets/icons/settings.svg";
import Review from "../components/svg/Review.svg";
import Liked from "../components/svg/Liked.svg";

const HEADER_HEIGHT = 48;
const SHEET_HANDLE_HEIGHT = 220;
const SHEET_OPEN_MARGIN = 32;

const DietLogScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const SHEET_MAX_HEIGHT =
    screenHeight - insets.top - HEADER_HEIGHT - SHEET_OPEN_MARGIN;
  const scrollThreshold = SHEET_MAX_HEIGHT - SHEET_HANDLE_HEIGHT;
  const { animatedStyles, panGesture, scrollY } = useMainAnimations(scrollThreshold);

  const animatedFloatingButtons = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, scrollThreshold],
      [0, 180], 
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY }],
    };
  });

  // 추가버튼 관련
  const user = useAuthStore((state) => state.user);

  const [displayMonth, setDisplayMonth] = useState(null);
  const [displayWeekofMonth, setDisplayWeekofMonth] = useState(null);
  const [weekDates, setWeekDates] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [selectedMode, setSelectedMode] = useState("fast"); // 'fast' | 'slow'
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [activeModal, setActiveModal] = useState("none");
  const [nextModal, setNextModal] = useState(null);
  const [back, setBack] = useState(false);

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
          const userDay = user?.day ?? 1;
          console.log("User day on focus:", userDay);
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
    }, [user]),
  );

  useEffect(() => {
    if (!user?.createdAt) return;
    const startDate = new Date(user.createdAt);
    const weekStartOffset = (selectedWeek - 1) * 7;
    startDate.setDate(startDate.getDate() + weekStartOffset);

    setDisplayMonth(startDate.getMonth() + 1);
    const today = new Date();
    setDisplayWeekofMonth(getWeekOfMonth(today));
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
        `Fetching reviews for Week ${selectedWeek}, Day ${selectedDay} (Absolute: ${targetAbsoluteDay})`,
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
    console.log("Editing review with ID:", reviewId);
    return; // temp

    setSelectedReviewId(reviewId);
    setActiveModal("review");
  };
  const getWeekOfMonth = (date) => {
    const y = date.getFullYear();
    const m = date.getMonth();

    const firstOfMonth = new Date(y, m, 1);
    const firstDowMon0 = (firstOfMonth.getDay() + 6) % 7;

    return Math.floor((firstDowMon0 + (date.getDate() - 1)) / 7) + 1;
  };

  const weekOrdinalKorean = (n) => {
    const names = ["첫째", "둘째", "셋째", "넷째", "다섯째", "여섯째"];
    return names[n - 1] ?? `${n}째`;
  };
  const fillRatio = Math.min(1, (selectedDay) / 7);
  return (
    <GestureDetector gesture={panGesture}>
      <LinearGradient colors={["#FFFFFF", "#CCCCCC"]} style={styles.container}>
        {/* 헤더 */}
        <View style={styles.headerContainer}>
          <View style={{ width: "100%", height: insets.top }} />

          <View style={styles.headerContent}>
            <Text style={styles.logoText}>밥땡</Text>
            <View style={styles.headerIcons}>
              <TouchableOpacity onPress={() => { }}>
                <BellIcon color={Colors.yellow} width={24} height={24} />
                <View style={styles.notificationCircle} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { }}>
                <SettingsIcon color={Colors.yellow} width={24} height={24} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <MarshmallowStick
          currentMaxWeek={currentMaxWeek}
          selectedWeek={selectedWeek}
          onClick={handleMarshmallowClick}
        />
        <Animated.View style={[styles.floatingButtonsContainer, animatedFloatingButtons]}>
          <TouchableOpacity
            onPress={() => setActiveModal("foodSelect")}
            style={styles.LikeButton}
          >
            <Liked />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveModal("foodSelect")}
            style={styles.reviewButton}
          >
            <Review />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={[
            styles.bottomSheetWrapper,
            animatedStyles.bottomSheet, // 공통 스타일 적용
          ]}
        >
          <View style={styles.innerSheetContainer}>
            <View style={styles.handleBar} />
            <Text style={styles.sheetTitleText}>주간 식단기록</Text>
            <Text style={styles.monthText}>{displayMonth}월 {`${weekOrdinalKorean(displayWeekofMonth)}주`}</Text>
            <View style={styles.dayContainer}>
              <LinearGradient
                colors={["#FF5A1F", "#E92F05", "#B51200"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.dayFill, { width: `${fillRatio * 100}%` }]}
              />
              {[1, 2, 3, 4, 5, 6, 7].map((num, index) => {
                const isFilled = num <= selectedDay;
                return (
                  <TouchableOpacity
                    key={num}
                    onPress={() => setSelectedDay(num)}
                    activeOpacity={1}
                    style={styles.dayButton}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        [styles.dayText, isFilled && styles.dayTextFilled]
                      ]}
                    >
                      {weekDates[index]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

        <FlatList
          data={dailyReviews}
          style={{ width: "100%" }}
          renderItem={({ item }) => (
            <ReviewCard review={item} onEdit={handleEditReview} />
          )}
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
    </Animated.View>

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
          foodNames={selectedFoods}
          reviewMode={selectedMode}
        />
      </Modal>

      <DebugButton
        index={1}
        label={"Go back"}
        onPress={() => {
          navigation.goBack();
        }}
      />
    </LinearGradient >
    </GestureDetector >
  );
};

export default DietLogScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 99,
    borderBottomColor: Colors.text_gray,
    borderBottomWidth: 0.3,

    backgroundColor: "rgba(255, 255, 255, 0.8)", // TODO : expo-blur (EAS 빌드 다시할때)
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    height: HEADER_HEIGHT,
  },
  logoText: {
    marginTop: -3,
    color: Colors.point_red,
    fontFamily: "KCCGanpan",
    fontSize: 32,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 15,
  },
  notificationCircle: {
    backgroundColor: Colors.point_red,
    position: "absolute",
    top: -2,
    right: -2,
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  floatingButtonsContainer: {
    position: "absolute",
    right: 20,
    bottom: SHEET_HANDLE_HEIGHT,
    zIndex: 100,  
    alignItems: "center",
  },
  LikeButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  reviewButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  sheetContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  bottomSheetWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 700,
    zIndex: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 1,
  },
  innerSheetContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 13,
    paddingTop: 8,
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleBar: {
    width: 36,
    height: 5,
    backgroundColor: Colors.slightly_burn,
    borderRadius: 99,
  },
  sheetTitleText: {
    marginTop: 20,
    fontFamily: "NanumSquareEB",
    fontSize: 28,
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

    position: "relative",
    overflow: "hidden",
  },
  monthText: {
    position: "absolute",
    width: 73,
    left: 30,
    top: 80,
    bottom: 14,
    fontFamily: "NanumSquareB",
    fontSize: 16,
    color: "#D2C0C0",
  },
  dayTextFilled: {
    color: "white",
  },
  dayFill: {
    position: "absolute",
    left: 2,
    top: 2,
    bottom: 2,
    borderRadius: 11,
    backgroundColor: Colors.point_red,
  },
  dayButton: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 0,
    borderRadius: 21,
  },
  dayText: {
    color: Colors.burn,
    fontSize: 28,
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
