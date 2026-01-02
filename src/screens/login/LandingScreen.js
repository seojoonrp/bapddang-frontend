import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import GoogleIcon from "../../assets/icons/google.svg";
import KakaoIcon from "../../assets/icons/kakao.svg";
import AppleIcon from "../../assets/icons/apple.svg";

import useAuthStore from "../../stores/authStore";

import {
  handleAppleLogin,
  handleGoogleLogin,
  handleKakaoLogin,
} from "../../services/auth";
import Colors from "../../constants/colors";
import DebugButton from "../../components/DebugButton";
import api from "../../api/api";
import { SafeAreaView } from "react-native-safe-area-context";

const LandingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [isServerOnline, setIsServerOnline] = useState(false);
  const checkPing = async () => {
    try {
      const response = await api.get("/ping");
      if (response.status === 200) {
        console.log("Ping response:", response.data);
        setIsServerOnline(true);
      } else {
        console.log("Server is offline or returned an error.");
        setIsServerOnline(false);
      }
    } catch (error) {
      console.log("Ping error:", error);
      setIsServerOnline(false);
    }
  };

  const [checking, setChecking] = useState(true);

  // const checkLoginSession = useAuthStore((state) => state.checkLoginStatus);

  // useEffect(() => {
  //   const from = route.params?.from;

  //   const checkLoginStatus = async () => {
  //     // 온 곳이 있으면 로그아웃이므로 검사 X
  //     if (from) return;

  //     const isLoggedIn = await checkLoginSession();

  //     if (isLoggedIn) {
  //       navigation.replace("Main");
  //     }
  //   };

  //   checkLoginStatus();
  // }, [navigation, route.params]);

  const onGoogleLoginPress = async () => {
    try {
      const success = await handleGoogleLogin();
      if (success) {
        navigation.navigate("Main");
      }
    } catch (error) {
      console.log("Landing Screen Google Login Error:", error);
    }
  };

  const onKakaoLoginPress = async () => {
    try {
      const success = await handleKakaoLogin();
      if (success) {
        navigation.navigate("Main");
      }
    } catch (error) {
      console.log("Landing Screen Kakao Login Error:", error);
    }
  };

  const onAppleLoginPress = async () => {
    try {
      const success = await handleAppleLogin();
      if (success) {
        navigation.navigate("Main");
      }
    } catch (error) {
      console.log("Landing Screen Apple Login Error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>밥땡</Text>

      <TouchableOpacity
        style={styles.guestButton}
        onPress={() => navigation.navigate("Main")}
      >
        <Text style={styles.guestButtonText}>게스트로 둘러보기</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.signUpButton}
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text style={styles.signUpButtonText}>회원가입</Text>
      </TouchableOpacity>

      <View style={styles.socialButtonsRow}>
        <TouchableOpacity
          style={[styles.socialButton, { backgroundColor: "white" }]}
          onPress={onGoogleLoginPress}
        >
          <GoogleIcon width={22} height={22} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.socialButton,
            { backgroundColor: Colors.kakao_yellow },
          ]}
          onPress={onKakaoLoginPress}
        >
          <KakaoIcon width={24} height={24} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.socialButton, { backgroundColor: "black" }]}
          onPress={onAppleLoginPress}
        >
          <AppleIcon width={24} height={24} />
        </TouchableOpacity>
      </View>

      <Text
        style={styles.loginButtonText}
        onPress={() => navigation.navigate("Login")}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityRole="button"
      >
        이미 계정이 있다면? 로그인
      </Text>

      <DebugButton
        index={0}
        label={"Server response check"}
        onPress={() => checkPing()}
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
    paddingBottom: 24,
    gap: 16,
  },
  logo: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 192,
  },
  guestButton: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: Colors.burn_red,
    borderColor: Colors.light_red,
    borderWidth: 1,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  guestButtonText: {
    color: Colors.background_yellow,
    textAlign: "center",
    fontFamily: "NanumSquareB",
    fontSize: 16,
  },
  signUpButton: {
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
  signUpButtonText: {
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
  loginButtonText: {
    color: Colors.light_red,
    textAlign: "center",
    fontFamily: "NanumSquareB",
    fontSize: 16,
  },
});
