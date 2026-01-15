// src/components/MainScreen/Hero.js

import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../../constants/colors";
import useModeStore from "../../stores/modeStore";
import ModeSwitch from "../ModeSwitch";
import Favorite from "../svg/Favorite";
import Edit from "../svg/Edit";

const HORIZONTAL_PADDING = 12;

const Hero = ({ scrollY, scrollThreshold }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { mode, toggleMode, modeColor } = useModeStore();
  const { width: screenWidth } = useWindowDimensions();

  const animatedContainerStyle = useAnimatedStyle(() => {
    const width = interpolate(
      scrollY.value,
      [0, scrollThreshold],
      [screenWidth - HORIZONTAL_PADDING * 2, screenWidth],
      Extrapolation.CLAMP
    );
    const paddingHorizontal = interpolate(
      scrollY.value,
      [0, scrollThreshold],
      [14, 14 + HORIZONTAL_PADDING],
      Extrapolation.CLAMP
    );
    const paddingTop = interpolate(
      scrollY.value,
      [0, scrollThreshold],
      [14, insets.top + 9],
      Extrapolation.CLAMP
    );
    const borderRadius = interpolate(
      scrollY.value,
      [scrollThreshold * 0.7, scrollThreshold],
      [24, 0],
      Extrapolation.CLAMP
    );
    return {
      width,
      paddingHorizontal,
      paddingTop,
      borderRadius,
      backgroundColor: modeColor,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          scrollY.value,
          [0, scrollThreshold * 0.8],
          [1, 0],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  const animatedIconButtonStyle = useAnimatedStyle(() => ({
    backgroundColor: modeColor,
  }));

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <LinearGradient
        colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.2)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.absoluteFill}
      />

      <View style={styles.switchContainer}>
        <Animated.Text style={[styles.modeText, animatedTextStyle]}>
          {mode === "fast" ? "고속" : "저속"}노화
        </Animated.Text>
        <ModeSwitch
          value={mode === "fast"}
          onValueChange={() => toggleMode()}
        />
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("DietLog")}>
          <Animated.View style={[styles.iconButton, animatedIconButtonStyle]}>
            <Edit color="white" />
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Animated.View style={[styles.iconButton, animatedIconButtonStyle]}>
            <Favorite color="white" />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default Hero;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: 230,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    overflow: "hidden",
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
  fireContainer: {
    position: "absolute",
    left: 110,
    bottom: 0,
    zIndex: 1,
  },
  stickContainer: {
    position: "absolute",
    left: 120,
    top: -50,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "100deg" }],
    zIndex: 2,
  },
  bottomContainer: {
    position: "absolute",
    width: "100%",
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    zIndex: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    padding: 8,
    backgroundColor: Colors.point_red,
    borderWidth: 1.5,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
