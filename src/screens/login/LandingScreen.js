import React, { memo, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  handleAppleLogin,
  handleGoogleLogin,
  handleKakaoLogin,
} from "../../services/auth";
import api from "../../api/api";
import Colors from "../../constants/colors";
import GoogleIcon from "../../assets/icons/google.svg";
import KakaoIcon from "../../assets/icons/kakao.svg";
import AppleIcon from "../../assets/icons/apple.svg";
import LottieView from "lottie-react-native";

const MarshmallowAnimation = memo(() => {
  return (
    <LottieView
      source={require("../../assets/lottie/marshmallow-rotate.json")}
      autoPlay
      loop
      width={200}
      height={185}
      renderMode="hardware"
    />
  );
});

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
      <View style={styles.marshmallow}>
        <MarshmallowAnimation />
      </View>
      <Text style={styles.logo}>밥땡</Text>

      <TouchableOpacity
        style={styles.guestButton}
        onPress={() => Alert.alert("게스트 기능은 곧 제공될 예정입니다.")}
        activeOpacity={0.7}
      >
        <Text style={styles.guestButtonText}>게스트로 둘러보기</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.signUpButton}
        onPress={() => navigation.navigate("SignUp", { from: "Landing" })}
        activeOpacity={0.7}
      >
        <Text style={styles.signUpButtonText}>회원가입</Text>
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

      <Text
        style={styles.loginButtonText}
        onPress={() => navigation.navigate("Login")}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityRole="button"
      >
        이미 계정이 있다면? 로그인
      </Text>
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
    color: Colors.background_yellow,
    fontFamily: "KCCGanpan",
    fontSize: 20,
    marginBottom: 90,
  },
  marshmallow: {
    marginBottom: -24,
    justifyContent: "center",
    alignItems: "center",
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
