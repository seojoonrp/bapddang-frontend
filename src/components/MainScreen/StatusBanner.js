import { View, StyleSheet, TouchableOpacity, Text, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../styles/colors";
import Favorite from "../svg/Favorite";
import TEMP_Character from "../svg/TEMP_Character";

const StatusBanner = ({ isFast, onToggle }) => { 
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.curStreakText}>고속노화 Day 3</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <TouchableOpacity>
            <Favorite />
          </TouchableOpacity>
          <Switch
            style={{ transform: [{ scale: 0.8 }] }}
            trackColor={{ false: "#359c21", true: "#e02828" }}
            ios_backgroundColor="#359c21"
            thumbColor="#fcfcfc"
            onValueChange={onToggle}
            value={isFast}
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.dietLogButton}
        onPress={() => navigation.navigate("식단 기록 화면")}
      >
        <View style={styles.characterContainer}>
          <TEMP_Character />
        </View>
        <Text style={styles.dietLogText}>식단기록하러 가기 &gt;&gt;</Text>
      </TouchableOpacity>
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
    justifyContent: "space-between",
    marginBottom: 10,
  },
  characterContainer: {},
  curStreakText: {
    fontSize: 17,
    color: Colors.background_yellow,
    fontFamily: "NanumSquareRoundB",
  },
  dietLogText: {
    fontSize: 17,
    color: Colors.background_yellow,
    fontFamily: "NanumSquareRoundB",
    alignSelf: "flex-end",
  },
});