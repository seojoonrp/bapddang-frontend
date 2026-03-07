// src/components/MainScreen/Hero.js

import { View, StyleSheet, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import Colors from "../../constants/colors";
import { useModeStore } from "../../stores/modeStore";
import ModeSwitch from "../ModeSwitch";
import { useHeroAnimations } from "../../hooks/useHeroAnimations";
import { memo } from "react";
import Stick from "../../assets/images/stick.svg";
import LottieView from "lottie-react-native";
import SpeechBalloon from "../../assets/images/speech-balloon.svg";
import { useSpeechBalloon } from "../../hooks/useSpeechBalloon";

const MarshmallowAnimation = memo(() => {
  return (
    <LottieView
      source={require("../../assets/lottie/marshmallow.json")}
      autoPlay
      loop
      cacheComposition={true}
      width={185}
      height={185}
      speed={0.9}
    />
  );
});

const fireFastSource = require("../../assets/lottie/fire_fast.json");
const fireSlowSource = require("../../assets/lottie/fire_slow.json");

const FireAnimation = memo(({ mode }) => {
  return (
    <LottieView
      source={mode === "fast" ? fireFastSource : fireSlowSource}
      autoPlay
      loop
      cacheComposition={true}
      width={47}
      height={80}
    />
  );
});

const Hero = ({ scrollY, scrollThreshold }) => {
  const mode = useModeStore((state) => state.mode);
  const { text, changeText } = useSpeechBalloon();
  const balloonScale = useSharedValue(1);

  const balloonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: balloonScale.value }],
  }));

  const handleBalloonPress = () => {
    changeText();
    balloonScale.value = 1.07;
    balloonScale.value = withSpring(1, {
      stiffness: 1000,
      damping: 50,
    });
  };

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
          <FireAnimation mode={mode} />
        </View>

        <View style={styles.stick}>
          <Stick width={422} height={80} />
        </View>

        <Pressable style={styles.marshmallow} onPress={handleBalloonPress}>
          <MarshmallowAnimation />
        </Pressable>

        <Pressable
          style={styles.speechBalloonContainer}
          onPress={handleBalloonPress}
        >
          <Animated.View
            style={[styles.speechBalloonInner, balloonAnimatedStyle]}
          >
            <SpeechBalloon
              width={124}
              height={91.5}
              color={mode === "fast" ? Colors.nurim : Colors.border_brown}
            />
            <Text
              style={[
                styles.speechText,
                { color: mode === "fast" ? Colors.nurim : Colors.border_brown },
              ]}
            >
              {text}
            </Text>
          </Animated.View>
        </Pressable>
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
  speechBalloonContainer: {
    position: "absolute",
    bottom: 108,
    left: 196,
    width: 124,
    height: 91.5,
  },
  speechBalloonInner: {
    width: 124,
    height: 91.5,
    justifyContent: "center",
    alignItems: "center",
  },
  speechText: {
    position: "absolute",
    color: Colors.nurim,
    fontFamily: "NanumSquareRoundB",
    fontSize: 13,
    textAlign: "center",
    letterSpacing: -0.4,
  },
  characterContainer: {
    flex: 1,
    marginLeft: -10,
  },
  fire: {
    position: "absolute",
    bottom: -5,
    left: 90,
    transform: [{ scale: 2.5 }],
  },
  marshmallow: {
    position: "absolute",
    bottom: 12,
    left: 27,
    transform: [{ rotate: "102deg" }, { scale: 1.7 }],
  },
  stick: {
    position: "absolute",
    bottom: 76,
    left: -198,
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
