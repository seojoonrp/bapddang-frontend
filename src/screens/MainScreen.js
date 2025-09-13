import { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";

import { auth } from "../services/firebase";
import { syncUserWeekAndDay } from "../services/user";

import UserDrawer from "../components/MainScreen/UserDrawer";
import StatusBanner from "../components/MainScreen/StatusBanner";
import RecentLiked from "../components/MainScreen/RecentLiked";
import FoodCardNews from "../components/MainScreen/FoodCardNews";
import Ranking from "../components/MainScreen/Ranking";

import Colors from "../styles/colors";
import Bell from "../components/svg/Bell";

const MainScreen = () => {
  const [isFast, setIsFast] = useState(true);
  const navigation = useNavigation();

  const toggleFast = () => {
    setIsFast((prev) => !prev);
  };
  ``;
  const [email, setEmail] = useState("");

  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const openDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  useEffect(() => {
    const curUser = auth.currentUser;
    if (curUser) {
      setEmail(curUser.email);
      syncUserWeekAndDay(curUser.uid);
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
      <View style={styles.topContainer}>
        <Text style={styles.logo}>로고임</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TouchableOpacity>
            <Bell />
          </TouchableOpacity>
          <TouchableOpacity onPress={openDrawer}>
            <View style={styles.userIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 기존 로그인/로그아웃 UI
      <View style={styles.switchContainer}>
        <Text>{email}</Text>
        <Button
          title="로그인/랜딩"
          onPress={() => navigation.navigate("Landing", { from: "Main" })}
        />
        <Button title="로그아웃" onPress={handleLogout} />
      </View>
      */}

      <StatusBanner isFast={isFast} onToggle={toggleFast} />
      <RecentLiked isFast={isFast} />
      <FoodCardNews mode={isFast ? "fast" : "slow"} />
      <Ranking />

      <UserDrawer
        isVisible={isDrawerVisible}
        onClose={closeDrawer}
        email={email}
        onNavigateToLanding={() => {
          closeDrawer();
          navigation.navigate("Landing", { from: "Main" });
        }}
        onLogout={() => {
          closeDrawer();
          handleLogout();
        }}
      />
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
  topContainer: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,

    borderColor: "black",
    borderWidth: 1,
  },
  logo: {
    color: "black",
    fontSize: 24,
    fontWeight: "bold",
  },
  userIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.point_red,
  },
});

/* 기존 MainScreen_Fast

import { View, StyleSheet, TouchableOpacity, Text,ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

import StatusBanner from "./StatusBanner";
import FoodCardNews from "./FoodCardNews";
import RecentFav from "./RecentFav";

const MainScreen_Fast = ({ isFast, onToggle }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBanner isFast={isFast} onToggle={onToggle} />
      <RecentFav />
      <FoodCardNews mode="fast" />
    </View>
  );
};

export default MainScreen_Fast;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,

    borderColor: "black",
    borderWidth: 1,
  },
});

*/
