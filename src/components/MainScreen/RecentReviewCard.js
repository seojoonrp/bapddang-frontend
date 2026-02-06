// src/components/MainScreen/RecentReviewCard.js

import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import StarIcon from "../../assets/icons/star.svg";
import Colors from "../../constants/colors";
import { useModeStore } from "../../stores/modeStore";

const RecentReviewCard = ({ data, setSelectedFoodID, setShowInfo }) => {
  const modeColor = useModeStore((state) => state.modeColor);

  const calculatePastTimeText = (createdAt) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const diffInMs = now - createdDate;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
      return "방금 전";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else {
      return `${diffInDays}일 전`;
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        setSelectedFoodID(data.food.id);
        setShowInfo(true);
      }}
      activeOpacity={0.7}
    >
      <View style={styles.leftStuffContainer}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: data.food.imageURL }} style={styles.image} />
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.foodName}>{data.food.name}</Text>
            <Text style={styles.pastTime}>
              {calculatePastTimeText(data.createdAt)}
            </Text>
          </View>
          {data.comment.length > 0 && (
            <View style={styles.commentPill}>
              <Text style={styles.commentText}>{data.comment}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.ratingContainer}>
        {[...Array(5)].map((_, index) => (
          <StarIcon
            key={index}
            width={14}
            height={14}
            color={index < data.rating ? modeColor : "#D9D9D9"}
          />
        ))}
      </View>
    </TouchableOpacity>
  );
};

export default RecentReviewCard;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingLeft: 8,
    paddingRight: 24,
    backgroundColor: Colors.background_white,
    borderColor: Colors.border_brown,
    borderWidth: 1.5,
    borderRadius: 24,
    boxShadow: "0 4px 0 0 #FDEDC0",
  },
  leftStuffContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 99,
    overflow: "hidden",
    borderColor: Colors.border_yellow,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    gap: 6,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  foodName: {
    fontSize: 18,
    fontFamily: "NanumSquareEB",
    color: Colors.burn,
    marginLeft: 4,
  },
  pastTime: {
    fontSize: 12,
    fontFamily: "NanumSquareB",
    color: Colors.text_gray,
  },
  commentPill: {
    alignSelf: "flex-start",
    borderColor: Colors.light_text_gray,
    borderWidth: 1.5,
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  commentText: {
    fontSize: 14,
    fontFamily: "NanumSquareR",
    color: Colors.slightly_burn,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0.5,
    marginTop: -33,
  },
});
