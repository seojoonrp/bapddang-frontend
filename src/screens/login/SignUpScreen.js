import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";
import { checkUsernameAvailability, handleSignUp } from "../../services/auth";
import ChevronIcon from "../../assets/icons/chevron.svg";
import EyeOpenIcon from "../../assets/icons/eye-open.svg";
import EyeClosedIcon from "../../assets/icons/eye-closed.svg";
import CheckYesIcon from "../../assets/icons/check-yes.svg";
import CheckNoIcon from "../../assets/icons/check-no.svg";
import CheckCircleYesIcon from "../../assets/icons/check-circle-yes.svg";
import CheckCircleNoIcon from "../../assets/icons/check-circle-no.svg";
import Colors from "../../constants/colors";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const StatusMessage = ({
  okMessage,
  errorMessage,
  isError,
  withIcon = true,
}) => {
  return (
    <View style={styles.statusMessageContainer}>
      {withIcon &&
        (isError ? (
          <CheckNoIcon width={16} height={16} />
        ) : (
          <CheckYesIcon width={16} height={16} />
        ))}
      <Text style={styles.statusMessageText}>
        {isError ? errorMessage : okMessage}
      </Text>
    </View>
  );
};

const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?-]).{8,}$/;

const SignUpScreen = () => {
  const navigation = useNavigation();

  const insets = useSafeAreaInsets();

  const [username, setUsername] = useState("");
  const [usernameCondition, setUsernameCondition] = useState(false);
  const [isUsernameChecked, setIsUsernameChecked] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const [pw, setPw] = useState("");
  const [pwCondition, setPwCondition] = useState(false);

  const [pwConfirm, setPwConfirm] = useState("");
  const [pwSame, setPwSame] = useState(false);

  const isComplete =
    usernameCondition &&
    !usernameExists &&
    isUsernameChecked &&
    pwCondition &&
    pwSame;

  const [loading, setLoading] = useState(false);

  const [isPwVisible, setIsPwVisible] = useState(false);
  const [isPwConfirmVisible, setIsPwConfirmVisible] = useState(false);

  const [showTerms, setShowTerms] = useState(false);

  const [agreedApp, setAgreedApp] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const isAllAgreed = agreedApp && agreedPrivacy;

  const toggleAll = () => {
    const newValue = !isAllAgreed;
    setAgreedApp(newValue);
    setAgreedPrivacy(newValue);
  };

  useEffect(() => {
    setUsernameCondition(username.length >= 3 && username.length <= 15);
    setIsUsernameChecked(false);
    setUsernameExists(false);
  }, [username]);

  const handleCheckUsername = async () => {
    if (!usernameCondition) {
      Alert.alert(
        "아이디 형식 오류",
        "아이디를 3자 이상 15자 이하로 입력해주세요!",
      );
      return;
    }

    setCheckingUsername(true);
    try {
      const exists = await checkUsernameAvailability(username);
      setUsernameExists(exists);
      setIsUsernameChecked(true);
    } catch (e) {
      console.log("Username check error:", e);
    } finally {
      setCheckingUsername(false);
    }
  };

  useEffect(() => {
    setPwCondition(PASSWORD_REGEX.test(pw));
    setPwSame(pw === pwConfirm && pw.length > 0);
  }, [pw, pwConfirm]);

  const handleAgree = async () => {
    if (loading || !isComplete || !isAllAgreed) return;
    setLoading(true);

    const success = await handleSignUp(username, pw);
    if (success) {
      setShowTerms(false);
      navigation.navigate("Welcome");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <View style={[styles.headerContainer, { top: insets.top + 8 }]}>
          <TouchableOpacity
            style={styles.goBackButton}
            onPress={() => navigation.goBack()}
          >
            <ChevronIcon width={24} height={24} color={Colors.light_red} />
          </TouchableOpacity>
          <Text style={styles.registerText}>회원가입</Text>
        </View>

        <View style={[styles.inputContainer, { marginBottom: 8 }]}>
          <Text style={styles.inputFieldText}>ID</Text>
          <View style={styles.idInputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.flexInput}
                placeholder="아이디를 입력해주세요..."
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  setIsUsernameChecked(false);
                }}
                autoCapitalize="none"
                placeholderTextColor={Colors.placeholder_gray}
              />
            </View>

            <TouchableOpacity
              onPress={handleCheckUsername}
              style={styles.checkButton}
              activeOpacity={0.7}
            >
              <Text style={styles.checkButtonText}>중복 확인</Text>
            </TouchableOpacity>
          </View>
          <StatusMessage
            okMessage="3자 이상 15자 이하"
            errorMessage="3자 이상 15자 이하"
            isError={!usernameCondition}
          />
          <StatusMessage
            okMessage={
              isUsernameChecked
                ? "사용 가능한 아이디입니다."
                : checkingUsername
                  ? "아이디 중복 확인 중..."
                  : ""
            }
            errorMessage="중복되는 아이디입니다."
            isError={usernameExists}
            withIcon={isUsernameChecked}
          />
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
          <StatusMessage
            okMessage="영문, 숫자, 특수문자 포함 8자 이상"
            errorMessage="영문, 숫자, 특수문자 포함 8자 이상"
            isError={!pwCondition}
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.flexInput}
              placeholder="비밀번호를 다시 입력해주세요..."
              value={pwConfirm}
              onChangeText={setPwConfirm}
              autoCapitalize="none"
              secureTextEntry={!isPwConfirmVisible}
              placeholderTextColor={Colors.placeholder_gray}
            />
            <TouchableOpacity
              onPress={() => setIsPwConfirmVisible(!isPwConfirmVisible)}
              style={styles.iconButton}
            >
              {isPwConfirmVisible ? (
                <EyeOpenIcon width={24} height={24} />
              ) : (
                <EyeClosedIcon width={24} height={24} />
              )}
            </TouchableOpacity>
          </View>
          <StatusMessage
            okMessage="비밀번호가 일치합니다."
            errorMessage="비밀번호가 일치하지 않습니다."
            isError={!pwSame}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.nextButton,
            {
              backgroundColor: isComplete
                ? Colors.background_yellow
                : "#bbbab8",
            },
          ]}
          onPress={() => setShowTerms(true)}
          disabled={!isComplete}
          activeOpacity={0.7}
        >
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>

        {/* 이용약관 모달 */}
        <Modal
          isVisible={showTerms}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          backdropOpacity={0.4}
          onBackdropPress={() => setShowTerms(false)}
          style={styles.modal}
          useNativeDriver={true}
        >
          <View style={styles.modalContent}>
            <View style={styles.grabBar} />

            <Text style={styles.modalTitle}>
              서비스 이용에 필요한 약관에 동의해주세요.
            </Text>

            <View style={styles.checkboxWrapper}>
              <Pressable style={styles.checkboxRow} onPress={toggleAll}>
                {isAllAgreed ? (
                  <CheckCircleYesIcon width={24} height={24} />
                ) : (
                  <CheckCircleNoIcon width={24} height={24} />
                )}
                <Text style={styles.termsText}>전체 동의</Text>
              </Pressable>

              <Pressable
                style={styles.checkboxRow}
                onPress={() => setAgreedApp(!agreedApp)}
              >
                {agreedApp ? (
                  <CheckCircleYesIcon width={24} height={24} />
                ) : (
                  <CheckCircleNoIcon width={24} height={24} />
                )}
                <Text style={styles.termsText}>[필수] 앱 이용약관 동의</Text>
              </Pressable>

              <Pressable
                style={styles.checkboxRow}
                onPress={() => setAgreedPrivacy(!agreedPrivacy)}
              >
                {agreedPrivacy ? (
                  <CheckCircleYesIcon width={24} height={24} />
                ) : (
                  <CheckCircleNoIcon width={24} height={24} />
                )}
                <Text style={styles.termsText}>
                  [필수] 개인정보 수집 및 이용 동의
                </Text>
              </Pressable>
            </View>

            <TouchableOpacity
              style={[
                styles.modalNextButton,
                {
                  backgroundColor: isAllAgreed
                    ? Colors.point_red
                    : Colors.text_gray,
                },
                {
                  borderColor: isAllAgreed
                    ? Colors.burn_red
                    : Colors.slightly_burn,
                },
              ]}
              onPress={handleAgree}
              disabled={!isAllAgreed}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.modalNextButtonText,
                  {
                    color: isAllAgreed ? Colors.background_yellow : Colors.burn,
                  },
                ]}
              >
                회원가입 완료
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.point_red,
    justifyContent: "flex-end",
    alignItems: "center",
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
  registerText: {
    fontFamily: "NanumSquareEB",
    fontSize: 18,
    color: Colors.light_red,
  },
  inputContainer: {
    width: "100%",
  },
  idInputContainer: {
    width: "100%",
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputFieldText: {
    fontFamily: "NanumSquareRoundEB",
    fontSize: 16,
    marginBottom: 6,
    color: Colors.light_red,
    marginLeft: 20,
  },
  inputWrapper: {
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background_white,
    borderRadius: 20,
    paddingHorizontal: 20,
    height: 60,
  },
  checkButton: {
    backgroundColor: "#b91914",
    paddingHorizontal: 16,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  checkButtonText: {
    color: Colors.background_white,
    fontFamily: "NanumSquareRoundB",
    fontSize: 16,
    letterSpacing: -0.3,
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
  statusMessageContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: 16,
    marginTop: 6,
  },
  statusMessageText: {
    color: Colors.background_yellow,
    fontSize: 13,
    fontFamily: "NanumSquareRoundB",
    marginTop: 2,
    marginLeft: 6,
  },
  checkText: {
    fontSize: 13,
    fontWeight: "bold",
    marginRight: 6,
  },
  nextButton: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 64,
    marginBottom: 100,
    paddingVertical: 16,
    borderRadius: 24,
    borderColor: Colors.slightly_burn,
    borderWidth: 1,
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: "NanumSquareB",
    color: Colors.burn,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 84,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  grabBar: {
    width: 36,
    height: 5,
    backgroundColor: Colors.light_gray,
    borderRadius: 3,
    marginBottom: 48,
  },
  modalTitle: {
    fontFamily: "NanumSquareEB",
    fontSize: 18,
    color: Colors.light_red,
    marginBottom: 30,
  },
  checkboxWrapper: {
    width: "100%",
    marginBottom: 30,
    marginLeft: 48,
    padding: 4,
    gap: 16,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  termsText: {
    fontFamily: "NanumSquareRoundB",
    fontSize: 16,
    color: Colors.burn,
    textDecorationLine: "underline",
  },
  modalNextButton: {
    width: "100%",
    paddingVertical: 16,
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
    color: Colors.light_red,
    fontFamily: "NanumSquareB",
    alignSelf: "center",
    fontSize: 15,
  },
});
