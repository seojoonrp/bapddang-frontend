import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import Colors from "../../constants/colors";

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>밥땡에 오신 것을{"\n"}환영합니다.</Text>
      <Text style={styles.doneText}>회원가입 완료!</Text>
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.replace("Login")}
      >
        <Text style={styles.nextButtonText}>로그인하러 가기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.point_red,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: 12,
    paddingTop: 64,
    paddingHorizontal: 12,
  },
  titleText: {
    fontSize: 18,
    fontFamily: "NanumSquareRoundEB",
    color: Colors.background_yellow,
    textAlign: "center",
  },
  doneText: {
    fontSize: 16,
    fontFamily: "NanumSquareB",
    color: Colors.light_red,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 144,
  },
  nextButton: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: Colors.background_yellow,
    paddingVertical: 16,
    borderRadius: 24,
    borderColor: Colors.slightly_burn,
    borderWidth: 1,
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: "NanumSquareB",
    color: Colors.burn,
  },
});
