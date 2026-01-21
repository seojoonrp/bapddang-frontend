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
import Animated from "react-native-reanimated";
import Colors from "../../constants/colors";
import useModeStore from "../../stores/modeStore";
import ModeSwitch from "../ModeSwitch";
import Favorite from "../svg/Favorite";
import Edit from "../svg/Edit";
import { useHeroAnimations } from "../../hooks/useHeroAnimations";
import { memo } from "react";

const Hero = ({ scrollY, scrollThreshold }) => {
  const navigation = useNavigation();

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

      <View style={styles.bottomContainer} pointerEvents="box-none">
        <TouchableOpacity onPress={() => navigation.navigate("DietLog")}>
          <View style={[styles.iconButton, { backgroundColor: modeColor }]}>
            <Edit color="white" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <View style={[styles.iconButton, { backgroundColor: modeColor }]}>
            <Favorite color="white" />
          </View>
        </TouchableOpacity>
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
