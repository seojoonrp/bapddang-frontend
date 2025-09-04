import { View, StyleSheet, TouchableOpacity, Text, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../styles/colors";
import Favorite from "../svg/Favorite";
import Edit from "../svg/Edit";
import Character from "../svg/Character";

const StatusBanner = ({ isFast, onToggle }) => { 
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.curStreakText}>고속노화 Day 3</Text>
        <Switch
          style={{ transform: [{ scale: 0.8 }] }}
          trackColor={{ false: "#359c21", true: "#e02828" }}
          ios_backgroundColor="#359c21"
          thumbColor="#fcfcfc"
          onValueChange={onToggle}
          value={isFast}
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
    </View>
  );
};

export default StatusBanner;

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    flexDirection: "column",
    justifyContent: "center",
    marginTop: 22,
    marginBottom: 12,
    marginHorizontal: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: Colors.point_red,
  },
  topContainer: {
    alignSelf: "stretch",
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