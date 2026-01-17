import { useEffect, useRef, useMemo, useState, useCallback } from "react";
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

const HEADER_HEIGHT = 48;
const SHEET_HANDLE_HEIGHT = 220;
const SHEET_OPEN_MARGIN = 32;

const DietLogScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const SHEET_MAX_HEIGHT =
    screenHeight - insets.top - HEADER_HEIGHT - SHEET_OPEN_MARGIN;
  const SCROLL_THRESHOLD = SHEET_MAX_HEIGHT - SHEET_HANDLE_HEIGHT;
  const scrollY = useSharedValue(0);
  const startY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startY.value = scrollY.value;
    })
    .onUpdate((e) => {
      const newValue = startY.value - e.translationY;
      scrollY.value = Math.max(0, Math.min(newValue, SCROLL_THRESHOLD));
    })
    .onEnd((e) => {
      const velocity = -e.velocityY;
      let toValue = 0;
      if (
        velocity > 500 ||
        (scrollY.value > SCROLL_THRESHOLD / 2 && velocity > -500)
      ) {
        toValue = SCROLL_THRESHOLD;
      }
      scrollY.value = withSpring(toValue, {
        velocity: velocity,
        damping: 20,
        stiffness: 80,
        mass: 1.1,
        overshootClamping: true,
      });
    });

  const animatedBottomSheetStyle = useAnimatedStyle(() => {
    const shadowAlpha = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD * 0.9, SCROLL_THRESHOLD],
      [0.2, 0.2, 0],
      Extrapolation.CLAMP,
    );
    const elevationValue = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD * 0.9, SCROLL_THRESHOLD],
      [10, 10, 0],
      Extrapolation.CLAMP,
    );
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, SCROLL_THRESHOLD],
            [SCROLL_THRESHOLD, 0],
            Extrapolation.CLAMP,
          ),
        },
      ],
      shadowOpacity: shadowAlpha,
      elevation: elevationValue,
    };
  });

  // 추가버튼 관련
  const user = useAuthStore((state) => state.user);

  const [displayMonth, setDisplayMonth] = useState(null);
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
          await syncUserWeekAndDay();
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
    }, [user]),
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

  return (
    <LinearGradient colors={["#FFFFFF", "#CCCCCC"]} style={styles.container}>
      {/* 헤더 */}
      <View style={styles.headerContainer}>
        <View style={{ width: "100%", height: insets.top }} />

        <View style={styles.headerContent}>
          <Text style={styles.logoText}>밥땡</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => {}}>
              <BellIcon color={Colors.yellow} width={24} height={24} />
              <View style={styles.notificationCircle} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
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

      {/* 추가버튼 */}
      <TouchableOpacity
        onPress={() => setActiveModal("foodSelect")}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>추가</Text>
      </TouchableOpacity>

      {/* 바텀시트 */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.bottomSheetWrapper,
            { height: SHEET_MAX_HEIGHT },
            animatedBottomSheetStyle,
          ]}
        >
          <View style={styles.innerSheetContainer}>
            <View style={styles.handleBar} />
            <Text style={styles.sheetTitleText}>주간 식단기록</Text>
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
      </GestureDetector>

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
  addButton: {
    position: "absolute",
    top: 150,
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
  },
  bottomSheetWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    zIndex: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
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
