// src/screens/login/LandingScreen.js

import { memo, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  handleAgreeToTerms,
  handleAppleLogin,
  handleGoogleLogin,
  handleKakaoLogin,
} from "../../services/auth";
import Colors from "../../constants/colors";
import GoogleIcon from "../../assets/icons/google.svg";
import KakaoIcon from "../../assets/icons/kakao.svg";
import AppleIcon from "../../assets/icons/apple.svg";
import { useAuthStore } from "../../stores/authStore";
import AgreeBottomSheet from "../../components/common/AgreeBottomSheet";
import AppLogo from "../../assets/images/logo.svg";

const LandingScreen = () => {
  const navigation = useNavigation();

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.user);
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    if (isLoggedIn && user && !user.isAgreed) {
      setShowTerms(true);
    }
  }, [isLoggedIn, user]);

  const onSocialLogin = async (loginFunc) => {
    try {
      const { success, isAgreed } = await loginFunc();
      if (success && !isAgreed) {
        setShowTerms(true);
      }
    } catch (error) {
      console.log("Social login error:", error);
      Alert.alert(
        "로그인 실패",
        "소셜 로그인 중 오류가 발생했습니다. 다시 시도해주세요.",
      );
    }
  };

  const handleFinalAgree = async () => {
    try {
      const success = await handleAgreeToTerms();
      if (success) {
        setShowTerms(false);
      }
    } catch (error) {
      Alert.alert(
        "약관 동의 실패",
        "약관 동의에 실패했습니다. 다시 시도해주세요.",
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppLogo width={122} height={211} style={{ marginBottom: 75 }} />

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
          onPress={() => onSocialLogin(handleGoogleLogin)}
          activeOpacity={0.7}
        >
          <GoogleIcon width={22} height={22} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.socialButton,
            { backgroundColor: Colors.kakao_yellow },
          ]}
          onPress={() => onSocialLogin(handleKakaoLogin)}
          activeOpacity={0.7}
        >
          <KakaoIcon width={24} height={24} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.socialButton, { backgroundColor: "black" }]}
          onPress={() => onSocialLogin(handleAppleLogin)}
          activeOpacity={0.7}
        >
          <AppleIcon width={24} height={24} />
        </TouchableOpacity>
      </View>

      <AgreeBottomSheet
        isVisible={showTerms}
        onClose={() => setShowTerms(false)}
        onAgree={handleFinalAgree}
        isSocial={true}
        agreeText="서비스 시작하기"
      />
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
