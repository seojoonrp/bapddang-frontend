import React, { memo, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import Colors from "../../constants/colors";
import ReviewStar from "../svg/ReviewStar";
import { Ionicons } from "@expo/vector-icons";

const ReviewCard = ({ review, onEdit }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  if (!review) return null;

  const handleEdit = () => {
    setMenuOpen(false);
    onEdit?.(review.id);
  };

  const handleDelete = () => {
    setMenuOpen(false);
    onDelete?.(review.id);
  };
  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.moreBtn}
        onPress={() => setMenuOpen((prev) => !prev)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="ellipsis-horizontal" size={20} color={Colors.icon_gray} />
      </TouchableOpacity>

      {menuOpen && (
        <View style={styles.menuBox}>
          <TouchableOpacity style={[styles.menuItem, styles.menuItemDivider]} onPress={handleEdit}>
            <Text style={styles.menuText}>기록 수정</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
            <Text style={styles.menuText}>기록 삭제</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.reviewText}>
        {review.mealTime}으로 <Text style={styles.foodText}>{review.name}</Text>
        을(를) 먹었어요!
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
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    padding: 18,
    gap: 12,
    justifyContent: "center",
    backgroundColor: "#fff",
    alignItems: "center",
    alignSelf: "stretch",
  },
  moreBtn: {
    position: "absolute",
    top: 17,
    right: 12,
  },
  menuBox: {
    position: "absolute",
    top: 36,        // 점3개 버튼 아래로
    right: 12,
    zIndex: 999,
    width: 95,
    height: 72,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#CCCCCC",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 0,
    elevation :2,
    paddingVertical: 6,
  },
  menuItem: {
    alignItems: "center",
    justifyContent: "center",
    height: 30,
  },
  menuItemDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light_text_gray,
  },
  menuText: {
    fontFamily: "NanumSquareOTF",
    fontSize: 16,
    fontWeight: "700",
    color: Colors.burn,
  },
  reviewText: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: "NanumSquareB",
    fontWeight: "400",
    color: Colors.slightly_burn,
  },
  foodText: {
    fontSize: 18,
    fontFamily: "NanumSquareB",
    fontWeight: "400",
    color: Colors.burn,
  },
  starRow: {
    flexDirection: "row",
    gap: 3,
  },
  reviewImage: {
    height: 240,
    borderRadius: 13,
    margin: 12,
    alignSelf: "stretch",
  },
  tagText: {
    fontSize: 15,
    color: Colors.burn,
    fontWeight: "700",
    fontFamily: "NanumSquareB",
  },
  commentText: {
    fontSize: 13,
    fontFamily: "NanumSquareB",
    fontWeight: "400",
    color: "#BBB",
  },
});
