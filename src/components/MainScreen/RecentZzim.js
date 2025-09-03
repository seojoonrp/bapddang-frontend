import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../styles/colors";

const RecentZzim = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.zzimText}>최근 찜한 음식들</Text>
      <View style={styles.foodContainer}>
        <TouchableOpacity style={styles.food} />
        <TouchableOpacity style={styles.food} />
        <TouchableOpacity style={styles.food} />
        <TouchableOpacity style={styles.food} />
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>&gt;&gt;</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RecentZzim;

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    flexDirection: "column",
    marginHorizontal: 18,
    marginBottom: 12,
  },
  zzimText: {
    fontSize: 15,
    fontFamily: "NanumSquareRoundB",
    color: Colors.burn_red,
    marginBottom: 6,
    marginLeft: 4,
  },
  foodContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  food: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.point_red,
    marginHorizontal: 6,
  },
  viewAllButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#CCC",
    marginHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 2,
  },
  viewAllText: {
    fontSize: 17,
    fontFamily: "NanumSquareRoundEB",
    color: "#FFF",
    textAlign: "center",
  },
});