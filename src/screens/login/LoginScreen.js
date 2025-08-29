import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Text, TouchableOpacity } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
import Colors from "../../styles/colors";
import { StyleSheet } from "react-native";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pwCondition, setPwCondition] = useState(false);
  const isCompleted = pwCondition && email.length > 0;

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pw);
      if (!userCredential.user.emailVerified) {
        console.log("이메일 인증을 완료해주세요.");
        return;
      } else {
        navigation.navigate("메인 화면", { replace: true });
      }
    } catch (e) {
      console.log("Error:", e.message);
    }
  };

  useEffect(() => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
    setPwCondition(regex.test(pw));
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
            { color: pwCondition ? "#4caf50" : "#BE2C2C" },
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
        disabled={!isCompleted}
      >
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.backToSignupText}>회원가입 하러가기</Text>
      </TouchableOpacity>
    </View>
  );
}

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
