// src/components/common/SettingMenuHeader.js

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MAIN_LAYOUT } from "../../constants/layout";
import Colors from "../../constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SettingMenuHeader = ({ title }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>{"< "} 설정</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.headerLine} />
    </View>
  );
};

export default SettingMenuHeader;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
  },
  headerContainer: {
    height: MAIN_LAYOUT.HEADER,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 14,
  },
  title: {
    fontSize: 18,
    fontFamily: "NanumSquareRoundEB",
    color: Colors.nurim,
    letterSpacing: -0.3,
  },
  backButton: {
    position: "absolute",
    left: 18,
    bottom: 10,
    padding: 4,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: "NanumSquareRoundB",
    color: Colors.slightly_burn,
    letterSpacing: -0.5,
  },
  headerLine: {
    width: "100%",
    height: 1,
    backgroundColor: Colors.light_text_gray,
  },
});
