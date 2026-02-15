// src/screens/settings/ChangePasswordScreen.js

import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import SettingMenuHeader from "../../components/common/SettingMenuHeader";
import Colors from "../../constants/colors";
import { useAuthStore } from "../../stores/authStore";
import CheckYesIcon from "../../assets/icons/check-yes.svg";
import CheckNoIcon from "../../assets/icons/check-no.svg";
import EyeOpenIcon from "../../assets/icons/eye-open.svg";
import EyeClosedIcon from "../../assets/icons/eye-closed.svg";
import { useState } from "react";
import { changePassword } from "../../services/user";

const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?-]).{8,}$/;

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
          <CheckNoIcon width={16} height={16} color={Colors.nurim} />
        ) : (
          <CheckYesIcon width={16} height={16} color={Colors.nurim} />
        ))}
      <Text style={styles.statusMessageText}>
        {isError ? errorMessage : okMessage}
      </Text>
    </View>
  );
};

const ChangePasswordScreen = () => {
  const user = useAuthStore((state) => state.user);
  const isLocalUser = user?.loginMethod === "local";

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isCurPwVisible, setIsCurPwVisible] = useState(false);
  const [isNewPwVisible, setIsNewPwVisible] = useState(false);
  const [isConfirmPwVisible, setIsConfirmPwVisible] = useState(false);

  const pwCondition = PASSWORD_REGEX.test(newPassword);
  const confirmPwCondition = newPassword === confirmPassword;
  const canSubmit = pwCondition && confirmPwCondition;

  const handleChangePassword = async () => {
    if (!canSubmit) return;

    try {
      const result = await changePassword(currentPassword, newPassword);

      if (!result.isCurrentPasswordValid) {
        Alert.alert(
          "현재 비밀번호가 올바르지 않습니다.",
          "현재 비밀번호를 다시 확인해주세요.",
        );
      } else if (result.success) {
        Alert.alert(
          "비밀번호 변경 성공",
          "비밀번호가 성공적으로 변경되었습니다.",
        );
      }
    } catch (error) {
      console.log("Failed to change password:", error);
    }
  };

  if (!isLocalUser) return null;

  return (
    <View style={styles.container}>
      <SettingMenuHeader title="비밀번호 변경" />

      <View style={styles.contentContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputFieldText}>현재 비밀번호</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.flexInput}
              placeholder="현재 비밀번호를 입력해주세요..."
              value={currentPassword}
              onChangeText={setCurrentPassword}
              autoCapitalize="none"
              secureTextEntry={!isCurPwVisible}
              placeholderTextColor={Colors.placeholder_gray}
            />
            <TouchableOpacity
              onPress={() => setIsCurPwVisible(!isCurPwVisible)}
              style={styles.iconButton}
            >
              {isCurPwVisible ? (
                <EyeOpenIcon width={24} height={24} />
              ) : (
                <EyeClosedIcon width={24} height={24} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.inputContainer, { marginTop: 12 }]}>
          <Text style={styles.inputFieldText}>새 비밀번호</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.flexInput}
              placeholder="새 비밀번호를 입력해주세요..."
              value={newPassword}
              onChangeText={setNewPassword}
              autoCapitalize="none"
              secureTextEntry={!isNewPwVisible}
              placeholderTextColor={Colors.placeholder_gray}
            />
            <TouchableOpacity
              onPress={() => setIsNewPwVisible(!isNewPwVisible)}
              style={styles.iconButton}
            >
              {isNewPwVisible ? (
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
          <Text style={styles.inputFieldText}>새 비밀번호 확인</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.flexInput}
              placeholder="새 비밀번호를 다시 입력해주세요..."
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
              secureTextEntry={!isConfirmPwVisible}
              placeholderTextColor={Colors.placeholder_gray}
            />
            <TouchableOpacity
              onPress={() => setIsConfirmPwVisible(!isConfirmPwVisible)}
              style={styles.iconButton}
            >
              {isConfirmPwVisible ? (
                <EyeOpenIcon width={24} height={24} />
              ) : (
                <EyeClosedIcon width={24} height={24} />
              )}
            </TouchableOpacity>
          </View>
          <StatusMessage
            okMessage="비밀번호가 일치합니다."
            errorMessage="비밀번호가 일치하지 않습니다."
            isError={!confirmPwCondition}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.confirmButton,
            !canSubmit && { backgroundColor: Colors.text_gray },
          ]}
          onPress={handleChangePassword}
          activeOpacity={0.7}
          disabled={!canSubmit}
        >
          <Text style={styles.confirmButtonText}>비밀번호 변경하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.background_white,
  },
  contentContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 28,
    marginTop: 32,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputFieldText: {
    fontFamily: "NanumSquareRoundEB",
    fontSize: 16,
    marginBottom: 8,
    color: Colors.nurim,
    marginLeft: 16,
    letterSpacing: -0.3,
  },
  inputWrapper: {
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 20,
    height: 60,
    borderColor: Colors.text_gray,
    borderWidth: 1,
  },
  flexInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    fontFamily: "NanumSquareB",
    color: Colors.burn,
    letterSpacing: 0.5,
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
    marginTop: 8,
  },
  statusMessageText: {
    color: Colors.slightly_burn,
    fontSize: 13,
    fontFamily: "NanumSquareRoundB",
    marginTop: 2,
    marginLeft: 6,
  },
  confirmButton: {
    backgroundColor: Colors.burn,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 40,
    marginTop: 24,
  },
  confirmButtonText: {
    color: Colors.background_white,
    fontSize: 16,
    fontFamily: "NanumSquareRoundB",
    letterSpacing: -0.3,
  },
});
