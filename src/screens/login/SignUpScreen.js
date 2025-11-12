import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";

import api from "../../api/api";

import Colors from "../../styles/colors";

function CustomCheckBox({ value, onValueChange }) {
  return (
    <TouchableOpacity
      onPress={() => onValueChange(!value)}
      style={{
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: "gray",
        backgroundColor: value ? "#4caf50" : "white",
        marginRight: 8,
      }}
    />
  );
}

const SignUpScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const [pwConfirm, setPwConfirm] = useState("");
  const [pwCondition, setPwCondition] = useState(false);
  const [pwSame, setPwSame] = useState(false);
  const [loading, setLoading] = useState(false);
  const isCompleted = pwCondition && pwSame && email.length > 0;

  const [showTerms, setShowTerms] = useState(false);
  const [agreedCheck, setAgreedCheck] = useState(false);

  useEffect(() => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
    setPwCondition(regex.test(pw));
    setPwSame(pw === pwConfirm && pw.length > 0);

    // 임시로 아무 비번이나 되게 설정
    setPwCondition(true);
  }, [pw, pwConfirm]);

  const handleEmailVerifyPress = () => {
    setAgreedCheck(false);
    setShowTerms(true);
  };

  const handleAgree = () => {
    setShowTerms(false);
    handleSignUp();
  };

  const handleSignUp = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const userName = email.split("@")[0];

      const response = await api.post("/auth/signup", {
        email: email,
        password: pw,
        userName: userName,
      });

      if (response.status === 201) {
        console.log("SignUp successful:", response.data);
        navigation.navigate("Login");
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

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <Text style={styles.titleText}>E-mail</Text>
        <View style={styles.inputBg}>
          <TextInput
            style={styles.inputText}
            placeholder="이메일을 입력해주세요..."
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#aaa"
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
            placeholderTextColor="#aaa"
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

        <View style={styles.inputBg}>
          <TextInput
            style={styles.inputText}
            placeholder="비밀번호를 다시 입력해주세요..."
            secureTextEntry
            value={pwConfirm}
            onChangeText={setPwConfirm}
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.descContainer}>
          <Text
            style={[
              styles.checkText,
              { color: pwSame ? "#4caf50" : "#BE2C2C" },
            ]}
          >
            {pwSame ? "✓" : "✗"}
          </Text>
          <Text style={styles.descText}>비밀번호 일치</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.nextButton,
            {
              backgroundColor: isCompleted
                ? Colors.background_yellow
                : Colors.slightly_burn,
            },
          ]}
          onPress={handleEmailVerifyPress}
          disabled={!isCompleted}
        >
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.backToLoginText}>로그인 하러가기</Text>
        </TouchableOpacity>
      </View>

      <Modal
        isVisible={showTerms}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropOpacity={0.5}
        onBackdropPress={() => setShowTerms(false)}
        style={{ margin: 0 }}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            서비스 이용에 필요한 약관에 동의해주세요.
          </Text>

          <View style={styles.checkboxContainer}>
            <CustomCheckBox
              value={agreedCheck}
              onValueChange={setAgreedCheck}
            />
            <Text style={styles.termsText}>[필수] 동의</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.modalNextButton,
              {
                backgroundColor: agreedCheck
                  ? Colors.point_red
                  : Colors.text_gray,
              },
              {
                borderColor: agreedCheck
                  ? Colors.burn_red
                  : Colors.slightly_burn,
              },
            ]}
            onPress={handleAgree}
            disabled={!agreedCheck}
          >
            <Text
              style={[
                styles.modalNextButtonText,
                { color: agreedCheck ? Colors.background_yellow : Colors.burn },
              ]}
            >
              인증메일 받기
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modalNextButton,
              { backgroundColor: Colors.text_gray },
            ]}
            onPress={() => setShowTerms(false)}
          >
            <Text style={styles.modalNextButtonText}>취소</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    paddingBottom: 57,
  },
  mainContainer: {
    width: "100%",
  },
  titleText: {
    fontFamily: "NanumSquareRoundEB",
    fontSize: 17,
    marginTop: 24,
    marginBottom: 6,
    color: Colors.signup_desc,
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
  nextButton: {
    width: "100%",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 72,
    marginBottom: 90,
    paddingVertical: 16,
    borderWidth: 1,
  },
  nextButtonText: {
    fontSize: 17,
    fontFamily: "NanumSquareB",
    color: Colors.burn,
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 20,
    paddingHorizontal: 25,
    paddingVertical: 30,
    borderRadius: 20,
  },
  modalTitle: {
    fontFamily: "NanumSquareEB",
    fontSize: 16,
    color: Colors.signup_desc,
    marginBottom: 30,
  },
  checkboxContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 30,
    paddingLeft: 12,
  },
  termsText: {
    fontFamily: "NanumSquareRoundB",
    fontSize: 15,
    color: Colors.burn,
  },
  modalNextButton: {
    width: "100%",
    padding: 16,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 12,
    borderWidth: 1,
  },
  modalNextButtonText: {
    color: Colors.burn,
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "NanumSquareB",
  },
  backToLoginText: {
    color: Colors.signup_desc,
    fontFamily: "NanumSquareB",
    alignSelf: "center",
    fontSize: 15,
  },
});
