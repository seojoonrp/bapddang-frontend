import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Switch,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import useModeStore from "../../stores/modeStore";
import Colors from "../../styles/colors";
import Favorite from "../svg/Favorite";
import Edit from "../svg/Edit";
import Character from "../svg/Character";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const StatusBanner = ({ scrollY, scrollThreshold, heightRange }) => {
  const navigation = useNavigation();
  const { mode } = useModeStore();

  const borderRadius = scrollY.interpolate({
    inputRange: [scrollThreshold * 0.7, scrollThreshold],
    outputRange: [20, 0],
    extrapolate: "clamp",
  });

  const containerHeight = scrollY.interpolate({
    inputRange: [scrollThreshold * 0.5, scrollThreshold],
    outputRange: heightRange,
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[styles.container, { borderRadius, height: containerHeight }]}
    >
      <AnimatedLinearGradient
        colors={["#E92F0500", "#5E101060"]}
        start={{ x: 0, y: 0 }}
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
        <Animated.View style={styles.topContainer}>
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
      </AnimatedLinearGradient>
    </Animated.View>
  );
};

export default StatusBanner;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: Colors.point_red,
    flexDirection: "column",
    justifyContent: "center",
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
    marginHorizontal: 14,
    marginBottom: 8,
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
