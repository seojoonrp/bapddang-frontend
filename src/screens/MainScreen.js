import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
  const navigation = useNavigation();

  const [email, setEmail] = useState("");

  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const openDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  const { width, height } = useWindowDimensions();

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

  const scrollableComponents = [
    { key: "TopHeader" },
    { key: "StatusBanner" },
    { key: "RecentLiked" },
    { key: "FoodCardNews" },
    { key: "Ranking" },
  ];

  const renderScrollableComponent = ({ item }) => {
    switch (item.key) {
      case "TopHeader":
        return (
          <View style={{ backgroundColor: "white", paddingTop: 10 }}>
            <View style={styles.topContainer}>
              <Text style={styles.logo}>로고임</Text>

              <TouchableOpacity onPress={() => navigation.navigate("Test")}>
                <Text>밸런스게임</Text>
              </TouchableOpacity>

              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <TouchableOpacity>
                  <Bell />
                </TouchableOpacity>
                <TouchableOpacity onPress={openDrawer}>
                  <View style={styles.userIcon} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      case "StatusBanner":
        return <StatusBanner />;
      case "RecentLiked":
        return <RecentLiked />;
      case "FoodCardNews":
        return (
          <View style={{ height: 300 }}>
            <FoodCardNews pad={(width - 330) / 2} />
          </View>
        );
      case "Ranking":
        return <Ranking />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>
        <FlatList
          data={scrollableComponents}
          renderItem={renderScrollableComponent}
          keyExtractor={(item) => item.key}
          stickyHeaderIndices={[1]}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        />

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
    </SafeAreaView>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 15,
  },
  topContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
