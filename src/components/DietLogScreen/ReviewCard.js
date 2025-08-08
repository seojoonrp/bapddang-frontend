import React, { memo } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Colors from "../../styles/colors";
import ReviewStar from "../svg/ReviewStar";

const ReviewCard = ({ review }) => {
  if (!review) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.reviewText}>
        {review.time}으로 <Text style={styles.foodText}>{review.food}</Text>
        을(를) 먹었어요!
      </Text>

      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map((i) => (
          <ReviewStar
            key={i}
            fill={review.rating >= i ? Colors.point_red : "white"}
          />
        ))}
      </View>

      {review.imageUri ? (
        <Image source={{ uri: review.imageUri }} style={styles.reviewImage} />
      ) : null}

      {review.tags?.length ? (
        <Text style={styles.tagText}>
          {review.tags.map((tag) => `#${tag}`).join(" ")}
        </Text>
      ) : null}

      {review.comment ? (
        <Text style={styles.commentText}>“{review.comment}”</Text>
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
