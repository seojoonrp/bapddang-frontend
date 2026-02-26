import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { fetchLikedFoods } from "../services/like";
import { useFoodStore, selectLikedFoodItems } from "../stores/foodStore";
import ChevronIcon from "../assets/icons/chevron.svg";
import Colors from "../constants/colors";
import FoodInfoModal from "../components/MainScreen/FoodInfoModal";
import ReanimatedModal from "../components/common/ReanimatedModal";
import DetailsIcon from "../assets/icons/liked/details.svg";
import EditIcon from "../assets/icons/liked/edit.svg";
import DeleteIcon from "../assets/icons/liked/delete.svg";
import LikedCategorySelector from "../components/LikedScreen/LikedCategorySelector";

const LikedScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [selectedFoodID, setSelectedFoodID] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [activeTab, setActiveTab] = useState("푸짐하게");
  const [expandedFoodID, setExpandedFoodID] = useState(null);

  const displayItems = useFoodStore(useShallow(selectLikedFoodItems));
  const setLikedFoods = useFoodStore((state) => state.setLikedFoods);

  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleSelectCategories = useCallback((categories) => {
    setSelectedCategories(categories);
  }, []);

  useEffect(() => {
    const loadLikedFoods = async () => {
      try {
        const foods = await fetchLikedFoods();
        setLikedFoods(foods);
      } catch (error) {
        console.log("Error fetching liked foods:", error);
      } finally {
        setLoading(false);
      }
    };
    loadLikedFoods();
  }, []);

  const filteredItems = useMemo(() => {
    const tabFiltered = displayItems.filter((item) => {
      if (activeTab === "푸짐하게") return item.food.speed === "fast";
      if (activeTab === "건강하게") return item.food.speed === "slow";
      return true;
    });
    if (selectedCategories.length === 0) return tabFiltered;
    return tabFiltered.filter((item) =>
      selectedCategories.every((cat) => item.food.categories.includes(cat)),
    );
  }, [displayItems, selectedCategories, activeTab]);

  const handleCreateReview = (id) => {
    console.log(`기록하기 클릭: ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`지우기 클릭: ${id}`);
  };

  const toggleExpand = useCallback((id) => {
    setExpandedFoodID((prev) => (prev === id ? null : id));
  }, []);

  const getTabStyle = (tabName) => {
    if (activeTab !== tabName) return styles.tabInactive;
    if (tabName === "푸짐하게")
      return [styles.tabActive, { backgroundColor: Colors.point_red }];
    if (tabName === "건강하게")
      return [styles.tabActive, { backgroundColor: Colors.point_green }];
    return [styles.tabActive, { backgroundColor: Colors.text_gray }];
  };

  const getTabTextStyle = (tabName) => {
    if (activeTab !== tabName)
      return [styles.tabTextInactive, { color: Colors.burn }];
    return styles.tabTextActive;
  };

  const renderItem = useCallback(
    ({ item }) => {
      const isExpanded = expandedFoodID === item.food.id;

      return (
        <View style={styles.itemContainer}>
          <View style={[styles.foodRow, isExpanded && styles.foodRowExpanded]}>
            <View style={styles.foodImageWrapper}>
              <Image
                source={{ uri: item.food.imageURL }}
                style={styles.foodImage}
              />
            </View>

            <View style={styles.foodTextContainer}>
              <Text style={styles.foodName}>{item.food.name}</Text>
              <Text style={styles.foodDate}>5일 전 찜했어요</Text>
            </View>

            <TouchableOpacity
              style={styles.moreButton}
              onPress={() => toggleExpand(item.food.id)}
              activeOpacity={0.6}
            >
              <Text style={styles.moreIcon}>•••</Text>
            </TouchableOpacity>
          </View>

          {isExpanded && (
            <View style={styles.expandedMenuContainer}>
              <TouchableOpacity
                style={styles.expandedActionButton}
                onPress={() => {
                  setSelectedFoodID(item.food.id);
                  setShowInfo(true);
                }}
                activeOpacity={0.7}
              >
                <DetailsIcon width={16} height={20} />
                <Text style={styles.actionText}>자세히</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.expandedActionButton}
                onPress={() => handleCreateReview(item.food.id)}
                activeOpacity={0.7}
              >
                <EditIcon width={22} height={22} />
                <Text style={styles.actionText}>기록하기</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.expandedActionButton}
                onPress={() => handleDelete(item.food.id)}
                activeOpacity={0.7}
              >
                <DeleteIcon width={20} height={20} />
                <Text style={styles.actionText}>지우기</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
    },
    [expandedFoodID, toggleExpand],
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backContainer}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ChevronIcon width={28} height={28} color="#CCCCCC" />
        </TouchableOpacity>
        <Text style={styles.headerText}>찜 메뉴</Text>
      </View>

      <View style={styles.tabContainer}>
        {["푸짐하게", "건강하게", "둘 다"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={getTabStyle(tab)}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.9}
          >
            <Text style={getTabTextStyle(tab)}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <LikedCategorySelector onSelect={handleSelectCategories} />

      <View style={styles.foodsContainer}>
        {filteredItems.length === 0 && (
          <Text style={styles.emptyText}>
            {selectedCategories.length === 0
              ? "찜한 음식이 없어요."
              : "선택한 카테고리에 해당하는 음식이 없어요."}
          </Text>
        )}
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.food.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <ReanimatedModal visible={showInfo} onClose={() => setShowInfo(false)}>
        <FoodInfoModal
          foodID={selectedFoodID}
          onClose={() => setShowInfo(false)}
        />
      </ReanimatedModal>
    </View>
  );
};

export default LikedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background_white,
  },
  header: {
    width: "100%",
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  backContainer: {
    position: "absolute",
    left: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: Colors.nurim,
    fontSize: 18,
    fontFamily: "NanumSquareRoundEB",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 12,
    justifyContent: "space-between",
    borderBottomColor: Colors.light_text_gray,
    borderBottomWidth: 1,
  },
  tabActive: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginHorizontal: 4,
  },
  tabInactive: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 4,
  },
  tabTextActive: {
    color: Colors.background_white,
    fontSize: 16,
    fontFamily: "NanumSquareB",
    letterSpacing: 0.6,
  },
  tabTextInactive: {
    color: Colors.burn,
    fontSize: 16,
    fontFamily: "NanumSquareB",
    letterSpacing: 0.6,
  },
  foodsContainer: {
    marginTop: 8,
    flex: 1,
    width: "100%",
  },
  emptyText: {
    marginTop: 32,
    alignSelf: "center",
    fontSize: 14,
    fontFamily: "NanumSquareRoundB",
    color: Colors.text_gray,
    letterSpacing: -0.3,
  },
  listContent: {},
  itemContainer: {},
  foodRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: Colors.background_white,
  },
  foodRowExpanded: {
    backgroundColor: Colors.light_text_gray,
  },
  foodImageWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderColor: Colors.border_yellow,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  foodImage: {
    width: "100%",
    height: "100%",
    borderRadius: 32,
  },
  foodTextContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 6,
  },
  foodName: {
    fontSize: 18,
    fontFamily: "NanumSquareEB",
    color: Colors.burn,
    letterSpacing: 0.6,
  },
  foodDate: {
    fontSize: 12,
    fontFamily: "NanumSquareRoundB",
    color: Colors.slightly_burn,
  },
  moreButton: {
    padding: 10,
  },
  moreIcon: {
    fontSize: 20,
    color: Colors.text_gray,
    letterSpacing: -2,
  },
  expandedMenuContainer: {
    flexDirection: "row",
    backgroundColor: Colors.light_text_gray,
    paddingHorizontal: 10,
    paddingBottom: 6,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  expandedActionButton: {
    flex: 1,
    backgroundColor: Colors.background_white,
    marginHorizontal: 2,
    paddingVertical: 6,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  actionDivider: {
    width: 1,
    height: "80%",
    backgroundColor: Colors.background_white,
  },
  actionText: {
    fontFamily: "NanumSquareB",
    color: Colors.nurim,
    fontSize: 12,
    letterSpacing: 0.6,
  },
});
