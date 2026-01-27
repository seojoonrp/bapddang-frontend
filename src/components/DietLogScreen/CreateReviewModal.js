import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { fetchFoodItemsByNames } from "../../services/food";
import { createReview } from "../../services/review";
import { pickImage } from "../../utils/imagePicker";

import IconBar from "./IconBar";
import TagContainer from "../TagContainer";

import Colors from "../../constants/colors";
import Star from "../svg/Star";
import ReviewStar from "../svg/ReviewStar";

const CreateReviewModal = ({ onClose, foodNames, reviewMode, onBack }) => {
  const [name, setName] = useState("");

  const timeOption = ["아침", "점심", "저녁", "기타"];

  const [foodItems, setFoodItems] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const mainColor =
    reviewMode === "fast" ? Colors.point_red : Colors.point_green;

  // foodItems 받아오기
  useEffect(() => {
    if (!foodNames || foodNames.length === 0) {
      console.log("No food names provided");
      return;
    }

    const fetchFoods = async () => {
      try {
        const data = await fetchFoodItemsByNames(foodNames);
        setFoodItems(data);
      } catch (error) {
        console.error("음식 데이터를 불러오는 데 실패했습니다:", error);
      }
    };

    fetchFoods();
  }, [foodNames]);

  // 이름 설정
  useEffect(() => {
    const names = foodItems.map((f) => f.foodName).join(" & ");
    setName(names);
  }, [foodItems]);

  const handleSubmit = async () => {
    try {
      if (!selectedTime || rating <= 0) {
        console.log("Please select both time and rating");
        return;
      }

      await createReview({
        name: name,
        foods: foodItems,
        speed: reviewMode,
        mealTime: selectedTime,
        imageURL: imageURL,
        comment: comment,
        rating: Number(rating),
      });

      Alert.alert("리뷰 등록 완료", "리뷰가 성공적으로 등록되었습니다.");
      onClose();
    } catch (error) {
      console.error("리뷰 저장 실패: ", error);
      Alert.alert("저장 실패", "리뷰를 저장하는 데 실패했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <IconBar onClose={onClose} />
      <View style={[styles.header, { backgroundColor: mainColor }]}>
        <Star />
        <Text
          style={[styles.headerText, { fontSize: name.length > 11 ? 18 : 24 }]}
        >
          {name}
        </Text>
        <Star />
      </View>

      <View style={styles.outerFrame}>
        <View style={styles.contentBox}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
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
            <View style={{ width: "100%" }}>
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
                  <ReviewStar fill={rating >= i ? Colors.point_red : "white"} />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="한줄평을 남겨보세요..."
              value={comment}
              onChangeText={setComment}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.bottomButton,
                  { backgroundColor: Colors.text_gray },
                ]}
                onPress={onBack}
              >
                <Text style={styles.bottomButtonText}>이전</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.bottomButton, { backgroundColor: mainColor }]}
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

export default CreateReviewModal;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "70%",
    maxHeight: 600,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    height: 64,
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
    color: Colors.background_white,
    fontSize: 18,
    fontFamily: "NanumSquareEB",
  },
  outerFrame: {
    flex: 1,
    width: "100%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderColor: Colors.background_yellow,
    borderTopColor: Colors.background_white,
    borderWidth: 3,
    padding: 10,
    backgroundColor: Colors.background_white,
  },
  contentBox: {
    justifyContent: "flex-start",
    width: "100%",
    flex: 1,
    paddingHorizontal: 20,
    borderColor: Colors.light_text_gray,
    borderRadius: 13,
    borderWidth: 1,
  },
  scrollContainer: {
    width: "100%",
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingVertical: 8,
    paddingBottom: 28,
    alignItems: "center",
  },
  subtitle: {
    marginBottom: 15,
    marginTop: 20,
    fontFamily: "NanumSquareEB",
    fontSize: 18,
    color: Colors.burn,
  },
  imageBox: {
    width: "100%",
    height: 250,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: Colors.light_gray,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background_white,
    overflow: "hidden",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  placeholderText: {
    fontFamily: "NanumSquareRoundB",
    fontSize: 10,
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
    borderColor: Colors.text_gray,
    borderRadius: 16,
    textAlign: "center",
    width: "100%",
    height: 48,
    marginTop: 20,
    fontFamily: "NanumSquareRoundB",
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
