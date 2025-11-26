import { useEffect, useState, useRef } from "react";
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

const StatusBanner = ({ isExpanded }) => {
  const navigation = useNavigation();
  const { mode, toggleMode } = useModeStore();

  const [animValue] = useState(new Animated.Value(mode === "fast" ? 1 : 0));
  const radiusAnim = useRef(new Animated.Value(16)).current; // 모서리 둥글기 제어

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: mode === "fast" ? 1 : 0,
      duration: 300,
      useNativeDriver: false, // 여기도 false (색상 변경)
    }).start();
  }, [mode, animValue]);

  // 확장 여부에 따라 모서리 둥글기 변경 (16 -> 0)
  useEffect(() => {
    Animated.timing(radiusAnim, {
      toValue: isExpanded ? 0 : 16,
      duration: 200,
      useNativeDriver: false, // radius 변경도 false
    }).start();
  }, [isExpanded]);

  const backgroundColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.point_green, Colors.point_red],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor,
          borderRadius: radiusAnim,
          paddingBottom: isExpanded ? 40 : 12, // 확장 시 하단 여백 추가
        },
      ]}
    >
      <View style={styles.topContainer}>
        <Switch
          style={{ transform: [{ scale: 0.8 }] }}
          trackColor={{ false: "#359c21", true: "#e02828" }}
          ios_backgroundColor="#359c21"
          thumbColor="#fcfcfc"
          onValueChange={toggleMode}
          value={mode === "fast"}
        />
        <Text style={styles.curStreakText}>고속노화모드</Text>
      </View>
      <View style={styles.characterContainer}>
        <Character width={118.9614} height={123.28672} />
      </View>
      <View style={styles.bottomContainer}>
        {/* Framework Style: White Border + Red BG + White Icon */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("DietLog")}
        >
          <Edit color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Favorite color="white" />
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
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.point_red, // 빨간 배경
    borderWidth: 1.5,
    borderColor: "white", // 흰색 테두리
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
});