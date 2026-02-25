import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { updateReview } from "../../services/review";
import { pickImage } from "../../utils/imagePicker";
import IconBar from "./IconBar";
import TagContainer from "../TagContainer";
import Colors from "../../constants/colors";
import Star from "../svg/Star";
import ReviewStar from "../svg/ReviewStar";

const COMMENT_MAX = 50;

const UpdateReviewModal = ({ onClose, existingReview, onUpdateSuccess }) => {
  const [name, setName] = useState("");

  const timeOption = ["아침", "점심", "저녁", "기타"];

  const [foodItems, setFoodItems] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [comment, setComment] = useState("");
  const [isCommentFocused, setIsCommentFocused] = useState(false);
  const [rating, setRating] = useState(0);

  // foodItems 받아오기
  useEffect(() => {
    if (existingReview) {
      const foodNames = existingReview.foods
        ? existingReview.foods.map((f) => f.foodName || f.name).join(" & ")
        : "";
      setName(foodNames);
      setSelectedTime(existingReview.mealTime || "");
      setImageURL(existingReview.imageURL || "");
      setComment(existingReview.comment || "");
      setRating(existingReview.rating || 0);
    }
  }, [existingReview]);

  const handleSubmit = async () => {
    try {
      if (!selectedTime || rating <= 0) {
        console.log("Please select both time and rating");
        return;
      }

      const updateData = {
        mealTime: selectedTime,
        rating: Number(rating),
        comment: comment,
        imageURL: imageURL,
      };

      const updated = await updateReview(existingReview.id, updateData);

      Alert.alert("수정 완료", "식단이 성공적으로 수정되었습니다.");

      if (onUpdateSuccess) {
        onUpdateSuccess(updated);
      }
      onClose();
    } catch (error) {
      console.error("수정 실패: ", error);
      Alert.alert("수정 실패", "식단을 수정하는 데 실패했습니다.");
    }
  };

  const handleChangeComment = (t) => {
    setComment(t.slice(0, COMMENT_MAX));
  };

  return (
    <View style={styles.overlay}>
      <IconBar onClose={onClose} />
      <View style={[styles.header, { backgroundColor: Colors.point_red }]}>
        <Star />
        <Text
          style={[styles.headerText, { fontSize: name.length > 11 ? 18 : 30 }]}
        >
          {name}
        </Text>
        <Star />
      </View>

      <View style={styles.contentBox}>
        <View style={styles.outerFrame}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
          >
            {/* 시간대 */}
            <Text style={styles.subtitle}>어느 시간대에 먹었나요?</Text>
            <TagContainer
              tags={timeOption}
              mode="select_single"
              onPress={(time) => setSelectedTime(time)}
              selectedTag={selectedTime}
              containerStyle={{ marginBottom: 24 }}
            />

            {/* 이미지 */}
            <View>
              <TouchableOpacity
                onPress={() => pickImage({ setImageUrl: setImageURL })}
                style={styles.imageBox}
              >
                {imageURL !== "" ? (
                  <Image
                    source={{ uri: imageURL }}
                    style={styles.imagePreview}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.placeholder}>
                    <Ionicons name="camera" size={20} color="#BFA6A1" />
                    <Text style={styles.placeholderText}>
                      사진을 추가해보세요!
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* 별점 */}
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((i) => (
                <TouchableOpacity key={i} onPress={() => setRating(i)}>
                  <ReviewStar
                    fill={rating >= i ? Colors.point_red : "white"}
                    stroke={rating >= i ? "#D9D9D9" : Colors.text_gray}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={[
                styles.input,
                { fontSize: comment.length > 12 ? 14 : 16 },
              ]}
              placeholder="한줄평을 남겨보세요..."
              value={
                isCommentFocused || comment.length <= 12
                  ? comment
                  : comment.slice(0, 10) + "..."
              }
              onChangeText={handleChangeComment}
              onFocus={() => setIsCommentFocused(true)}
              onBlur={() => setIsCommentFocused(false)}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.bottomButton,
                  { backgroundColor: Colors.point_red },
                ]}
                onPress={handleSubmit}
              >
                <Text style={[styles.bottomButtonText]}>등록</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default UpdateReviewModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 11,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerText: {
    fontFamily: "NanumSquareEB",
    fontSize: 30,
    color: "white",
    flexShrink: 1,
  },
  foodName: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  contentBox: {
    width: "100%",
    flexDirection: "column",
    borderColor: Colors.background_yellow,
    borderWidth: 3,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    maxHeight: 600, // 나도 싫지만 이게 최선인듯 이거 맞나..?
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingTop: 17,
    paddingBottom: 10,
    overflow: "hidden",
  },
  outerFrame: {
    width: "100%",
    borderColor: Colors.light_gray,
    borderWidth: 1,
    borderRadius: 13,
    backgroundColor: "white",
  },
  scrollContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
  },
  subtitle: {
    marginBottom: 15,
    marginTop: 20,
    fontFamily: "NanumSquareEB",
    fontSize: 18,
    color: Colors.burn,
  },
  imageBox: {
    display: "flex",
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: Colors.light_gray,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    width: 314,
    height: 250,
    overflow: "hidden",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontFamily: "NanumSquareOTF",
    fontSize: 10,
    fontWeight: 400,
    color: Colors.slightly_burn,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    resizeMode: "cover",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 13,
    textAlign: "center",
    width: 312,
    height: 51,
    marginTop: 22,
    fontFamily: "NanumSquareB",
    fontSize: 16,
    color: Colors.burn,
  },
  inputPlaceholder: {
    color: Colors.light_gray,
  },
  ratingRow: {
    flexDirection: "row",
    gap: 3,
    marginTop: 16,
  },
  star: {
    fontSize: 33,
    color: Colors.light_gray,
    marginHorizontal: 1,
  },
  starSelected: {
    color: "#E90C05",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 21,
  },
  bottomButton: {
    width: 95,
    height: 51,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomButtonText: {
    color: "#fff",
    fontFamily: "NanumSquareEB",
    fontSize: 18,
  },
});
