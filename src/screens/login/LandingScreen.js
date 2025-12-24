import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as AppleAuthentication from "expo-apple-authentication";

import useAuthStore from "../../stores/authStore";

import {
  handleAppleLogin,
  handleGoogleLogin,
  handleKakaoLogin,
} from "../../services/auth";
import Colors from "../../styles/colors";

const LandingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [checking, setChecking] = useState(true);

  const checkLoginSession = useAuthStore((state) => state.checkLoginStatus);

  // 로그인 세션 검사 -> 소셜로그인 테스트 때문에 꺼둠
  // useEffect(() => {
  //   const from = route.params?.from;

  //   const checkLoginStatus = async () => {
  //     // 온 곳이 있으면 로그아웃이므로 검사 X
  //     if (from) {
  //       setChecking(false);
  //       return;
  //     }

  //     const isLoggedIn = await checkLoginSession();

  //     if (isLoggedIn) {
  //       navigation.replace("Main");
  //     } else {
  //       setChecking(false);
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

  if (checking) {
    // 로딩화면 띄우면 좋을듯
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>로고임</Text>
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
      <Text
        style={styles.loginButtonText}
        onPress={() => navigation.navigate("Login")}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityRole="button"
      >
        이미 계정이 있다면? 로그인
      </Text>

      <TouchableOpacity
        onPress={onGoogleLoginPress}
        style={{ position: "absolute", top: 40, left: 40 }}
      >
        <Text style={styles.logo}>구글 로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onKakaoLoginPress}
        style={{ position: "absolute", top: 80, left: 40 }}
      >
        <Text style={styles.logo}>카카오 로그인</Text>
      </TouchableOpacity>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        borderRadius={5}
        style={{
          width: 200,
          height: 44,
          position: "absolute",
          top: 120,
          left: 40,
        }}
        onPress={onAppleLoginPress}
      />
    </View>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 57,
    backgroundColor: Colors.point_red,
  },
  logo: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 90,
  },
  guestButton: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: Colors.burn_red,
    borderColor: "#FF7873",
    borderWidth: 1,
    borderRadius: 24,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  guestButtonText: {
    color: Colors.background_yellow,
    textAlign: "center",
    fontFamily: "NanumSquareB",
    fontSize: 17,
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
    marginBottom: 90,
  },
  signUpButtonText: {
    color: Colors.burn,
    textAlign: "center",
    fontFamily: "NanumSquareB",
    fontSize: 17,
  },
  loginButtonText: {
    color: "#FF7873",
    textAlign: "center",
    fontFamily: "NanumSquareB",
    fontSize: 15,
  },
});
