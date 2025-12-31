import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import Colors from "../../constants/colors";

import useModeStore from "../../stores/modeStore";

import ModeSwitch from "../ModeSwitch";

import Favorite from "../svg/Favorite";
import Edit from "../svg/Edit";
import Character from "../svg/Character";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const StatusBanner = ({ scrollY, scrollThreshold, heightRange }) => {
  const navigation = useNavigation();

  const { mode, toggleMode, modeColor } = useModeStore();

  const borderRadius = scrollY.interpolate({
    inputRange: [scrollThreshold * 0.7, scrollThreshold],
    outputRange: [20, 0],
    extrapolate: "clamp",
  });

  const containerHeight = scrollY.interpolate({
    inputRange: [0, scrollThreshold],
    outputRange: heightRange,
    extrapolate: "clamp",
  });

  const topPosition = scrollY.interpolate({
    inputRange: [0, scrollThreshold],
    outputRange: [14, 66],
    extrapolate: "clamp",
  });

  const bottomPosition = scrollY.interpolate({
    inputRange: [0, scrollThreshold],
    outputRange: [10, 30],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { borderRadius, height: containerHeight, backgroundColor: modeColor },
      ]}
    >
      <AnimatedLinearGradient
        colors={[`rgba(0, 0, 0, 0)`, `rgba(0, 0, 0, 0.25)`]}
        start={{ x: 0, y: 0.2 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.container,
          {
            borderRadius,
            height: containerHeight,
            overflow: "hidden",
          },
        ]}
      >
        <Animated.View style={[styles.switchContainer, { top: topPosition }]}>
          <Text style={styles.modeText}>
            {mode === "fast" ? "고속" : "저속"}노화모드
          </Text>
          <ModeSwitch value={mode === "fast"} onValueChange={toggleMode} />
        </Animated.View>

        <Animated.View
          style={[styles.bottomContainer, { bottom: bottomPosition }]}
        >
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

export default StatusBanner;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
  },

  switchContainer: {
    position: "absolute",
    top: 14,
    left: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modeText: {
    color: Colors.background_yellow,
    fontFamily: "KCCGanpan",
    fontSize: 18,
  },

  bottomContainer: {
    position: "absolute",
    width: "100%",
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
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
