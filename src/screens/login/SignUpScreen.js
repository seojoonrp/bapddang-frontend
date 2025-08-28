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
import { signUpUser } from "../../services/user";

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

const SignUpEmailScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const [pwConfirm, setPwConfirm] = useState("");
  const [pwCondition, setPwCondition] = useState(false);
  const [pwSame, setPwSame] = useState(false);
  const isCompleted = pwCondition && pwSame && email.length > 0;

  const [showTerms, setShowTerms] = useState(false);
  const [agreedCheck, setAgreedCheck] = useState(false);

  useEffect(() => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
    setPwCondition(regex.test(pw));
    setPwSame(pw === pwConfirm && pw.length > 0);
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
    const result = await signUpUser(email, pw);

    if (result.success) {
      console.log("회원가입 성공:", result.user);
      navigation.navigate("EmailVerify");
    } else {
      console.log("회원가입 실패:", result.error);
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
            { backgroundColor: isCompleted ? "#FF7873" : "#FFD1D1" },
          ]}
          onPress={handleEmailVerifyPress}
          disabled={!isCompleted}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
            다음
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text>로그인 하러가기</Text>
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
            서비스 이용에 필요한{"\n"}약관에 동의해주세요.
          </Text>

          <View style={styles.checkboxContainer}>
            <CustomCheckBox
              value={agreedCheck}
              onValueChange={setAgreedCheck}
            />
            <Text>[필수] 동의</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.modalNextButton,
              { backgroundColor: agreedCheck ? Colors.point_red : "#c8c8c8ff" },
            ]}
            onPress={handleAgree}
            disabled={!agreedCheck}
          >
            <Text style={styles.modalNextButtonText}>인증메일 받기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalNextButton, { backgroundColor: "#c8c8c8ff" }]}
            onPress={() => setShowTerms(false)}
          >
            <Text style={styles.modalNextButtonText}>취소</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default SignUpEmailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    maxWidth: 430,
  },
  mainContainer: {
    width: "100%",
    maxWidth: 430,
    paddingHorizontal: 10,
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 14,
    marginTop: 24,
    marginBottom: 6,
    color: "#BE2C2C",
    marginLeft: 20,
  },
  inputBg: {
    height: 59,
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
    fontSize: 14,
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
    color: "white",
    fontSize: 13,
  },
  checkText: {
    fontSize: 13,
    fontWeight: "bold",
    marginRight: 6,
  },
  nextButton: {
    width: "100%",
    height: 51,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 72,
    marginBottom: 32,
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 20,
    padding: 25,
    borderRadius: 20,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 20,
  },
  checkboxContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 20,
  },
  modalNextButton: {
    width: "100%",
    height: 51,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 12,
    backgroundColor: Colors.point_red,
  },
  modalNextButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
