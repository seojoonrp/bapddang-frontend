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
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import useAuthStore from "../stores/authStore";
import { fetchMainFeedFoods } from "../services/food";

import UserDrawer from "../components/MainScreen/UserDrawer";
import StatusBanner from "../components/MainScreen/StatusBanner";
import RecentLiked from "../components/MainScreen/RecentLiked";
import FoodCardNews from "../components/MainScreen/FoodCardNews";
import Ranking from "../components/MainScreen/Ranking";
import BalanceGame from "../components/MainScreen/BalanceGame";
import Bell from "../components/svg/Bell";
import Settings from "../components/svg/Settings";
import Colors from "../constants/colors";
import { handleLogout } from "../services/auth";

const SCROLL_THRESHOLD = 580;

const MainScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const screenWidth = useWindowDimensions().width;
  const screenHeight = useWindowDimensions().height;
  const bannerHeightRange = [230, screenHeight - SCROLL_THRESHOLD + 25];
  const cardNewsSize = 300;

  const user = useAuthStore((state) => state.user);

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
          return Math.abs(gestureState.dy) > 50;
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
          // 속도가 빠르거나 절반 이상 올라오면 상단 고정
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
            tension: 30,
            friction: 40,
            useNativeDriver: false,
          }).start(() => {
            isBottomSheetOpen.current = toValue === SCROLL_THRESHOLD;
            offsetY.current = toValue;
          });
        },
      }),
    []
  );

  // 카뉴 음식 정보 받아오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMainFeedFoods({ type: "meal", speed: "fast" });
        setMainFeedData(data || []);
      } catch (error) {
        console.error("Feed fetch error (check server):", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const cardNewsPadding = screenWidth / 2 - (cardNewsSize / 2) * 1.04;

  // 애니메이션 인터폴레이션 정의
  const heroTranslateY = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [156, -5],
    extrapolate: "clamp",
  });

  const heroPaddingHorizontal = scrollY.interpolate({
    inputRange: [SCROLL_THRESHOLD * 0.2, SCROLL_THRESHOLD],
    outputRange: [12, -1],
    extrapolate: "clamp",
  });

  const bottomSheetTranslateY = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [SCROLL_THRESHOLD, 0],
    extrapolate: "clamp",
  });

  // svg 아이콘 애니메이션 (나중에 따로 빼면 좋을듯)
  const iconFirstOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const iconSecondOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  const CrossFadeIcon = ({
    IconComponent,
    size = 24,
    firstColor,
    secondColor,
  }) => (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Animated.View
        style={{ position: "absolute", opacity: iconFirstOpacity }}
      >
        <IconComponent color={firstColor} width={size} height={size} />
      </Animated.View>
      <Animated.View
        style={{ position: "absolute", opacity: iconSecondOpacity }}
      >
        <IconComponent color={secondColor} width={size} height={size} />
      </Animated.View>
    </View>
  );

  const onLogoutPress = async () => {
    await handleLogout();
    navigation.replace("Landing");
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* 화면 상단 잡다한 것들 */}
      <Animated.View style={styles.settingsRow}>
        <TouchableOpacity onPress={() => {}}>
          <CrossFadeIcon
            IconComponent={Bell}
            size={24}
            firstColor={"#FFC77D"}
            secondColor={"#FFFFFF"}
          />
          {hasNotifications && <View style={styles.notificationCircle} />}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <CrossFadeIcon
            IconComponent={Settings}
            size={24}
            firstColor={"#FFC77D"}
            secondColor={"#FFFFFF"}
          />
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.logoRow}>
        <Text style={styles.logoText}>밥땡</Text>
        <TouchableOpacity onPress={onLogoutPress}>
          <Text>로그아웃</Text>
        </TouchableOpacity>
        <View style={styles.userProfile}></View>
      </View>

      {/* 프로필 배너 히어로 */}
      <Animated.View
        style={[
          styles.heroContainer,
          {
            top: 0,
            paddingHorizontal: heroPaddingHorizontal,
            transform: [{ translateY: heroTranslateY }],
          },
        ]}
      >
        <StatusBanner
          scrollY={scrollY}
          scrollThreshold={SCROLL_THRESHOLD}
          heightRange={bannerHeightRange}
        />
      </Animated.View>

      {/* 밑쪽에 고정된 좋아요, 카뉴, 랭킹 */}
      <View style={styles.staticContentLayer}>
        <RecentLiked />
        <View style={{ height: 300 }}>
          <FoodCardNews
            pad={cardNewsPadding}
            foodsData={mainFeedData}
            isLoading={isLoading}
          />
        </View>
        <Ranking />
      </View>

      {/* 바텀시트 */}
      <Animated.View
        style={[
          styles.bottomSheetWrapper,
          { transform: [{ translateY: bottomSheetTranslateY }] },
        ]}
      >
        <BalanceGame />
      </Animated.View>
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background_yellow,
  },

  settingsRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 50,
    paddingHorizontal: 20,
    gap: 10,
    zIndex: 10,
  },
  topIcons: {
    width: 24,
    height: 24,
  },
  notificationCircle: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: Colors.point_red,
  },

  logoRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.point_red,
  },
  userProfile: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.burn,
  },

  heroContainer: {
    position: "absolute",
    width: "100%",
  },

  staticContentLayer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    marginBottom: 32,
    gap: 12,
  },

  bottomSheetWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: SCROLL_THRESHOLD,
    padding: 20,
    zIndex: 5,
  },
});
