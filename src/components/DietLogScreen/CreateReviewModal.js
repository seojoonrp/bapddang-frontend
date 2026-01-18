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
import Ionicons from "react-native-vector-icons/Ionicons";

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
    <View style={styles.overlay}>
      <IconBar onClose={onClose} />

      <View style={[styles.header, { backgroundColor: mainColor }]}>
        <Star />
        <Text
          style={[styles.headerText, { fontSize: name.length > 11 ? 18 : 30 }]}
        >
          {name}
        </Text>
        <Star />
      </View>

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
            containerStyle={{ marginBottom: 20 }}
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
                  <Ionicons name="camera-outline" size={20} color="#BFA6A1" />
                  <Text style={styles.placeholderText}>
                    사진을 추가해보세요!
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* 한줄평 */}
          <Text style={styles.subtitle}>한줄평을 남겨보세요!</Text>
          <TextInput
            style={styles.input}
            placeholder="후기 남기기..."
            value={comment}
            onChangeText={setComment}
          />

          {/* 별점 */}
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <TouchableOpacity key={i} onPress={() => setRating(i)}>
                <ReviewStar fill={rating >= i ? Colors.point_red : "white"} />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.bottomButton, { backgroundColor: "#D9D9D9" }]}
              onPress={onBack}
            >
              <Text style={styles.bottomButtonText}>뒤로가기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bottomButton, { backgroundColor: mainColor }]}
              onPress={handleSubmit}
            >
              <Text style={[styles.bottomButtonText]}>리뷰 등록하기</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default CreateReviewModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  modalContainer: {
    width: "100%",
    paddingHorizontal: 14,
    backgroundColor: "transparent",
    marginBottom: 40,

    borderColor: "#00FF00",
    borderWidth: 3,
  },
  iconBar: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingTop: 12,
    paddingBottom: 8,
  },
  iconLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconText: {
    color: "#CCC",
    marginLeft: 4,
    fontWeight: "bold",
    fontSize: 17,
    fontFamily: "NanumSquareOTF",
    fontWeight: "600",
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
    display: "flex",
    flexDirection: "column",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderColor: Colors.light_gray,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 1,
    maxHeight: 520, // 나도 싫지만 이게 최선인듯
    backgroundColor: "white",
  },
  scrollContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 20,
    gap: 25,
  },
  subtitle: {
    marginBottom: 15,
    fontFamily: "NanumSquareEB",
    fontSize: 18,
    color: Colors.burn,
  },
  imageBox: {
    display: "flex",
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: Colors.light_gray,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    height: 250,
    width: 314,
    gap: 25,
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
    marginTop: 5,
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
    marginTop: 62,
  },
  bottomButton: {
    width: 151,
    height: 51,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomButtonText: {
    color: "#fff",
    fontFamily: "NanumSquareEB",
    fontSize: 18,
  },
});
