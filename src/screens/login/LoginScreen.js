import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "../../api/api";

import Colors from "../../styles/colors";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pwCondition, setPwCondition] = useState(false);
  const [loading, setLoading] = useState(false);
  const isCompleted = pwCondition && email.length > 0;

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: email,
        password: pw,
      });

      const token = response.data?.token;

      if (token) {
        await AsyncStorage.setItem("jwt_token", token);
        console.log("Token:", token);

        // 일단 이메일 인증은 빼고
        navigation.navigate("메인 화면");
      } else {
        console.log("로그인은 했는데 토큰이 없음");
      }
    } catch (e) {
      if (e.response) {
        console.log("Server error:", e.response.data);
      } else if (e.request) {
        console.log("Network error:", e.request);
      } else {
        console.log("Error:", e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
    setPwCondition(regex.test(pw));

    // 임시로 아무 비번이나 되게 설정
    setPwCondition(true);
  }, [pw]);

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>E-mail</Text>
      <View style={styles.inputBg}>
        <TextInput
          style={styles.inputText}
          placeholder="이메일을 입력해주세요..."
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <Text style={styles.titleText}>Password</Text>
      <View style={styles.inputBg}>
        <TextInput
          style={styles.inputText}
          placeholder="비밀번호를 입력해주세요..."
          secureTextEntry
          value={pw}
          onChangeText={setPw}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.descContainer}>
        <Text
          style={[
            styles.checkText,
            { color: pwCondition ? Colors.point_green : Colors.burn },
          ]}
        >
          {pwCondition ? "✓" : "✗"}
        </Text>
        <Text style={styles.descText}>
          대문자, 소문자, 특수기호 포함 8자 이상
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.loginButton,
          {
            backgroundColor: isCompleted
              ? Colors.background_yellow
              : Colors.slightly_burn,
          },
        ]}
        onPress={handleLogin}
        disabled={!isCompleted || loading}
      >
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("SignUp")}
        disabled={loading}
      >
        <Text style={styles.backToSignupText}>회원가입 하러가기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 57,
    backgroundColor: Colors.point_red,
  },
  titleText: {
    fontSize: 17,
    fontFamily: "NanumSquareRoundEB",
    color: Colors.signup_desc,
    marginTop: 36,
    marginBottom: 6,
    marginLeft: 20,
  },
  inputBg: {
    width: "100%",
    padding: 20,
    marginBottom: 6,
    borderRadius: 20,
    backgroundColor: "#FFF",
    alignSelf: "center",
    justifyContent: "center",
  },
  inputText: {
    borderWidth: 0,
    fontSize: 17,
    fontFamily: "NanumSquareB",
    backgroundColor: "transparent",
    padding: 0,
    color: "#000",
    textAlignVertical: "center",
  },
  descContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 11,
    marginLeft: 18,
  },
  descText: {
    color: Colors.background_yellow,
    fontSize: 13,
    fontFamily: "NanumSquareRoundB",
  },
  checkText: {
    fontSize: 13,
    fontWeight: "bold",
    marginRight: 6,
  },
  loginButton: {
    width: "100%",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    paddingVertical: 16,
    borderWidth: 1,
    marginTop: 130,
    marginBottom: 90,
  },
  loginButtonText: {
    color: Colors.burn,
    textAlign: "center",
    fontFamily: "NanumSquareB",
    fontSize: 17,
  },
  backToSignupText: {
    color: Colors.signup_desc,
    textAlign: "center",
    fontFamily: "NanumSquareB",
    fontSize: 15,
  },
});
