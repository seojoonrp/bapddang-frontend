import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Animated, useWindowDimensions, Switch } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
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

const SCROLL_THRESHOLD = 120; // 반응 거리

const MainScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();

  const user = useAuthStore((state) => state.user);
  const { mode, toggleMode } = useModeStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [mainFeedData, setMainFeedData] = useState([]);

  // ★ Native Driver용 Animated Value
  const scrollY = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

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

  const handleScrollEndDrag = (e) => {
    const currentY = e.nativeEvent.contentOffset.y;
    if (currentY > SCROLL_THRESHOLD / 2) {
      flatListRef.current?.scrollToOffset({ offset: SCROLL_THRESHOLD, animated: true });
    } else {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  };

  // --- Interpolations ---
  const redBackgroundOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const logoOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD / 2],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const logoTranslateY = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [0, -20],
    extrapolate: 'clamp',
  });

  const bannerTranslateY = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [0, -40],
    extrapolate: 'clamp',
  });

  const headerSwitchOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const iconWhiteOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const iconBlackOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const gamePanelTranslateY = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [screenHeight, insets.top + 160],
    extrapolate: 'clamp',
  });

  const scrollableComponents = [
    { key: "RecentLiked" },
    { key: "FoodCardNews" },
    { key: "Ranking" },
  ];

  const renderScrollableComponent = ({ item }) => {
    switch (item.key) {
      case "RecentLiked": return <RecentLiked />;
      case "FoodCardNews": return <View style={{ height: 300 }}><FoodCardNews foodsData={mainFeedData} isLoading={isLoading} /></View>;
      case "Ranking": return <Ranking />;
      default: return null;
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
      {/* 배경 레이어 */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'white' }]} />
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: Colors.point_red, opacity: redBackgroundOpacity }]} />

      <SafeAreaView style={{ flex: 1 }} edges={["left", "right", "bottom"]}>
        <View style={{ paddingTop: insets.top, zIndex: 10 }}>
          <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
            <View style={styles.topRow}>
              <Animated.View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, opacity: headerSwitchOpacity }}>
                <Switch
                  style={{ transform: [{ scale: 0.8 }] }}
                  trackColor={{ false: "#359c21", true: "#e02828" }}
                  thumbColor="#fcfcfc"
                  onValueChange={toggleMode}
                  value={mode === "fast"}
                />
              </Animated.View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <TouchableOpacity><CrossFadeIcon IconComponent={Bell} /></TouchableOpacity>
                <TouchableOpacity><CrossFadeIcon IconComponent={Settings} /></TouchableOpacity>
              </View>
            </View>

            <Animated.View style={{ height: 50, justifyContent: 'center', opacity: logoOpacity, transform: [{ translateY: logoTranslateY }] }}>
              <View style={styles.logoRow}>
                <Text style={[styles.logo, { color: Colors.point_red }]}>밥땡</Text>
                <TouchableOpacity onPress={() => setDrawerVisible(true)}>
                  <View style={styles.userIcon} />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>

          <Animated.View style={{ paddingHorizontal: 15, transform: [{ translateY: bannerTranslateY }] }}>
            {/* ★ StatusBanner에 scrollY, scrollThreshold 전달 */}
            <StatusBanner scrollY={scrollY} scrollThreshold={SCROLL_THRESHOLD} />
          </Animated.View>
        </View>

        <Animated.FlatList
          ref={flatListRef}
          style={{ flex: 1, zIndex: 0 }}
          contentContainerStyle={{ paddingTop: insets.top + 280, paddingHorizontal: 15, paddingBottom: 50 }}
          data={scrollableComponents}
          renderItem={renderScrollableComponent}
          keyExtractor={(item) => item.key}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          onScrollEndDrag={handleScrollEndDrag}
          onMomentumScrollEnd={handleScrollEndDrag}
          scrollEventThrottle={16}
        />

        <Animated.View style={[styles.animatedContainer, { transform: [{ translateY: gamePanelTranslateY }], zIndex: 20 }]}>
          <TouchableOpacity style={styles.closeButton} onPress={() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true })}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <BalanceGame />
        </Animated.View>

        <UserDrawer isVisible={isDrawerVisible} onClose={() => setDrawerVisible(false)} email={user?.email} />
      </SafeAreaView>
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5, height: 32 },
  logoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  logo: { fontSize: 24, fontWeight: "bold", fontFamily: "NanumSquareB" },
  userIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.burn_red },
  animatedContainer: { position: "absolute", left: 0, right: 0, bottom: 0, top: 0, backgroundColor: "white", padding: 15, paddingTop: 40, borderTopLeftRadius: 20, borderTopRightRadius: 20, shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 },
  closeButton: { position: "absolute", top: 10, right: 15, padding: 5 },
  closeButtonText: { fontSize: 20, fontWeight: "bold", color: Colors.gray_dark },
});