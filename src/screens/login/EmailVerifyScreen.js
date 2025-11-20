import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import Colors from "../../styles/colors";
import { createUserDocument } from "../../services/user";

const EmailVerifyScreen = () => {
  const navigation = useNavigation();

  const checkVerification = async () => {
    // try {
    //   await auth.currentUser.reload();
    //   const currentUser = auth.currentUser;

    //   if (!currentUser.emailVerified) {
    //     console.log("Email not verified yet.");
    //   } else {
    //     console.log("이메일 인증이 완료되었습니다!");

    //     await createUserDocument(currentUser);
    //     setTimeout(() => {
    //       navigation.replace("메인 화면", { replace: true });
    //     }, 500);
    //   }
    // } catch (e) {
    //   console.log("Error:", e.message);
    // }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.noticeText}>
        이메일에서 인증 후{"\n"}인증 완료를 눌러주세요!
      </Text>

      <View style={styles.emailContainer}>
        <Text style={styles.emailText}>{}</Text>
      </View>

      <TouchableOpacity style={styles.finishButton} onPress={checkVerification}>
        <Text style={styles.finishButtonText}>인증 완료</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmailVerifyScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: Colors.point_red,
    paddingBottom: 164,
  },
  noticeText: {
    color: Colors.background_yellow,
    textAlign: "left",
    alignSelf: "flex-start",
    marginLeft: 20,
    fontFamily: "NanumSquareRoundEB",
    fontSize: 18,
    lineHeight: 23,
    marginBottom: 32,
  },
  emailContainer: {
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "left",
    marginBottom: 231,
  },
  emailText: {
    color: Colors.burn_red,
    fontFamily: "NanumSquareB",
    fontSize: 17,
  },
  finishButton: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: Colors.background_yellow,
    borderColor: Colors.slightly_burn,
    borderWidth: 1,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  finishButtonText: {
    color: Colors.burn,
    textAlign: "center",
    fontFamily: "NanumSquareB",
    fontSize: 17,
  },
});
