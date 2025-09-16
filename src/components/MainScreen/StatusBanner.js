import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Switch,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import useModeStore from "../../stores/modeStore";

import Colors from "../../styles/colors";
import Favorite from "../svg/Favorite";
import Edit from "../svg/Edit";
import Character from "../svg/Character";

const StatusBanner = () => {
  const navigation = useNavigation();

  const { mode, toggleMode } = useModeStore();

  const [animValue] = useState(new Animated.Value(mode === "fast" ? 1 : 0));

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: mode === "fast" ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [mode, animValue]);

  const backgroundColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.point_green, Colors.point_red],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <View style={styles.topContainer}>
        <Text style={styles.curStreakText}>고속노화 Day 3</Text>
        <Switch
          style={{ transform: [{ scale: 0.8 }] }}
          trackColor={{ false: "#359c21", true: "#e02828" }}
          ios_backgroundColor="#359c21"
          thumbColor="#fcfcfc"
          onValueChange={toggleMode}
          value={mode === "fast"}
        />
      </View>
      <View style={styles.characterContainer}>
        <Character width={118.9614} height={123.28672} />
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("식단 기록 화면")}>
          <Edit />
        </TouchableOpacity>
        <TouchableOpacity>
          <Favorite />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default StatusBanner;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 16,
  },
  topContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
    marginBottom: 10,
  },
  characterContainer: {},
  curStreakText: {
    fontSize: 17,
    color: Colors.background_yellow,
    fontFamily: "NanumSquareRoundB",
  },
  bottomContainer: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },
});
