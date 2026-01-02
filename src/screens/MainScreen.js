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

import StatusBanner from "../components/MainScreen/StatusBanner";
import FoodCardNews from "../components/MainScreen/FoodCardNews";
import BalanceGame from "../components/MainScreen/BalanceGame";

import Bell from "../components/svg/Bell";
import Settings from "../components/svg/Settings";
import Colors from "../constants/colors";

// 바텀시트 핸들바(항상 보이는 부분)의 높이
const BOTTOM_SHEET_HANDLE_HEIGHT = 70;

const MainScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  // 화면 전체 높이와 너비 가져오기
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // 1. 헤더 높이 계산 (상단바 + 60)
  const headerHeight = insets.top + 60;

  // 2. 동적 스크롤 임계값 계산 (핵심!)
  // 전체 화면에서 [헤더]와 [핸들바]를 뺀 나머지 공간만큼만 스크롤 가능하게 함
  const SCROLL_THRESHOLD = screenHeight - headerHeight - BOTTOM_SHEET_HANDLE_HEIGHT;

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
          return Math.abs(gestureState.dy) > 10;
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
    // SCROLL_THRESHOLD가 바뀌면 PanResponder도 새로 만들어야 함
    [scrollY, SCROLL_THRESHOLD] 
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMainFeedFoods({ type: "meal", speed: "fast" });
        setMainFeedData(data || []);
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
    outputRange: [0, -headerHeight], 
    extrapolate: "clamp",
  });

  const bottomSheetTranslateY = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    // 0일 때는 [스크롤길이 - 핸들바] 만큼 내려가 있다가, 스크롤하면 0으로 올라옴
    outputRange: [SCROLL_THRESHOLD - BOTTOM_SHEET_HANDLE_HEIGHT, 0], 
    extrapolate: "clamp",
  });

  const middleContentOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD * 0.4],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const headerContentColor = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [Colors.point_red, "white"],
    extrapolate: "clamp",
  });

  const iconOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const onLogoutPress = async () => {
    await handleLogout();
    navigation.replace("Landing");
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Header Container */}
      <View style={[styles.headerContainer, { marginTop: insets.top + 10 }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Animated.Text
            style={[styles.logoText, { color: headerContentColor }]}
          >
            밥땡
          </Animated.Text>
          <TouchableOpacity onPress={onLogoutPress}>
            <Animated.Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                color: headerContentColor,
              }}
            >
              로그아웃
            </Animated.Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => {}}>
            <View>
              <Bell color={Colors.point_red} width={24} height={24} />
              <Animated.View
                style={[StyleSheet.absoluteFill, { opacity: iconOpacity }]}
              >
                <Bell color="white" width={24} height={24} />
              </Animated.View>
            </View>
            {hasNotifications && <View style={styles.notificationCircle} />}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <View>
              <Settings color={Colors.point_red} width={24} height={24} />
              <Animated.View
                style={[StyleSheet.absoluteFill, { opacity: iconOpacity }]}
              >
                <Settings color="white" width={24} height={24} />
              </Animated.View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Red Banner */}
      <Animated.View
        style={[
          styles.heroContainer,
          { top: headerHeight }, // 헤더 높이만큼 띄우기
          { transform: [{ translateY: heroTranslateY }] },
        ]}
      >
        <StatusBanner
          scrollY={scrollY}
          scrollThreshold={SCROLL_THRESHOLD}
          heightRange={bannerHeightRange}
        />
      </Animated.View>

      {/* Middle Content */}
      <Animated.View
        style={[
          styles.middleContentContainer,
          { top: insets.top + 310 }, // 이 값은 디자인에 맞춰 고정하거나 비율로 조정
          { opacity: middleContentOpacity },
        ]}
      >
        <View style={styles.textRow}>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>점심식사</Text>
          </View>
          <Text style={styles.questionText}>를 고민 중인가요?</Text>
        </View>
        <View style={styles.subTextRow}>
          <Text style={styles.subOptionText}>이미 점심을 먹었다면?</Text>
        </View>

        <View style={styles.cardNewsWrapper}>
          <FoodCardNews
            pad={cardNewsPadding}
            foodsData={mainFeedData}
            isLoading={isLoading}
          />
        </View>
      </Animated.View>

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          styles.bottomSheetWrapper,
          // 여기서 height를 동적으로 설정해줍니다.
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
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFCF5",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 20,
    marginBottom: 10,
    height: 40,
  },
  logoText: {
    fontFamily: "KCCGanpan",
    fontSize: 26,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 15,
  },
  notificationCircle: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.point_red,
    borderWidth: 1.5,
    borderColor: "#FFFCF5",
  },
  heroContainer: {
    position: "absolute",
    width: "100%",
    zIndex: 10,
  },
  middleContentContainer: {
    position: "absolute",
    width: "100%",
    paddingBottom: 100,
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
  subOptionText: {
    fontSize: 13,
    color: "#999",
    textDecorationLine: "underline",
  },
  cardNewsWrapper: {
    height: 320,
  },
  // bottomSheetWrapper에서 고정 height 제거 (inline style로 이동)
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
    justifyContent: "center",
    paddingTop: 10,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    marginBottom: 10,
  },
  handleText: {
    color: "#999",
    fontSize: 14,
    fontWeight: "600",
  },
  bottomSheetContent: {
    flex: 1,
    padding: 20,
  },
});