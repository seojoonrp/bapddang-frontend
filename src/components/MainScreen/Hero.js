import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import Colors from "../../constants/colors";
import useModeStore from "../../stores/modeStore";
import ModeSwitch from "../ModeSwitch";

import Favorite from "../svg/Favorite";
import Edit from "../svg/Edit";
import Stick from "../svg/Stick";
import Fire from "../svg/Fire";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const HORIZONTAL_PADDING = 12;

const Hero = ({ scrollY, scrollThreshold }) => {
  const navigation = useNavigation();
  const { mode, toggleMode, modeColor } = useModeStore();

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const textOpacity = scrollY.interpolate({
    inputRange: [0, scrollThreshold * 0.5],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const containerWidth = scrollY.interpolate({
    inputRange: [0, scrollThreshold],
    outputRange: [screenWidth - HORIZONTAL_PADDING * 2, screenWidth],
    extrapolate: "clamp",
  });

  const borderRadius = scrollY.interpolate({
    inputRange: [scrollThreshold * 0.7, scrollThreshold],
    outputRange: [24, 0],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          borderRadius,
          backgroundColor: modeColor,
          width: containerWidth,
        },
      ]}
    >
      <AnimatedLinearGradient
        colors={[`rgba(0, 0, 0, 0)`, `rgba(0, 0, 0, 0.2)`]}
        start={{ x: 0, y: 0.2 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.container,
          {
            borderRadius,
            overflow: "hidden",
          },
        ]}
      >
        <Animated.View style={styles.switchContainer}>
          <Animated.Text style={[styles.modeText, { opacity: textOpacity }]}>
            {mode === "fast" ? "고속" : "저속"}노화
          </Animated.Text>
          <ModeSwitch value={mode === "fast"} onValueChange={toggleMode} />
        </Animated.View>

        {/* <View style={styles.fireContainer}>
          <Fire scale={1.0} />
        </View>
        <View style={styles.stickContainer}>
          <Stick scale={0.4} />
        </View> */}

        <Animated.View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: modeColor }]}
            onPress={() => navigation.navigate("DietLog")}
          >
            <Edit color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: modeColor }]}
          >
            <Favorite color="white" />
          </TouchableOpacity>
        </Animated.View>
      </AnimatedLinearGradient>
    </Animated.View>
  );
};

export default Hero;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: 230,
    flexDirection: "column",
    justifyContent: "center",
  },
  switchContainer: {
    position: "absolute",
    top: 14,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
