import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { likeFood } from "../../services/user";
import useAuthStore from "../../stores/authStore";
import Colors from "../../constants/colors";
import CloseIcon from "../../assets/icons/close-x.svg";

const FoodInfoBox = ({ item, onClose }) => {
  const { user } = useAuthStore();

  const handleLike = () => {
    if (!user) {
      console.log("user not logged in");
      return;
    }

    likeFood(item.id);
  };

  if (!item) return null;

  return (
    <View style={styles.container}>
      <View style={styles.whiteContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <CloseIcon width={30} height={30} color={Colors.burn} />
        </TouchableOpacity>
        <View style={styles.contentContainer}>
          <View style={styles.imageContainer}>
            <Image style={styles.foodImage} source={{ uri: item.imageURL }} />
          </View>
          <Text style={styles.foodName}>{item.name}</Text>
          <View style={styles.categoryRow}>
            {item.categories.map((category) => (
              <View key={category} style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{category}</Text>
              </View>
            ))}
          </View>
          <View style={styles.mapContainer}>
            <Text>지도임</Text>
          </View>
          <Text style={styles.distanceText}>
            <Text
              style={{ color: Colors.point_red, fontFamily: "NanumSquareEB" }}
            >
              2.1km{" "}
            </Text>
            떨어진 곳에 있어요!
          </Text>
        </View>
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
    paddingHorizontal: 12,
    marginTop: "24%",
  },
  whiteContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    backgroundColor: Colors.background_white,
    borderRadius: 24,
  },
  contentContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 12,
    borderColor: Colors.light_text_gray,
    borderWidth: 1,
    borderRadius: 12,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    borderColor: Colors.border_brown,
    borderWidth: 1.5,
  },
  foodImage: {
    width: "100%",
    height: "100%",
  },
  foodName: {
    color: Colors.burn,
    fontFamily: "NanumSquareRoundEB",
    fontSize: 24,
    letterSpacing: -0.5,
    marginTop: -4,
  },
  categoryRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
    borderColor: Colors.nurim,
    borderWidth: 1,
    boxShadow: "0 2px 0 0 #FDEDC0",
  },
  categoryText: {
    fontFamily: "NanumSquareRoundB",
    fontSize: 12,
    color: Colors.nurim,
  },
  mapContainer: {
    width: "100%",
    height: 240,
    borderRadius: 12,
    borderColor: Colors.light_text_gray,
    borderWidth: 1.5,
    justifyContent: "flex-end",
    alignItems: "center",
    overflow: "hidden",
  },
  distanceText: {
    fontFamily: "NanumSquareB",
    fontSize: 14,
    letterSpacing: -0.3,
    color: Colors.slightly_burn,
    marginBottom: 4,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
  },
});
