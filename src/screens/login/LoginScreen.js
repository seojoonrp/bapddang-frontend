import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ChevronIcon from "../../assets/icons/chevron.svg";
import EyeOpenIcon from "../../assets/icons/eye-open.svg";
import EyeClosedIcon from "../../assets/icons/eye-closed.svg";

import api from "../../api/api";
import { handleLogin } from "../../services/auth";

import Colors from "../../constants/colors";

const LoginScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [pw, setPw] = useState("");
  const [isPwVisible, setIsPwVisible] = useState(false);
  const isComplete = username.length > 0 && pw.length > 0;

  const onLoginPress = async () => {
    if (!isComplete || loading) return;

    try {
      const success = await handleLogin(username, pw);
      setLoading(false);

      if (success) {
        navigation.navigate("Main");
      } else {
        console.log("Login failed");
      }
    } catch (error) {
      console.log("Login page error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <View style={[styles.headerContainer, { top: insets.top + 8 }]}>
          <TouchableOpacity
            style={styles.goBackButton}
            onPress={() => navigation.replace("Landing")}
          >
            <ChevronIcon width={24} height={24} />
          </TouchableOpacity>
          <Text style={styles.loginText}>로그인</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputFieldText}>ID</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.flexInput}
              placeholder="아이디를 입력해주세요..."
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholderTextColor={Colors.placeholder_gray}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputFieldText}>Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.flexInput}
              placeholder="비밀번호를 입력해주세요..."
              value={pw}
              onChangeText={setPw}
              autoCapitalize="none"
              secureTextEntry={!isPwVisible}
              placeholderTextColor={Colors.placeholder_gray}
              textContentType="password"
            />
            <TouchableOpacity
              onPress={() => setIsPwVisible(!isPwVisible)}
              style={styles.iconButton}
            >
              {isPwVisible ? (
                <EyeOpenIcon width={24} height={24} />
              ) : (
                <EyeClosedIcon width={24} height={24} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={onLoginPress}
          disabled={!isComplete || loading}
        >
          <Text style={styles.loginButtonText}>로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.backToSignupText}>
            계정이 없나요?{" "}
            <Text style={{ textDecorationLine: "underline" }}>
              회원가입 하러가기
            </Text>
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.point_red,
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    gap: 12,
    paddingHorizontal: 12,
  },
  headerContainer: {
    position: "absolute",
    width: "100%",
    alignItems: "center",
  },
  goBackButton: {
    position: "absolute",
    left: 12,
  },
  loginText: {
    fontFamily: "NanumSquareEB",
    fontSize: 18,
    color: Colors.light_red,
  },
  inputContainer: {
    width: "100%",
  },
  inputFieldText: {
    fontFamily: "NanumSquareRoundEB",
    fontSize: 16,
    marginBottom: 6,
    color: Colors.light_red,
    marginLeft: 20,
  },
  inputWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background_white,
    borderRadius: 20,
    paddingHorizontal: 20,
    height: 60,
  },
  flexInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    fontFamily: "NanumSquareB",
    color: Colors.burn,
  },
  iconButton: {
    marginLeft: 10,
    padding: 5,
  },
  loginButton: {
    width: "100%",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: Colors.background_yellow,
    paddingVertical: 16,
    borderWidth: 1,
    marginTop: 144,
    marginBottom: 16,
  },
  loginButtonText: {
    color: Colors.burn,
    textAlign: "center",
    fontFamily: "NanumSquareB",
    fontSize: 16,
  },
  backToSignupText: {
    color: Colors.light_red,
    textAlign: "center",
    fontFamily: "NanumSquareB",
    fontSize: 16,
    marginBottom: 48,
  },
});
