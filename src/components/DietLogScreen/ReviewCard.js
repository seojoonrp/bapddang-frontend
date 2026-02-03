import React, { memo, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import Colors from "../../constants/colors";
import ReviewStar from "../svg/ReviewStar";
import { Ionicons } from "@expo/vector-icons";
import Animated, { Easing, FadeInUp, FadeOutUp } from "react-native-reanimated";
import { deleteReview } from "../../services/review";
import LoadingPlaceholer from "../common/LoadingPlaceholer";
import { BlurView } from "expo-blur";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const ReviewCard = ({ review, onEdit, onDelete }) => {
  if (!review) return null;

  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const getJosa = (text) => {
    if (!text) return "";

    const lastChar = text.charCodeAt(text.length - 1);
    const hasBatchim = (lastChar - 0xac00) % 28 > 0;

    return hasBatchim ? "을" : "를";
  };

  const handleEdit = () => {
    setMenuOpen(false);
    onEdit?.(review.id);
  };

  const handleDelete = () => {
    setLoading(true);
    setMenuOpen(false);

    try {
      const result = deleteReview(review.id);
      result.then(() => {
        setLoading(false);
        onDelete?.(review.id);
        Alert.alert("삭제 완료", "식단이 성공적으로 삭제되었습니다.");
      });
    } catch (e) {
      console.log("Failed to delete review:", e);
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <BlurView
            intensity={50}
            style={{ ...StyleSheet.absoluteFillObject }}
          />
          <LoadingPlaceholer text="리뷰를 삭제중입니다..." />
        </View>
      )}

      <TouchableOpacity
        style={styles.moreBtn}
        onPress={() => setMenuOpen((prev) => !prev)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons
          name="ellipsis-horizontal"
          size={20}
          color={Colors.icon_gray}
        />
      </TouchableOpacity>

      {menuOpen && (
        <>
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setMenuOpen(false)}
            activeOpacity={1}
          />
          <Animated.View
            entering={FadeInUp.duration(150).easing(Easing.out(Easing.quad))}
            exiting={FadeOutUp.duration(150)}
            style={styles.menuBox}
          >
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemDivider]}
              onPress={handleEdit}
            >
              <Text style={styles.menuText}>기록 수정</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
              <Text style={styles.menuText}>기록 삭제</Text>
            </TouchableOpacity>
          </Animated.View>
        </>
      )}

      <Text style={styles.reviewText}>
        {review.mealTime}으로{" "}
        <Text style={{ color: Colors.burn }}>{review.name}</Text>
        {review.name.length > 8 ? "\n" : ""}
        {getJosa(review.name)} 먹었어요!
      </Text>

      {review.rating ? (
        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <ReviewStar
              key={i}
              fill={review.rating >= i ? Colors.point_red : "white"}
            />
          ))}
        </View>
      ) : null}

      {review.imageURL ? (
        <Image source={{ uri: review.imageURL }} style={styles.reviewImage} />
      ) : null}

      {review.comment ? (
        <Text style={styles.commentText}>{'"' + review.comment + '"'}</Text>
      ) : null}
    </View>
  );
};

export default memo(ReviewCard);

const styles = StyleSheet.create({
  card: {
    width: "100%",
    marginTop: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 14,
    justifyContent: "center",
    backgroundColor: Colors.background_white,
    alignItems: "center",
    alignSelf: "stretch",
    overflow: "hidden",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  moreBtn: {
    position: "absolute",
    top: 12,
    right: 16,
  },
  modalOverlay: {
    position: "absolute",
    top: -SCREEN_HEIGHT,
    left: -SCREEN_WIDTH,
    width: SCREEN_WIDTH * 2,
    height: SCREEN_HEIGHT * 2,
    zIndex: 998,
  },
  menuBox: {
    position: "absolute",
    top: 36,
    right: 16,
    zIndex: 999,
    width: 95,
    backgroundColor: Colors.background_white,
    borderRadius: 16,
    borderColor: Colors.light_text_gray,
    borderWidth: 1,
    shadowColor: "black",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 0,
    elevation: 2,
    paddingVertical: 2,
  },
  menuItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
  },
  menuItemDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light_text_gray,
  },
  menuText: {
    fontFamily: "NanumSquareB",
    fontSize: 16,
    color: Colors.burn,
  },
  reviewText: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: "NanumSquareB",
    color: Colors.slightly_burn,
  },
  starRow: {
    flexDirection: "row",
    gap: 3,
  },
  reviewImage: {
    height: 240,
    borderRadius: 16,
    alignSelf: "stretch",
  },
  commentText: {
    fontSize: 13,
    fontFamily: "NanumSquareB",
    color: Colors.text_gray,
  },
});
