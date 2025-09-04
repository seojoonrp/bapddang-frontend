import { View, StyleSheet, TouchableOpacity, Text,ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

import StatusBanner from "./StatusBanner";
import FoodCardNews from "./FoodCardNews";
import RecentZzim from "./RecentZzim";

const MainScreen_Fast = ({ isFast, onToggle }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBanner isFast={isFast} onToggle={onToggle} />
      <RecentZzim />
      <FoodCardNews mode="fast" />
    </View>
  );
};

export default MainScreen_Fast;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,

    borderColor: "black",
    borderWidth: 1,
  },
});
