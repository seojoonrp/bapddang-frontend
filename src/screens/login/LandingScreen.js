import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../../services/firebase";
import Colors from "../../styles/colors";

const LandingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const from = route.params?.from;
    // 로그인 세션 여부 확인
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!from && user) {
        // 이미 로그인 되어 있으면 이메일 인증 여부 체크해서 라우팅
        if (user.emailVerified) {
          navigation.replace("메인 화면");
        } else {
          navigation.replace("EmailVerify");
        }
      } else {
        setChecking(false);
      }
    });

    return unsub;
  }, [navigation, route.params]);

  if (checking) {
    // 로딩화면 띄우면 좋을듯
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>로고임</Text>
      <TouchableOpacity
        style={styles.guestButton}
        onPress={() => navigation.navigate("메인 화면")}
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
    </View>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 12,
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
    marginBottom: 90,
    alignItems: "center",
    justifyContent: "center",
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
    fontSize: 17,
  },
});
