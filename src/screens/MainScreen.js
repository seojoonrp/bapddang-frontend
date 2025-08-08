import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Switch, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import MainScreen_Fast from "../components/MainScreen_Fast";
import MainScreen_Slow from "../components/MainScreen_Slow";

const MainScreen = () => {
  const [isFast, setIsFast] = useState(true);
  const navigation = useNavigation();

  const toggleFast = () => {
    setIsFast((prev) => !prev);
  };

  const [email, setEmail] = useState("");
  useEffect(() => {
    const curUser = auth.currentUser;
    if (curUser) {
      setEmail(curUser.email);
    } else {
      setEmail("게스트입니다.");
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Landing", { from: "Main" });
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        <Switch
          style={styles.switch}
          trackColor={{ false: "#359c21", true: "#e02828" }}
          ios_backgroundColor="#359c21"
          thumbColor="#fcfcfc"
          onValueChange={toggleFast}
          value={isFast}
        />
      </View>
      <View style={styles.switchContainer}>
        <Text>{email}</Text>
        <Button
          title="로그인/랜딩"
          onPress={() => navigation.navigate("Landing", { from: "Main" })}
        />
        <Button title="로그아웃" onPress={handleLogout} />

      </View>
      {isFast ? <MainScreen_Fast /> : <MainScreen_Slow />}
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
  },
  switchContainer: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 16,
    marginHorizontal: 16,

    borderColor: "black",
    borderWidth: 1,
  },
  switch: {},
});
