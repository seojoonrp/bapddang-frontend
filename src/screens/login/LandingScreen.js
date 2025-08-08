import React, { useState } from "react";
import { View, Text, Button } from "react-native";

export default function LandingScreen({ navigation }) {
  return (
    <View style={{ padding: 40, flex: 1, backgroundColor: "white" }}>
      <Text style={{ margin: 10 }}>LOGO</Text>
      <View style={{ height: 10 }} />
      <Button title="로그인" onPress={() => navigation.navigate("Login")} />
      <View style={{ height: 10 }} />
      <Button title="회원가입" onPress={() => navigation.navigate("SignUp")} />
      <View style={{ height: 10 }} />
      <Button
        title="게스트로 둘러보기"
        onPress={() => navigation.navigate("메인 화면")}
      />
    </View>
  );
}
