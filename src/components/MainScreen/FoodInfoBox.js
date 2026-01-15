import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { likeFood } from "../../services/user";
import useAuthStore from "../../stores/authStore";
import Ionicons from "react-native-vector-icons/Ionicons";
import Colors from "../../constants/colors";
import Star from "../svg/Star";

const FoodInfoBox = ({ item, onClose }) => {
  const navigation = useNavigation();
  const user = useAuthStore((state) => state.user);

  const handleLike = () => {
    if (!user) {
      console.log("로그인하거라");
      return;
    }

    likeFood(item.id);
  };

  const handleCalendar = () => {
    onClose();
    navigation.navigate("DietLog");
  };

  if (!item) return null;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: Colors.point_red }]}>
        <Star />
        <Text style={styles.headerText}>{item.name}</Text>
        <Star />
      </View>

      <View style={styles.contentBox}>
        <TouchableOpacity
          style={[styles.emojiButton, { backgroundColor: "#FFF" }]}
          onPress={handleLike}
        >
          <Text style={styles.emojiText}>👍</Text>
        </TouchableOpacity>
        <Text>좋아요 개수: {item.likeCount}</Text>
        <Text>리뷰 개수: {item.reviewCount}</Text>
        <Text>별점: {item.averageRating}</Text>
      </View>
    </View>
  );
};

export default FoodInfoBox;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  iconBar: {
    backgroundColor: "transparent",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 8,
  },
  iconLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconText: {
    color: "white",
    marginLeft: 4,
    fontWeight: "bold",
    fontSize: 13,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    paddingTop: 27,
    paddingBottom: 11,
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerText: {
    fontFamily: "NanumSquareEB",
    fontSize: 30,
    color: "white",
  },
  contentBox: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 40,
  },
  imageContainer: {
    width: 292,
    height: 250,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    resizeMode: "cover",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  placeholderText: {
    fontSize: 20,
    color: "#333",
  },
  brandText: {
    color: "#a38888",
    fontSize: 14,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 2,
  },
  emojiButton: {
    borderWidth: 0.4,
    borderColor: "#D9D9D9",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginTop: 20,
    boxShadow: "0px -2px 4px 0px #A94946 inset, 0px -2px 6px 2px #FDEDC0 inset",
  },
  emojiText: {
    fontSize: 24,
  },
});
