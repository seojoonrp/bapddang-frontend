// src/components/MainScreen/Hero.js

import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated from "react-native-reanimated";
import Colors from "../../constants/colors";
import { useModeStore } from "../../stores/modeStore";
import ModeSwitch from "../ModeSwitch";
import { useHeroAnimations } from "../../hooks/useHeroAnimations";
import { memo } from "react";

const Hero = ({ scrollY, scrollThreshold }) => {
  const { mode, modeColor } = useModeStore();

  const { containerStyle, textStyle } = useHeroAnimations(
    scrollY,
    scrollThreshold,
  );

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <LinearGradient
        colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.2)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.absoluteFill}
      />

      <View style={styles.switchContainer}>
        <Animated.Text style={[styles.modeText, textStyle]}>
          {mode === "fast" ? "고속" : "저속"}노화
        </Animated.Text>
        <ModeSwitch />
      </View>
    </Animated.View>
  );
};

export default memo(Hero);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    overflow: "hidden",
    zIndex: 10,
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    zIndex: 10,
  },
  modeText: {
    color: Colors.background_yellow,
    fontFamily: "KCCGanpan",
    fontSize: 18,
  },
});
