import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../services/firebase";

import { createUserDocument } from "../../services/user";

const EmailVerifyScreen = () => {
  const navigation = useNavigation();

  const checkVerification = async () => {
    if (!auth.currentUser) {
      console.log("No user is currently signed in.");
      setLoading(false);
      return;
    }

    try {
      await auth.currentUser.reload();
      const currentUser = auth.currentUser;

      if (!currentUser.emailVerified) {
        console.log("Email not verified yet.");
      } else {
        console.log("이메일 인증이 완료되었습니다!");

        await createUserDocument(currentUser);
        setTimeout(() => {
          navigation.replace("메인 화면", { replace: true });
        }, 500);
      }
    } catch (e) {
      console.log("Error:", e.message);
    }
  };

  return (
    <View style={{ padding: 40, flex: 1, backgroundColor: "white" }}>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 16,
          marginTop: 30,
          marginBottom: 20,
        }}
      >
        이메일에서 인증 후{"\n"}인증 완료를 눌러주세요!
      </Text>

      <Text
        style={{
          fontSize: 16,
          marginBottom: 60,
        }}
      >
        {auth.currentUser?.email}
      </Text>

      <TouchableOpacity onPress={checkVerification}>
        <Text>인증 완료</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmailVerifyScreen;
