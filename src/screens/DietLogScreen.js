import { useEffect, useState, useCallback, useMemo } from "react";
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
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  useSharedValue,
  withTiming,
  Easing,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import { useMainAnimations } from "../hooks/useMainAnimations";
import { GestureDetector } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Modal from "react-native-modal";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthStore } from "../stores/authStore";
import { useReviewStore } from "../stores/reviewStore";
import Colors from "../constants/colors";
import MarshmallowStick from "../components/DietLogScreen/MarshmallowStick";
import FoodSelectModal from "../components/DietLogScreen/FoodSelectModal";
import ReviewCard from "../components/DietLogScreen/ReviewCard";
import CreateReviewModal from "../components/DietLogScreen/CreateReviewModal";
import UpdateReviewModal from "../components/DietLogScreen/UpdateReviewModal";
import BackButton from "../components/DietLogScreen/BackButton";
import BellIcon from "../assets/icons/bell.svg";
import SettingsIcon from "../assets/icons/settings.svg";
import Back from "../assets/icons/back.svg";
import HeartIcon from "../components/svg/HeartIcon";
import PlusIcon from "../assets/icons/plus.svg";
import { BlurView } from "expo-blur";
import PointerIcon from "../assets/icons/pointer.svg";

const HEADER_HEIGHT = 48;
const SHEET_HANDLE_HEIGHT = 260;
const SHEET_OPEN_MARGIN = 32;

const EMPTY_ARRAY = [];

const MEAL_ORDER = {
  아침: 1,
  점심: 2,
  저녁: 3,
  기타: 4,
};

const DietLogScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const SHEET_MAX_HEIGHT =
    screenHeight - insets.top - HEADER_HEIGHT - SHEET_OPEN_MARGIN;
  const scrollThreshold = SHEET_MAX_HEIGHT - SHEET_HANDLE_HEIGHT;
  const { animatedStyles, panGesture, scrollY } =
    useMainAnimations(scrollThreshold);

  // 바텀시트 애니메이션 관련
  const animatedFloatingButtons = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, scrollThreshold],
      [0, 220],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ translateY }],
    };
  });
  const animatedReviewCardList = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, scrollThreshold],
      [0, -60],
      Extrapolation.CLAMP,
    );

    return { transform: [{ translateY }] };
  });
  const animatedReviewCountText = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, scrollThreshold * 0.7],
      [1, 0],
      Extrapolation.CLAMP,
    );

    return { opacity };
  });

  const user = useAuthStore((state) => state.user);
  const [selectedFoods, setSelectedFoods] = useState([]);

  const [activeModal, setActiveModal] = useState("none");
  const [nextModal, setNextModal] = useState(null);
  const [back, setBack] = useState(false);

  const userDay = user?.day || 1;
  const initialWeek = user?.week || Math.ceil(userDay / 7);
  const initialDay = ((userDay - 1) % 7) + 1;
  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [selectedWeek, setSelectedWeek] = useState(initialWeek);
  const targetAbsoluteDay = (selectedWeek - 1) * 7 + selectedDay;

  const dailyReviews = useReviewStore(
    (state) => state.reviewsByDay[targetAbsoluteDay] || EMPTY_ARRAY,
  );
  const isReviewLoading = useReviewStore((state) => state.isLoading);
  const {
    getReviewsForDay,
    addReviewToStore,
    updateReviewInStore,
    deleteReviewFromStore,
  } = useReviewStore();

  const sortedDailyReviews = useMemo(() => {
    return [...dailyReviews].sort((a, b) => {
      const orderA = MEAL_ORDER[a.mealTime] || 99;
      const orderB = MEAL_ORDER[b.mealTime] || 99;
      return orderA - orderB;
    });
  }, [dailyReviews]);

  useEffect(() => {
    const loadData = async () => {
      await getReviewsForDay(targetAbsoluteDay);
    };
    if (targetAbsoluteDay <= user?.day) loadData();
  }, [targetAbsoluteDay, getReviewsForDay]);

  // 날짜 바 애니메이션 관련
  const isCurrentWeek = selectedWeek === initialWeek;
  const dayWidth = (screenWidth - 36) / 7;
  const pointerOffset = (initialDay - 1) * dayWidth + dayWidth / 2 - 7;

  const ratio = (day) => {
    return Math.min(day / 7 + (7 - day) / 280, 1);
  };

  const fillWidth = useSharedValue(ratio(selectedDay) * 100);
  const borderRadiusRight = useSharedValue(32);

  useEffect(() => {
    const fillRatio = ratio(selectedDay);
    fillWidth.value = withTiming(fillRatio * 100, {
      duration: 400,
      easing: Easing.inOut(Easing.quad),
    });

    const targetRadius = selectedDay === 7 ? 16 : 32;
    borderRadiusRight.value = withTiming(targetRadius, {
      duration: 400,
      easing: Easing.inOut(Easing.quad),
    });
  }, [selectedDay]);

  const animatedFillWidth = useAnimatedStyle(() => {
    return {
      width: `${fillWidth.value}%`,
      borderTopRightRadius: borderRadiusRight.value,
      borderBottomRightRadius: borderRadiusRight.value,
    };
  });

  const animatedGradientRadius = useAnimatedStyle(() => {
    return {
      borderTopRightRadius: borderRadiusRight.value,
      borderBottomRightRadius: borderRadiusRight.value,
    };
  });

  // Day/Week을 바탕으로 실제 표시 날짜 계산
  const [weekDates, setWeekDates] = useState([]);
  const [displayWeekText, setDisplayWeekText] = useState("");

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

  useEffect(() => {
    if (!user?.createdAt) return;

    const startDate = new Date(user.createdAt);
    const weekStartOffset = (selectedWeek - 1) * 7;
    startDate.setDate(startDate.getDate() + weekStartOffset);

    const startMonth = startDate.getMonth() + 1;
    const startWeek = getWeekOfMonth(startDate);

    setDisplayWeekText(`${startMonth}월 ${weekOrdinalKorean(startWeek)}주`);

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date.getDate());
    }
    setWeekDates(dates);
  }, [selectedWeek, user?.createdAt]);

  const handleMarshmallowClick = (offset) => {
    const targetWeek = initialWeek - offset;
    if (targetWeek < 1) {
      return;
    }
    if (targetWeek !== selectedWeek) setSelectedDay(1);
    setSelectedWeek(targetWeek);
  };

  // 리뷰 로직 관련
  const handleUpdateReview = (reviewID) => {
    const target = dailyReviews.find((r) => r.id === reviewID);
    if (!target) {
      console.log("Review not found for ID:", reviewID);
      return;
    }
    console.log("Editing review with ID:", reviewID);
    setEditingReview(target);
    setActiveUpdateModal(true);
  };

  const handleDeleteReview = (reviewID) => {
    deleteReviewFromStore(targetAbsoluteDay, reviewID);
  };

  const handleCreateSuccess = (createdReview) => {
    if (createdReview) {
      addReviewToStore(targetAbsoluteDay, createdReview);
    }
    setActiveModal("none");
    setSelectedFoods([]);
  };

  const handleUpdateSuccess = (updatedReview) => {
    if (updatedReview) {
      updateReviewInStore(targetAbsoluteDay, updatedReview);
    }
    setActiveUpdateModal(false);
    setEditingReview(null);
  };

  // 모달 로직 관련
  const [activeUpdateModal, setActiveUpdateModal] = useState("none");
  const [editingReview, setEditingReview] = useState(null);

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

  return (
    <GestureDetector gesture={panGesture}>
      <LinearGradient
        colors={["#F5F4F2", "rgb(208, 208, 208)"]}
        style={styles.container}
      >
        {/* 헤더 */}
        <BlurView style={styles.headerContainer} intensity={50} tint="light">
          <View style={{ width: "100%", height: insets.top }} />

          <View style={styles.headerContent}>
            <Text style={styles.logoText}>밥땡</Text>
            <View style={styles.headerIcons}>
              <TouchableOpacity onPress={() => {}}>
                <BellIcon color={Colors.yellow} width={24} height={24} />
                <View style={styles.notificationCircle} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("Setting")}>
                <SettingsIcon color={Colors.yellow} width={24} height={24} />
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>

        <MarshmallowStick onClick={handleMarshmallowClick} />

        <Animated.View
          style={[styles.floatingButtonsContainer, animatedFloatingButtons]}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("Liked")}
            style={styles.redButton}
          >
            <HeartIcon
              size={26}
              fillColor={Colors.background_white}
              strokeWidth={0}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveModal("foodSelect")}
            style={styles.redButton}
          >
            <PlusIcon width={24} height={24} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={[
            styles.bottomSheetWrapper,
            { height: SHEET_MAX_HEIGHT },
            animatedStyles.bottomSheet,
          ]}
        >
          <View style={styles.innerSheetContainer}>
            <View style={styles.handleBar} />
            <Text style={styles.sheetTitleText}>주간 식단기록</Text>

            <Text style={styles.monthText}>
              {displayWeekText}{" "}
              <Text
                style={{
                  fontFamily: "NanumSquareRoundB",
                  color: "#e3d3d2",
                  letterSpacing: -0.3,
                }}
              >
                [{user.week}주차]
              </Text>
            </Text>

            {/* 요일 선택 바 */}
            <View style={[styles.dayContainer, { zIndex: 999 }]}>
              <View
                style={[styles.dayTextContainer, { width: screenWidth - 28 }]}
              >
                {[1, 2, 3, 4, 5, 6, 7].map((num, index) => {
                  return (
                    <TouchableOpacity
                      key={num}
                      style={styles.dayButton}
                      onPress={() => setSelectedDay(num)}
                      activeOpacity={1}
                    >
                      <Text style={styles.dayText}>{weekDates[index]}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Animated.View style={[styles.dayFill, animatedFillWidth]}>
                <Animated.View
                  style={[styles.gradientContainer, animatedGradientRadius]}
                >
                  <LinearGradient
                    colors={["#FF5A2C", "#E90C05"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.redGradient}
                  />
                </Animated.View>
                <View
                  style={[styles.dayTextContainer, { width: screenWidth - 28 }]}
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((num, index) => {
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
                            { color: Colors.background_white },
                          ]}
                        >
                          {weekDates[index]}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </Animated.View>
            </View>

            <View style={{ width: screenWidth - 28, height: 28 }}>
              {isCurrentWeek && (
                <Animated.View
                  entering={FadeIn.duration(400)}
                  exiting={FadeOut.duration(300)}
                  style={[styles.todayContainer, { left: pointerOffset }]}
                >
                  <PointerIcon width={12} height={12} />
                  <Text style={styles.todayText}>오늘</Text>
                </Animated.View>
              )}
            </View>

            <Animated.Text
              style={[styles.recordCountText, animatedReviewCountText]}
            >
              {sortedDailyReviews.length === 0
                ? "기록된 식단이 없어요."
                : `${sortedDailyReviews.length}개의 식단 기록을 남겼어요!`}
            </Animated.Text>

            <Animated.View
              style={[
                animatedReviewCardList,
                { flex: 1, width: "100%", height: "100%" },
              ]}
            >
              <FlatList
                data={sortedDailyReviews}
                style={{ width: "100%", marginTop: 40 }}
                renderItem={({ item }) => (
                  <ReviewCard
                    review={item}
                    onEdit={handleUpdateReview}
                    onDelete={handleDeleteReview}
                  />
                )}
                ListEmptyComponent={() => (
                  <View style={{ alignItems: "center", marginTop: 50 }}>
                    {isReviewLoading ? (
                      <Text style={styles.placeholderText}>로딩중...</Text>
                    ) : (
                      <Text style={styles.placeholderText}>
                        기록된 식단이 없습니다.{"\n"}
                        <Text style={styles.placeholderRed}>
                          +를 눌러 오늘 먹은 음식을 추가해보세요!
                        </Text>
                      </Text>
                    )}
                  </View>
                )}
                showsVerticalScrollIndicator={false}
              />
            </Animated.View>
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
          avoidKeyboard={true}
        >
          <Pressable style={styles.backdrop} onPress={handleCloseModal} />
          <CreateReviewModal
            onClose={handleCloseModal}
            onBack={handleBack}
            foodNames={selectedFoods}
            onCreateSuccess={handleCreateSuccess}
          />
        </Modal>

        <Modal
          isVisible={activeUpdateModal === true}
          animationIn="fadeIn"
          animationOut="fadeOut"
          backdropOpacity={0}
          onModalHide={() => setEditingReview(null)}
          style={{ margin: 0 }}
        >
          <Pressable
            style={styles.backdrop}
            onPress={() => setActiveUpdateModal(false)}
          />
          <UpdateReviewModal
            onClose={() => setActiveUpdateModal(false)}
            existingReview={editingReview}
            onUpdateSuccess={handleUpdateSuccess}
          />
        </Modal>

        <BackButton
          index={5.5}
          icon={<Back width={52} height={52} />}
          onPress={() => navigation.goBack()}
        />
      </LinearGradient>
    </GestureDetector>
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
    right: 16,
    bottom: SHEET_HANDLE_HEIGHT + 8,
    zIndex: 100,
    alignItems: "center",
    gap: 5,
  },
  todayContainer: {
    position: "absolute",
    top: 0,
    alignItems: "center",
    gap: 4,
    zIndex: 100,
  },
  todayText: {
    fontFamily: "NanumSquareRoundEB",
    fontSize: 14,
    color: Colors.point_red,
    letterSpacing: -0.3,
  },
  recordCountText: {
    marginTop: 16,
    fontFamily: "NanumSquareR",
    fontSize: 13,
    color: Colors.text_gray,
  },
  redButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.point_red,
    width: 44,
    height: 44,
    borderColor: Colors.background_yellow,
    borderWidth: 1.5,
    borderRadius: 28,
    boxShadow: "0 2px 0 1px rgba(204, 204, 204, 0.25)",
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
  monthText: {
    position: "absolute",
    left: 24,
    top: 80,
    bottom: 12,
    fontFamily: "NanumSquareRoundEB",
    fontSize: 16,
    color: Colors.text_gray,
  },
  dayContainer: {
    marginTop: 43,
    marginBottom: 10,
    width: "100%",
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderColor: Colors.text_gray,
    borderWidth: 1.5,
    borderRadius: 18,
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 2px 0 0 #FDEDC0",
  },
  dayTextContainer: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  dayTextFilled: {
    color: Colors.background_white,
  },
  dayFill: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    borderRadius: 16,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    overflow: "hidden",
  },
  gradientContainer: {
    position: "absolute",
    flex: 1,
    left: 1.5,
    right: 2,
    top: 1.5,
    bottom: 2,
    borderRadius: 16,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    overflow: "hidden",
  },
  redGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  dayButton: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 0,
  },
  dayText: {
    color: Colors.burn,
    fontSize: 28,
    fontFamily: "NanumSquareB",
    letterSpacing: -0.5,
  },
  backdrop: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  placeholderText: {
    color: Colors.text_gray,
    fontFamily: "NanumSquareR",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 32,
  },
  placeholderRed: {
    color: Colors.point_red,
    fontFamily: "NanumSquareRoundB",
    letterSpacing: -0.3,
  },
});
