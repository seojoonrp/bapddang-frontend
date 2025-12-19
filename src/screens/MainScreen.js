import React, { useEffect, useState, useRef } from "react";
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
import useModeStore from "../stores/modeStore";
import { fetchMainFeedFoods } from "../services/food";

import UserDrawer from "../components/MainScreen/UserDrawer";
import StatusBanner from "../components/MainScreen/StatusBanner";
import RecentLiked from "../components/MainScreen/RecentLiked";
import FoodCardNews from "../components/MainScreen/FoodCardNews";
import Ranking from "../components/MainScreen/Ranking";
import BalanceGame from "../components/MainScreen/BalanceGame";
import Bell from "../components/svg/Bell";
import Settings from "../components/svg/Settings";
import Colors from "../styles/colors";

const SCROLL_THRESHOLD = 580;

const MainScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const screenHeight = useWindowDimensions().height;
  const bannerHeightRange = [230, screenHeight - SCROLL_THRESHOLD + 25];

  const user = useAuthStore((state) => state.user);
  const { mode, toggleMode } = useModeStore();

  const [isLoading, setIsLoading] = useState(true);
  const [mainFeedData, setMainFeedData] = useState([]);

  const hasNotifications = true;

  const scrollY = useRef(new Animated.Value(0)).current;
  const isBottomSheetOpen = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (evt, gestureState) => {
        const newValue = -gestureState.dy;

        if (isBottomSheetOpen.current && newValue > 0) return;
        if (!isBottomSheetOpen.current && newValue < 0) return;

        if (newValue >= 0 && newValue <= SCROLL_THRESHOLD) {
          scrollY.setValue(newValue);
        }
        if (newValue < 0 && isBottomSheetOpen.current) {
          scrollY.setValue(SCROLL_THRESHOLD + newValue);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (-gestureState.dy > 70) {
          Animated.timing(scrollY, {
            toValue: SCROLL_THRESHOLD,
            duration: 250,
            useNativeDriver: false,
          }).start(() => {
            isBottomSheetOpen.current = true;
          });
        } else if (gestureState.dy > 70) {
          Animated.timing(scrollY, {
            toValue: 0,
            duration: 250,
            useNativeDriver: false,
          }).start(() => {
            isBottomSheetOpen.current = false;
          });
        } else if (isBottomSheetOpen.current) {
          Animated.timing(scrollY, {
            toValue: SCROLL_THRESHOLD,
            duration: 250,
            useNativeDriver: false,
          }).start();
        } else {
          Animated.timing(scrollY, {
            toValue: 0,
            duration: 250,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

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

  // 애니메이션 인터폴레이션 정의
  const heroTranslateY = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD * 0.5, SCROLL_THRESHOLD],
    outputRange: [156, 100, -5],
    extrapolate: "clamp",
  });

  const heroPaddingHorizontal = scrollY.interpolate({
    inputRange: [SCROLL_THRESHOLD * 0.5, SCROLL_THRESHOLD],
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
          <FoodCardNews foodsData={mainFeedData} isLoading={isLoading} />
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
    marginTop: 45,
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

    borderColor: "black",
    borderWidth: 1,
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
    overflow: "hidden",

    borderColor: "black",
    borderWidth: 1,
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
