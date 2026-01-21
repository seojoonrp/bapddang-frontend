// src/components/MainScreen/Header.js

import { memo } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";
import BellIcon from "../../assets/icons/bell.svg";
import SettingsIcon from "../../assets/icons/settings.svg";
import Colors from "../../constants/colors";
import { MAIN_LAYOUT } from "../../constants/layout";
import useModeStore from "../../stores/modeStore";

const MainHeader = ({ animatedStyles, onBellPress, onSettingsPress }) => {
  const { modeColor } = useModeStore();

  return (
    <>
      <View style={styles.headerContainer}>
        <Animated.Text style={[styles.logoText, animatedStyles.logo]}>
          밥땡
        </Animated.Text>

        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={onBellPress} activeOpacity={0.7}>
            <View style={styles.iconWrapper}>
              <BellIcon color={Colors.yellow} width={24} height={24} />
              <Animated.View
                style={[StyleSheet.absoluteFill, animatedStyles.iconOverlay]}
              >
                <BellIcon
                  color={Colors.background_yellow}
                  width={24}
                  height={24}
                />
              </Animated.View>
            </View>
            <Animated.View
              style={[styles.notificationCircle, animatedStyles.circle]}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={onSettingsPress} activeOpacity={0.7}>
            <View style={styles.iconWrapper}>
              <SettingsIcon color={Colors.yellow} width={24} height={24} />
              <Animated.View
                style={[StyleSheet.absoluteFill, animatedStyles.iconOverlay]}
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

      {/* 3. 헤더 하단 보더 라인 (스크롤 시 사라짐) */}
      <Animated.View style={[styles.headerLine, animatedStyles.headerLine]} />
    </>
  );
};

export default memo(MainHeader); // 불필요한 리렌더링 방지

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    zIndex: 20,
    height: MAIN_LAYOUT.HEADER,
    pointerEvents: "box-none",
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
  iconWrapper: {
    width: 24,
    height: 24,
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
    height: 1,
    backgroundColor: Colors.light_text_gray,
    zIndex: 15,
  },
});
