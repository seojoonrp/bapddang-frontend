import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  useWindowDimensions,
  Switch,
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

const SCROLL_THRESHOLD = 600;

const MainScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const screenHeight = useWindowDimensions().height;
  const bannerHeightRange = [230, screenHeight - SCROLL_THRESHOLD + 25];

  const user = useAuthStore((state) => state.user);
  const { mode, toggleMode } = useModeStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [mainFeedData, setMainFeedData] = useState([]);

  const scrollY = useRef(new Animated.Value(0)).current;

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
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [insets.top + 60, 0],
    extrapolate: "clamp",
  });

  const heroPaddingHorizontal = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [15, 0],
    extrapolate: "clamp",
  });

  const iconColor = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: ["#33363F", "#FFFFFF"],
  });

  const logoOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD / 2],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      {/* 화면 상단 잡다한 것들 */}
      <Animated.View style={styles.settingsRow}>
        <TouchableOpacity onPress={() => {}}>
          <Bell color={iconColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Settings color={iconColor} />
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
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        snapToOffsets={[0, SCROLL_THRESHOLD]}
        decelerationRate="fast"
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        contentContainerStyle={{
          paddingTop: screenHeight,
        }}
        style={StyleSheet.absoluteFill}
      >
        <View style={styles.bottomSheetWrapper}>
          <BalanceGame />
        </View>
      </Animated.ScrollView>

      {/* <UserDrawer
        isVisible={isDrawerVisible}
        onClose={() => setDrawerVisible(false)}
        email={user?.email}
      /> */}
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  settingsRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 15,
    gap: 10,

    borderColor: "black",
    borderWidth: 1,
  },

  logoRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 10,

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

    borderColor: "black",
    borderWidth: 1,
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
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: SCROLL_THRESHOLD,
    padding: 20,
  },
});
