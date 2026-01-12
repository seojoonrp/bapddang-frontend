import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  useWindowDimensions,
  PanResponder,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import useAuthStore from "../stores/authStore";
import { fetchMainFeedFoods } from "../services/food";
import { handleLogout } from "../services/auth";

import Hero from "../components/MainScreen/Hero";
import FoodCardNews from "../components/MainScreen/FoodCardNews";
import BalanceGame from "../components/MainScreen/BalanceGame";
import DebugButton from "../components/DebugButton";

import Bell from "../components/svg/Bell";
import Settings from "../components/svg/Settings";
import Colors from "../constants/colors";

const HEADER_HEIGHT = 48;
const BOTTOM_SHEET_HANDLE_HEIGHT = 90;
const HERO_MARGIN = 18;

const MainScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const headerHeight = insets.top + HEADER_HEIGHT;

  const SCROLL_THRESHOLD =
    screenHeight - headerHeight - BOTTOM_SHEET_HANDLE_HEIGHT;

  const bannerHeightRange = [230, headerHeight];
  const cardNewsSize = 300;

  const [isLoading, setIsLoading] = useState(true);
  const [mainFeedData, setMainFeedData] = useState([]);
  const hasNotifications = true;

  const scrollY = useRef(new Animated.Value(0)).current;
  const isBottomSheetOpen = useRef(false);
  const offsetY = useRef(0);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => {
          return Math.abs(gestureState.dy) > 40;
        },
        onPanResponderGrant: () => {
          offsetY.current = scrollY._value || 0;
        },
        onPanResponderMove: (evt, gestureState) => {
          const deltaY = -gestureState.dy;
          const newValue = offsetY.current + deltaY;

          if (newValue > SCROLL_THRESHOLD) {
            scrollY.setValue(SCROLL_THRESHOLD);
            return;
          }
          if (newValue < 0) {
            scrollY.setValue(0);
            return;
          }
          scrollY.setValue(newValue);
        },
        onPanResponderRelease: (evt, gestureState) => {
          const { vy } = gestureState;
          const velocity = -vy;
          const currentValue = scrollY._value || 0;

          let toValue = 0;
          if (
            velocity > 0.5 ||
            (currentValue > SCROLL_THRESHOLD / 2 && velocity > -0.5)
          ) {
            toValue = SCROLL_THRESHOLD;
          } else {
            toValue = 0;
          }

          Animated.spring(scrollY, {
            toValue: toValue,
            velocity: velocity,
            tension: 40,
            friction: 9,
            useNativeDriver: false,
          }).start(() => {
            isBottomSheetOpen.current = toValue === SCROLL_THRESHOLD;
            offsetY.current = toValue;
          });
        },
      }),

    [scrollY, SCROLL_THRESHOLD]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMainFeedFoods({ speed: "fast" });
        setMainFeedData(data.foods || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const cardNewsPadding = screenWidth / 2 - (cardNewsSize / 2) * 1.04;

  const heroTranslateY = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [0, -(headerHeight + HERO_MARGIN)],
    extrapolate: "clamp",
  });

  const bottomSheetTranslateY = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [SCROLL_THRESHOLD, 0],
    extrapolate: "clamp",
  });

  const middleContentOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD * 0.5],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const bapddangTextColor = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [Colors.point_red, Colors.yellow],
    extrapolate: "clamp",
  });

  const iconOverlayOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const onLogoutPress = async () => {
    await handleLogout();
    navigation.replace("Landing");
  };

  return (
    <View
      style={[styles.container, { paddingTop: insets.top }]}
      {...panResponder.panHandlers}
    >
      {/* Header Container */}
      <View style={styles.headerContainer}>
        <Animated.Text style={[styles.logoText, { color: bapddangTextColor }]}>
          밥땡
        </Animated.Text>

        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => {}}>
            <View>
              <Bell color={Colors.yellow} width={24} height={24} />
              <Animated.View
                style={[
                  StyleSheet.absoluteFill,
                  { opacity: iconOverlayOpacity },
                ]}
              >
                <Bell color={Colors.background_yellow} width={24} height={24} />
              </Animated.View>
            </View>
            {hasNotifications && (
              <Animated.View
                style={[
                  styles.notificationCircle,
                  { backgroundColor: bapddangTextColor },
                ]}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <View>
              <Settings color={Colors.yellow} width={24} height={24} />
              <Animated.View
                style={[
                  StyleSheet.absoluteFill,
                  { opacity: iconOverlayOpacity },
                ]}
              >
                <Settings
                  color={Colors.background_yellow}
                  width={24}
                  height={24}
                />
              </Animated.View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* 히어로 */}
      <Animated.View
        style={[
          styles.heroContainer,
          { top: headerHeight + HERO_MARGIN },
          { transform: [{ translateY: heroTranslateY }] },
        ]}
      >
        <Hero
          scrollY={scrollY}
          scrollThreshold={SCROLL_THRESHOLD}
          heightRange={bannerHeightRange}
        />
      </Animated.View>

      {/* 중간 콘텐츠 */}
      <Animated.View
        style={[
          styles.middleContentContainer,
          { opacity: middleContentOpacity },
        ]}
      >
        <View style={styles.textRow}>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>점심식사</Text>
          </View>
          <Text style={styles.questionText}>를 고민 중인가요?</Text>
        </View>

        <View style={styles.cardNewsWrapper}>
          <FoodCardNews
            pad={cardNewsPadding}
            foodsData={mainFeedData}
            isLoading={isLoading}
          />
        </View>
      </Animated.View>

      {/* 바텀시트 */}
      <Animated.View
        style={[
          styles.bottomSheetWrapper,
          { height: SCROLL_THRESHOLD + BOTTOM_SHEET_HANDLE_HEIGHT },
          { transform: [{ translateY: bottomSheetTranslateY }] },
        ]}
      >
        <View style={styles.bottomSheetHandle}>
          <View style={styles.handleBar} />
          <Text style={styles.handleText}>
            카테고리별 추천 메뉴를 보려면 올려주세요!
          </Text>
        </View>

        <View style={styles.bottomSheetContent}>
          <BalanceGame />
        </View>
      </Animated.View>

      {/* <DebugButton index={0} label="Logout" onPress={onLogoutPress} /> */}
    </View>
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
    borderBottomColor: Colors.text_gray,
    borderBottomWidth: 0.3,
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
  cardNewsWrapper: {
    height: 320,
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
