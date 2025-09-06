import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../styles/colors";

const RecentFav = ({ isFast }) => {
  const navigation = useNavigation();
  const [animValue] = useState(new Animated.Value(isFast ? 1 : 0));

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: isFast ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isFast, animValue]);

  const textColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.point_green, Colors.burn_red],
  });

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.favText, { color: textColor }]}>
        최근 좋아요한 음식들
      </Animated.Text>
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

export default RecentFav;

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    flexDirection: "column",
    marginHorizontal: 18,
    marginBottom: 12,
  },
  favText: {
    fontSize: 15,
    fontFamily: "NanumSquareRoundB",
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