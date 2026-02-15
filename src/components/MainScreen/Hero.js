// src/components/MainScreen/Hero.js

import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated from "react-native-reanimated";
import Colors from "../../constants/colors";
import { useModeStore } from "../../stores/modeStore";
import ModeSwitch from "../ModeSwitch";
import { useHeroAnimations } from "../../hooks/useHeroAnimations";
import { memo } from "react";
import Fire from "../../assets/images/fire.svg";
import Stick from "../../assets/images/stick.svg";
import LottieView from "lottie-react-native";

const MarshmallowAnimation = memo(() => {
  return (
    <LottieView
      source={require("../../assets/lottie/marshmallow-rotate.json")}
      autoPlay
      loop
      cacheComposition={true}
      width={185}
      height={185}
    />
  );
});

const Hero = ({ scrollY, scrollThreshold }) => {
  const mode = useModeStore((state) => state.mode);

  const { containerStyle, textStyle, animatedCharacterStyle } =
    useHeroAnimations(scrollY, scrollThreshold);

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
          {mode === "fast" ? "푸짐하게" : "건강하게"}
        </Animated.Text>
        <ModeSwitch />
      </View>

      <Animated.View
        style={[styles.characterContainer, animatedCharacterStyle]}
      >
        <View style={styles.fire}>
          <Fire width={47} height={80} />
        </View>

        <View style={styles.stick}>
          <Stick width={422} height={80} />
        </View>

        <View style={styles.marshmallow}>
          <MarshmallowAnimation />
        </View>
      </Animated.View>
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
  characterContainer: {
    flex: 1,
    marginLeft: -10,
  },
  fire: {
    position: "absolute",
    bottom: 0,
    left: 100,
  },
  marshmallow: {
    position: "absolute",
    bottom: 10,
    left: 35,
    transform: [{ rotate: "105deg" }],
  },
  stick: {
    position: "absolute",
    bottom: 80,
    left: -180,
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
