import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const handleLogin = async () => {
    setError("");
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

  return (
    <View style={{ padding: 40, flex: 1, backgroundColor: "white" }}>
      <Text style={{ fontWeight: "bold", fontSize: 24, marginBottom: 60 }}>
        로그인
      </Text>
      <Text style={{ fontWeight: "bold", fontSize: 14, marginBottom: 10 }}>
        이메일
      </Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          marginBottom: 40,
          borderWidth: 1,
          padding: 10,
          borderRadius: 5,
        }}
      />
      <Text style={{ fontWeight: "bold", fontSize: 14, marginBottom: 10 }}>
        비밀번호
      </Text>
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={pw}
        onChangeText={setPw}
        style={{
          marginBottom: 185,
          borderWidth: 1,
          padding: 10,
          borderRadius: 5,
        }}
      />
      <Button title="로그인" onPress={handleLogin} />
      <View style={{ height: 10 }} />
      <Button
        title="회원가입 하러가기"
        onPress={() => navigation.navigate("SignUp")}
      />
    </View>
  );
}
