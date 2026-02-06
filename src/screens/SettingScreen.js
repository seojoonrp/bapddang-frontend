// src/screens/SettingScreen.js

import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { handleLogout, handleDeleteAccount } from "../services/auth";
import ChevronIcon from "../assets/icons/chevron.svg";
import Colors from "../constants/colors";

const SettingScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backContainer}
          onPress={() => navigation.goBack()}
        >
          <ChevronIcon width={28} height={28} color={Colors.setting_gray} />
        </TouchableOpacity>
        <Text style={styles.headerText}>설정</Text>
      </View>

      <View style={styles.infoRowContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>앱 버전</Text>
          <Text style={styles.infoValue}>v1.0.0</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>문의하기</Text>
          <Text style={styles.infoValue}>@bapddang</Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>로그아웃</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.background_yellow }]}
          activeOpacity={0.7}
          onPress={handleDeleteAccount}
        >
          <Text style={[styles.buttonText, { color: Colors.setting_gray }]}>
            회원 탈퇴
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background_yellow,
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 32,
  },
  header: {
    width: "100%",
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: Colors.light_text_gray,
    borderBottomWidth: 0.5,
  },
  backContainer: {
    position: "absolute",
    left: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: Colors.setting_gray,
    fontSize: 24,
    fontFamily: "NanumSquareRoundEB",
  },
  infoRowContainer: {
    width: "100%",
    paddingHorizontal: 28,
    gap: 24,
  },
  infoRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 18,
    color: Colors.setting_gray,
    fontFamily: "NanumSquareRoundB",
  },
  infoValue: {
    fontSize: 18,
    color: "#c69090",
    fontFamily: "NanumSquareRoundR",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  button: {
    width: 130,
    height: 48,
    backgroundColor: Colors.setting_gray,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 99,
    borderColor: Colors.setting_gray,
    borderWidth: 1.5,
  },
  buttonText: {
    fontSize: 18,
    color: Colors.background_yellow,
    fontFamily: "NanumSquareRoundB",
  },
});
