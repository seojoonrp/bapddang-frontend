// src/screens/login/LandingScreen.js

import { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  handleAppleLogin,
  handleGoogleLogin,
  handleKakaoLogin,
} from "../../services/auth";
import Colors from "../../constants/colors";
import GoogleIcon from "../../assets/icons/google.svg";
import KakaoIcon from "../../assets/icons/kakao.svg";
import AppleIcon from "../../assets/icons/apple.svg";
import LottieView from "lottie-react-native";

const LandingScreen = () => {
  const navigation = useNavigation();

  const onGoogleLoginPress = async () => {
    try {
      await handleGoogleLogin();
    } catch (error) {
      console.log("Failed Google login:", error);
    }
  };

  const onKakaoLoginPress = async () => {
    try {
      await handleKakaoLogin();
    } catch (error) {
      console.log("Failed Kakao login:", error);
    }
  };

  const onAppleLoginPress = async () => {
    try {
      await handleAppleLogin();
    } catch (error) {
      console.log("Failed Apple login:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.signupButton}
        onPress={() => navigation.navigate("SignUp")}
        activeOpacity={0.7}
      >
        <Text style={styles.signupButtonText}>회원가입</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate("Login")}
        activeOpacity={0.7}
      >
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>

      <View style={styles.socialButtonsRow}>
        <TouchableOpacity
          style={[styles.socialButton, { backgroundColor: "white" }]}
          onPress={onGoogleLoginPress}
          activeOpacity={0.7}
        >
          <GoogleIcon width={22} height={22} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.socialButton,
            { backgroundColor: Colors.kakao_yellow },
          ]}
          onPress={onKakaoLoginPress}
          activeOpacity={0.7}
        >
          <KakaoIcon width={24} height={24} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.socialButton, { backgroundColor: "black" }]}
          onPress={onAppleLoginPress}
          activeOpacity={0.7}
        >
          <AppleIcon width={24} height={24} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: Colors.point_red,
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 12,
    paddingBottom: 40,
    gap: 16,
  },
  logo: {
    color: Colors.background_yellow,
    fontFamily: "KCCGanpan",
    fontSize: 20,
    marginBottom: 90,
  },
  marshmallow: {
    justifyContent: "center",
    alignItems: "center",
  },
  signupButton: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: Colors.burn_red,
    borderColor: Colors.light_red,
    borderWidth: 1,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  signupButtonText: {
    color: Colors.background_yellow,
    textAlign: "center",
    fontFamily: "NanumSquareB",
    fontSize: 16,
  },
  loginButton: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: Colors.background_yellow,
    borderColor: Colors.slightly_burn,
    borderWidth: 1,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -4,
  },
  loginButtonText: {
    color: Colors.burn,
    textAlign: "center",
    fontFamily: "NanumSquareB",
    fontSize: 16,
  },
  socialButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
    marginBottom: 48,
  },
  socialButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 58,
    height: 58,
    borderColor: Colors.light_red,
    borderWidth: 1,
    borderRadius: 24,
  },
});
