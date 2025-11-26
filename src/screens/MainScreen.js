import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Animated,
  useWindowDimensions,
  Easing,
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
import Colors from "../styles/colors";

// ★★★ 반응형 포기: 그냥 값을 고정합니다. (아이폰 기준 적절한 값)
const FIXED_HEADER_HEIGHT = 200; // 게임 패널이 올라와서 멈출 Y 위치
const LOGO_ROW_HEIGHT = 50;

const MainScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();

  const user = useAuthStore((state) => state.user);

  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [isBalanceGameVisible, setBalanceGameVisible] = useState(false);
  const [mainFeedData, setMainFeedData] = useState([]);

  // 1. UI 스타일 애니메이션 (JS Driver)
  const transitionAnim = useRef(new Animated.Value(0)).current; 

  // 2. 게임 패널 위치 애니메이션 (Native Driver)
  const topAnim = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    // ★★★ 계산 로직 제거 -> 고정값 사용
    // 게임 켜지면: 상단 안전영역 + 고정된 헤더 높이(180) 위치로 이동
    // 게임 꺼지면: 화면 아래(screenHeight)로 이동
    const targetValue = isBalanceGameVisible 
      ? insets.top + 170 // 170 정도면 배너 바로 밑에 예쁘게 붙습니다.
      : screenHeight;

    Animated.parallel([
      // 게임 패널 이동
      Animated.spring(topAnim, {
        toValue: targetValue,
        useNativeDriver: true, 
        bounciness: 0,
        speed: 40,
      }),
      // 배경/헤더 스타일 변경
      Animated.timing(transitionAnim, {
        toValue: isBalanceGameVisible ? 1 : 0,
        duration: 250,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false, 
      }),
    ]).start();

  }, [isBalanceGameVisible, insets.top, screenHeight]);

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

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    if (scrollY > 50 && !isBalanceGameVisible) {
      setBalanceGameVisible(true);
    }
  };

  // --- Interpolations ---

  const headerBackgroundColor = transitionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["white", Colors.point_red],
  });

  const bannerPaddingHorizontal = transitionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [15, 0],
  });

  const logoRowOpacity = transitionAnim.interpolate({
    inputRange: [0, 0.5], 
    outputRange: [1, 0], 
  });

  const logoRowTranslateY = transitionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const bannerTranslateY = transitionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -LOGO_ROW_HEIGHT + 15], // 로고 자리만큼 위로 이동
  });

  const iconWhiteOpacity = transitionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  
  const iconBlackOpacity = transitionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const curtainOpacity = transitionAnim.interpolate({
    inputRange: [0, 0.1, 1],
    outputRange: [0, 1, 1],
  });

  const scrollableComponents = [
    { key: "RecentLiked" },
    { key: "FoodCardNews" },
    { key: "Ranking" },
  ];

  const renderScrollableComponent = ({ item }) => {
    switch (item.key) {
      case "RecentLiked":
        return <RecentLiked />;
      case "FoodCardNews":
        return (
          <View style={{ height: 300 }}>
            <FoodCardNews foodsData={mainFeedData} isLoading={isLoading} />
          </View>
        );
      case "Ranking":
        return <Ranking />;
      default:
        return null;
    }
  };

  const CrossFadeIcon = ({ IconComponent }) => (
    <View style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center' }}>
      <Animated.View style={{ position: 'absolute', opacity: iconBlackOpacity }}>
        <IconComponent color="#33363F" />
      </Animated.View>
      <Animated.View style={{ position: 'absolute', opacity: iconWhiteOpacity }}>
        <IconComponent color="white" />
      </Animated.View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 배경색 레이어 */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: headerBackgroundColor },
        ]}
      />

      <SafeAreaView style={{ flex: 1 }} edges={["left", "right", "bottom"]}>
        {/* 헤더 영역: 높이 고정하지 않음 (내용물만큼만 차지) */}
        <Animated.View
          style={{
            paddingTop: insets.top,
            backgroundColor: headerBackgroundColor,
            zIndex: 10,
          }}
        >
          <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
            <View style={styles.topRow}>
              <TouchableOpacity>
                <CrossFadeIcon IconComponent={Bell} />
              </TouchableOpacity>
              <TouchableOpacity>
                <CrossFadeIcon IconComponent={Settings} />
              </TouchableOpacity>
            </View>

            <Animated.View
              style={{
                height: LOGO_ROW_HEIGHT,
                justifyContent: 'center',
                opacity: logoRowOpacity,
                transform: [{ translateY: logoRowTranslateY }],
              }}
            >
              <View style={styles.logoRow}>
                <Text style={[styles.logo, { color: Colors.point_red }]}>밥땡</Text>
                <TouchableOpacity onPress={() => setDrawerVisible(true)}>
                  <View style={styles.userIcon} />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>

          <Animated.View
            style={{
              paddingHorizontal: bannerPaddingHorizontal,
              width: '100%',
              alignItems: 'center',
              transform: [{ translateY: bannerTranslateY }],
            }}
          >
            <StatusBanner isExpanded={isBalanceGameVisible} />
          </Animated.View>
        </Animated.View>

        {/* 레드 커튼: 단순하게 화면 전체를 덮도록 설정 (헤더 제외) */}
        <Animated.View
          style={{
            position: "absolute",
            top: insets.top + FIXED_HEADER_HEIGHT, // 대충 헤더 아래쯤
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: Colors.point_red, // 빨간색으로 리스트 가림
            opacity: curtainOpacity, 
            zIndex: 5,
          }}
          pointerEvents={isBalanceGameVisible ? "auto" : "none"}
        />

        {/* 메인 리스트 */}
        <FlatList
          style={{ paddingHorizontal: 15, zIndex: 0 }}
          data={scrollableComponents}
          renderItem={renderScrollableComponent}
          keyExtractor={(item) => item.key}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          scrollEnabled={!isBalanceGameVisible}
        />

        {/* 밸런스 게임 패널 */}
        <Animated.View
          style={[
            styles.animatedContainer,
            // topAnim은 이제 고정된 숫자(170)로 이동합니다.
            { transform: [{ translateY: topAnim }], zIndex: 20 },
          ]}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setBalanceGameVisible(false)}
          >
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <BalanceGame />
        </Animated.View>

        <UserDrawer
          isVisible={isDrawerVisible}
          onClose={() => setDrawerVisible(false)}
          email={user?.email}
        />
      </SafeAreaView>
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 12,
    marginBottom: 5,
    height: 32,
  },
  logoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "NanumSquareB",
  },
  userIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.burn_red,
  },
  animatedContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: "white",
    padding: 15,
    paddingTop: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 15,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.gray_dark,
  },
});