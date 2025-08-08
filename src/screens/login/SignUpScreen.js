import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../../firebase";

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

export default function SignUpEmailScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwCondition, setPwCondition] = useState(false);
  const [pwSame, setPwSame] = useState(false);
  const isCompleted = pwCondition && pwSame && email.length > 0;
  const [showTerms, setShowTerms] = useState(false);
  const [agreedCheck, setAgreedCheck] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
    setPwCondition(regex.test(pw));
    setPwSame(pw === pwConfirm && pw.length > 0);
  }, [pw, pwConfirm]);

  const handleSignUp = async () => {
    setError("");
    setSuccess("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        pw
      );
      await sendEmailVerification(userCredential.user);
      setSuccess("회원가입 성공! 이메일 인증을 완료해주세요.");
      navigation.navigate("EmailVerify", { expected: email });
    } catch (e) {
      if (e.code === "auth/email-already-in-use") {
        setError("이미 사용 중인 이메일입니다.");
      } else if (e.code === "auth/weak-password") {
        setError("비밀번호는 6자 이상이어야 합니다.");
      } else if (e.code === "auth/missing-email") {
        setError("이메일을 입력해주세요.");
      } else if (e.code === "auth/invalid-email") {
        setError("유효하지 않은 이메일 형식입니다.");
      } else {
        setError(e.message);
      }
    }
  };

  const handleEmailVerifyPress = () => {
    setAgreedCheck(false);
    setShowTerms(true);
  };

  const handleAgree = () => {
    setShowTerms(false);
    handleSignUp();
  };

  return (
    <View style={styles.container}>
              <View style={styles.mainContainer}>
        <Text style={styles.titleText}>
          E-mail
        </Text>
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

        <Text style={styles.titleText}>
          Password
        </Text>
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
              { color: pwCondition ? "#4caf50" : "#BE2C2C" }
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
              { color: pwSame ? "#4caf50" : "#BE2C2C" }
            ]}
          >
            {pwSame ? "✓" : "✗"}
          </Text>
          <Text style={styles.descText}>
            비밀번호 일치
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.nextButton,
            {backgroundColor: isCompleted ? "#FF7873" : "#FFD1D1"}
          ]}
          onPress={handleEmailVerifyPress}
          disabled={!isCompleted}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
            다음
          </Text>
        </TouchableOpacity>

        <Button
          title="로그인 하러가기"
          color="white"
          onPress={() => navigation.navigate("Login")}
        />

        {error ? (
          <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>
        ) : null}
        {success ? (
          <Text style={{ color: "green", marginTop: 10 }}>{success}</Text>
        ) : null}
      </View>

      <Modal
        visible={showTerms}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTerms(false)}
      >
        <View style={styles.modalOverlay}>
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

            <Button
              title="동의 후 인증메일 받기"
              onPress={handleAgree}
              disabled={!agreedCheck}
              color={!agreedCheck ? "gray" : undefined}
            />
            <View style={styles.buttonSpacing} />
            <Button title="취소" onPress={() => setShowTerms(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

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
    textAlignVertical: 'center',
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
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonSpacing: {
    height: 10,
  },
});