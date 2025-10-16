import { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Animated,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";

import { auth } from "../services/firebase";
import { fetchFoods } from "../services/food";
import { syncUserWeekAndDay } from "../services/user";

import UserDrawer from "../components/MainScreen/UserDrawer";
import StatusBanner from "../components/MainScreen/StatusBanner";
import RecentLiked from "../components/MainScreen/RecentLiked";
import FoodCardNews from "../components/MainScreen/FoodCardNews";
import Ranking from "../components/MainScreen/Ranking";
import BalanceGame from "../components/MainScreen/BalanceGame";
import Bell from "../components/svg/Bell";
import Colors from "../styles/colors";

const MainScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [isBalanceGameVisible, setBalanceGameVisible] = useState(false);
  const [foodsData, setFoodsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusBannerHeight, setStatusBannerHeight] = useState(0);
  const { height: screenHeight } = useWindowDimensions();
  const topAnim = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    const isReady = statusBannerHeight > 0;
    if (isBalanceGameVisible && isReady) {
      Animated.spring(topAnim, {
        toValue: insets.top + statusBannerHeight,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.spring(topAnim, {
        toValue: screenHeight,
        useNativeDriver: false,
      }).start();
    }
  }, [isBalanceGameVisible, statusBannerHeight, insets.top]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFoods();
        setFoodsData(data || []);
      } catch (error) {
        console.error("Error fetching food data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

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

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    if (scrollY > 100 && !isBalanceGameVisible) {
      setBalanceGameVisible(true);
    }
  };

  const handleBannerLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    if (statusBannerHeight === 0) {
      setStatusBannerHeight(height);
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
        if (isBalanceGameVisible) {
          return null;
        }
        return (
          <View
            style={{
              backgroundColor: "white",
              paddingTop: 10,
            }}
          >
            <View style={styles.topContainer}>
              <Text style={styles.logo}>로고임</Text>
              <TouchableOpacity>
                <Text>밸런스게임</Text>
              </TouchableOpacity>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <TouchableOpacity>
                  <Bell />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setDrawerVisible(true)}>
                  <View style={styles.userIcon} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      case "StatusBanner":
        return (
          <View
            onLayout={handleBannerLayout}
            style={{
              backgroundColor: isBalanceGameVisible
                ? Colors.point_red
                : "white",
            }}
          >
            <StatusBanner />
          </View>
        );
      case "RecentLiked":
        return <RecentLiked />;
      case "FoodCardNews":
        return (
          <View style={{ height: 300 }}>
            <FoodCardNews foodsData={foodsData} isLoading={isLoading} />
          </View>
        );
      case "Ranking":
        return <Ranking />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isBalanceGameVisible ? Colors.point_red : "white" },
      ]}
      edges={["left", "right", "bottom"]}
    >
      <FlatList
        style={{
          paddingHorizontal: 15,
        }}
        contentContainerStyle={{ paddingTop: insets.top }}
        data={scrollableComponents}
        renderItem={renderScrollableComponent}
        keyExtractor={(item) => item.key}
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        scrollEnabled={!isBalanceGameVisible}
      />

      <UserDrawer
        isVisible={isDrawerVisible}
        onClose={() => setDrawerVisible(false)}
        email={email}
      />

      <Animated.View style={[styles.animatedContainer, { top: topAnim }]}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setBalanceGameVisible(false)}
        >
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
        <BalanceGame />
      </Animated.View>
    </SafeAreaView>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  animatedContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    padding: 15,
    paddingTop: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 15,
    padding: 5,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.gray_dark,
  },
});