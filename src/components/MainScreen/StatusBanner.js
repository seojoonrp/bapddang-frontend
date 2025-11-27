import { View, StyleSheet, TouchableOpacity, Text, Switch, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useModeStore from "../../stores/modeStore";
import Colors from "../../styles/colors";
import Favorite from "../svg/Favorite";
import Edit from "../svg/Edit";
import Character from "../svg/Character";

const StatusBanner = ({ scrollY, scrollThreshold }) => {
  const navigation = useNavigation();
  const { mode } = useModeStore();

  // 1. 빨간색 오버레이 투명도 (스크롤 내리면 0 -> 1)
  const redOverlayOpacity = scrollY.interpolate({
    inputRange: [0, scrollThreshold],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // 2. 내부 스위치 투명도 (스크롤 내리면 사라짐)
  const contentOpacity = scrollY.interpolate({
    inputRange: [0, scrollThreshold / 2],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* --- [배경 레이어 시작] --- */}
      
      {/* 1. 기본 초록색 배경 (항상 존재) */}
      <View style={[StyleSheet.absoluteFill, styles.bgLayer, { backgroundColor: Colors.point_green }]} />

      {/* 2. 빨간색 배경 (투명도로 조절) - Native Driver 호환 */}
      <Animated.View 
        style={[
          StyleSheet.absoluteFill, 
          styles.bgLayer, 
          { 
            backgroundColor: Colors.point_red,
            opacity: redOverlayOpacity 
          }
        ]} 
      />
      {/* --- [배경 레이어 끝] --- */}


      {/* 내부 스위치 (스크롤 시 사라짐) */}
      <Animated.View style={[styles.topContainer, { opacity: contentOpacity }]}>
        <Switch
          style={{ transform: [{ scale: 0.8 }] }}
          trackColor={{ false: "#359c21", true: "#e02828" }}
          thumbColor="#fcfcfc"
          value={mode === "fast"}
          disabled={true} 
        />
        <Text style={styles.curStreakText}>고속노화모드</Text>
      </Animated.View>

      <View style={styles.characterContainer}>
        <Character width={118.9614} height={123.28672} />
      </View>
      
      <View style={styles.bottomContainer}>
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
    </View>
  );
};

export default StatusBanner;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // backgroundColor 제거 (레이어로 처리)
    flexDirection: "column",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 15, // 내부 패딩 유지
  },
  bgLayer: {
    borderRadius: 16, // 둥근 모서리 유지
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
    marginBottom: 10,
  },
  characterContainer: {
    marginBottom: 10,
  },
  curStreakText: {
    fontSize: 17,
    color: Colors.background_yellow,
    fontFamily: "NanumSquareRoundB",
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end", 
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.point_red,
    borderWidth: 1.5,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
});