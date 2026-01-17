// src/screens/MainScreen.js

import { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  interpolateColor,
  withSpring,
  Extrapolation,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import useFoodStore from "../stores/foodStore";
import { fetchMainFeedFoods } from "../services/food";
import { handleLogout } from "../services/auth";
import Hero from "../components/MainScreen/Hero";
import FoodCardNews from "../components/MainScreen/FoodCardNews";
import BellIcon from "../assets/icons/bell.svg";
import SettingsIcon from "../assets/icons/settings.svg";
import Colors from "../constants/colors";
import DebugButton from "../components/DebugButton";

const HEADER_HEIGHT = 48;
const BOTTOM_SHEET_HANDLE_HEIGHT = 90;
const HERO_MARGIN = 18;
const PAGINATION_HEIGHT = 32;

const MainScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const headerHeight = insets.top + HEADER_HEIGHT;
  const SCROLL_THRESHOLD =
    screenHeight - headerHeight - BOTTOM_SHEET_HANDLE_HEIGHT;

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
        damping: 20, // 튕기는 정도 -> 크게 상관없는듯
        stiffness: 90, // 부드러운 정도 (낮을수록 부드러움)
        mass: 1,
        overshootClamping: true,
      });
    });

  const {
    mainFeedFoods,
    setMainFeedFoodData,
    appendMainFeedFoodData,
    loadPersistedData,
    clearData,
  } = useFoodStore();
  const isFirstLoad = useRef(route.params?.from === "Landing");

  useEffect(() => {
    const initMainFeedFoods = async () => {
      setIsLoading(true);
      const savedData = await loadPersistedData();
      if (!savedData || isFirstLoad.current) {
        try {
          const data = await fetchMainFeedFoods({ speed: "fast", count: 7 });
          if (data.foods) await setMainFeedFoodData(data.foods, 0);
          isFirstLoad.current = false;
        } catch (e) {
          console.error(e);
        }
      }
      setIsLoading(false);
    };
    initMainFeedFoods();
  }, []);

  const [isExtraLoading, setIsExtraLoading] = useState(false);
  const handleLoadMore = async () => {
    if (isExtraLoading) return;
    setIsExtraLoading(true);
    try {
      const data = await fetchMainFeedFoods({ speed: "fast", count: 7 });
      if (data.foods) await appendMainFeedFoodData(data.foods);
    } finally {
      setIsExtraLoading(false);
    }
  };

  const animatedLogoStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      scrollY.value,
      [0, SCROLL_THRESHOLD],
      [Colors.point_red, Colors.yellow],
    ),
  }));

  const animatedIconOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const animatedHeaderLineStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD * 0.25],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  const animatedHeroStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, SCROLL_THRESHOLD],
          [0, -(headerHeight + HERO_MARGIN)],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const animatedBottomSheetStyle = useAnimatedStyle(() => ({
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
  }));

  const animatedCircleStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      scrollY.value,
      [0, SCROLL_THRESHOLD],
      [Colors.point_red, Colors.yellow],
    ),
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.headerContainer}>
          <Animated.Text style={[styles.logoText, animatedLogoStyle]}>
            밥땡
          </Animated.Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => {}}>
              <View>
                <BellIcon color={Colors.yellow} width={24} height={24} />
                <Animated.View
                  style={[StyleSheet.absoluteFill, animatedIconOverlayStyle]}
                >
                  <BellIcon
                    color={Colors.background_yellow}
                    width={24}
                    height={24}
                  />
                </Animated.View>
              </View>
              <Animated.View
                style={[styles.notificationCircle, animatedCircleStyle]}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <View>
                <SettingsIcon color={Colors.yellow} width={24} height={24} />
                <Animated.View
                  style={[StyleSheet.absoluteFill, animatedIconOverlayStyle]}
                >
                  <SettingsIcon
                    color={Colors.background_yellow}
                    width={24}
                    height={24}
                  />
                </Animated.View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <Animated.View style={[styles.headerLine, animatedHeaderLineStyle]} />

        <Animated.View
          style={[
            styles.heroContainer,
            { top: headerHeight + HERO_MARGIN },
            animatedHeroStyle,
          ]}
        >
          <Hero scrollY={scrollY} scrollThreshold={SCROLL_THRESHOLD} />
        </Animated.View>

        <View style={styles.middleContentContainer}>
          <View style={styles.textRow}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>점심식사</Text>
            </View>
            <Text style={styles.questionText}>를 고민 중인가요?</Text>
          </View>
          <FoodCardNews
            foodsData={mainFeedFoods}
            screenWidth={screenWidth}
            size={300}
            isLoading={isLoading}
            paginationHeight={PAGINATION_HEIGHT}
            onEndSwipe={handleLoadMore}
            isExtraLoading={isExtraLoading}
          />
        </View>

        <Animated.View
          style={[
            styles.bottomSheetWrapper,
            { height: SCROLL_THRESHOLD + BOTTOM_SHEET_HANDLE_HEIGHT },
            animatedBottomSheetStyle,
          ]}
        >
          <View style={styles.bottomSheetHandle}>
            <View style={styles.handleBar} />
            <Text style={styles.handleText}>
              카테고리별 추천 메뉴를 보려면 올려주세요!
            </Text>
          </View>
          <View style={styles.bottomSheetContent}>
            <Text>ㅎㅇ</Text>
          </View>
        </Animated.View>

        <DebugButton index={0} label="Logout" onPress={handleLogout} />
      </View>
    </GestureDetector>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background_yellow,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    zIndex: 20,
    height: HEADER_HEIGHT,
  },
  logoText: {
    marginTop: -3,
    fontFamily: "KCCGanpan",
    fontSize: 32,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 15,
  },
  notificationCircle: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  headerLine: {
    width: "100%",
    height: 0.4,
    backgroundColor: Colors.light_text_gray,
    zIndex: 15,
  },
  heroContainer: {
    position: "absolute",
    width: "100%",
    alignItems: "center",
    zIndex: 10,
  },
  middleContentContainer: {
    position: "absolute",
    bottom: BOTTOM_SHEET_HANDLE_HEIGHT,
    width: "100%",
    justifyContent: "flex-end",
  },
  textRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    flexWrap: "wrap",
    marginBottom: 4,
  },
  subTextRow: {
    paddingHorizontal: 24,
    alignItems: "flex-end",
    marginBottom: 15,
  },
  categoryPill: {
    backgroundColor: "white",
    borderWidth: 1.2,
    borderColor: Colors.point_red,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  categoryPillText: {
    color: Colors.point_red,
    fontWeight: "bold",
    fontSize: 14,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  bottomSheetWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 30,
  },
  bottomSheetHandle: {
    height: BOTTOM_SHEET_HANDLE_HEIGHT,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 8,
    gap: 16,
  },
  handleBar: {
    width: 36,
    height: 5,
    backgroundColor: Colors.slightly_burn,
    borderRadius: 99,
  },
  handleText: {
    color: Colors.slightly_burn,
    fontSize: 16,
    fontFamily: "NanumSquareRoundEB",
  },
  bottomSheetContent: {
    flex: 1,
  },
});
