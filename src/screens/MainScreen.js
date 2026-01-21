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
import useModeStore from "../stores/modeStore";
import MainBottomSheet from "../components/MainScreen/MainBottomSheet";
import { useMainAnimations } from "../hooks/useMainAnimations";
import MainHeader from "../components/MainScreen/MainHeader";
import { MAIN_LAYOUT } from "../constants/layout";
import { useMainLayout } from "../hooks/useMainLayout";

const MainScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { screenWidth, insets, headerHeight, scrollThreshold, heroHeight } =
    useMainLayout();

  const { animatedStyles, panGesture, scrollY } = useMainAnimations(
    scrollThreshold,
    headerHeight,
  );

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <MainHeader
          animatedStyles={animatedStyles}
          onBellPress={() => console.log("Bell pressed")}
          onSettingsPress={() => console.log("Settings pressed")}
        />

        <Animated.View
          style={[
            styles.heroContainer,
            {
              top: headerHeight + MAIN_LAYOUT.HEADER_HERO_GAP,
              height: heroHeight,
            },
            animatedStyles.hero,
          ]}
        >
          <Hero scrollY={scrollY} scrollThreshold={scrollThreshold} />
        </Animated.View>

        <View style={styles.middleContentContainer}>
          <View style={styles.textRow}>
            <View style={styles.timePill}>
              <Text style={styles.timePillText}>점심식사</Text>
            </View>
            <Text style={styles.questionText}>를 고민 중인가요?</Text>
          </View>
          <FoodCardNews screenWidth={screenWidth} size={screenWidth * 0.8} />
        </View>

        <Animated.View
          style={[
            styles.bottomSheetWrapper,
            { height: scrollThreshold + MAIN_LAYOUT.BOTTOM_SHEET_HANDLE },
            animatedStyles.bottomSheet,
          ]}
        >
          <View style={styles.bottomSheetHandle}>
            <View style={styles.handleBar} />
            <Text style={styles.handleText}>
              카테고리별 추천 메뉴를 보려면 올려주세요!
            </Text>
          </View>
          <View style={styles.bottomSheetContent}>
            <MainBottomSheet />
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
  heroContainer: {
    position: "absolute",
    width: "100%",
    alignItems: "center",
    zIndex: 10,
  },
  middleContentContainer: {
    position: "absolute",
    bottom: MAIN_LAYOUT.BOTTOM_SHEET_HANDLE,
    width: "100%",
    justifyContent: "flex-end",
    paddingBottom: 4,
  },
  textRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 4,
    marginBottom: 14,
  },
  timePill: {
    backgroundColor: Colors.background_white,
    borderWidth: 1.5,
    borderColor: Colors.nurim,
    borderRadius: 99,
    paddingVertical: 3,
    paddingHorizontal: 12,
  },
  timePillText: {
    color: Colors.point_red,
    fontFamily: "NanumSquareRoundEB",
    letterSpacing: -0.3,
    fontSize: 18,
  },
  questionText: {
    color: Colors.burn,
    fontSize: 16,
    fontFamily: "NanumSquareRoundEB",
    letterSpacing: -0.3,
  },
  bottomSheetWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: Colors.background_white,
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
    height: MAIN_LAYOUT.BOTTOM_SHEET_HANDLE,
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
