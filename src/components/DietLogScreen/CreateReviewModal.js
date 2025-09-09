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

import {
  createReview,
  editReview,
  fetchReviewById,
} from "../../services/review";
import { classifyFoodNameArray } from "../../services/food";
import { pickImage } from "../../utils/imagePicker";

import IconBar from "./IconBar";
import TagContainer from "../TagContainer";

import Colors from "../../styles/colors";
import Star from "../svg/Star";
import ReviewStar from "../svg/ReviewStar";

const CreateReviewModal = ({
  onClose,
  foodNames,
  mode,
  onBack,
  intent = "create",
  reviewId = null,
}) => {
  const [name, setName] = useState("");

  const timeOption = ["아침", "점심", "저녁", "기타"];
  const [tagOption, setTagOption] = useState([
    "혼밥",
    "매콤해요",
    "건강해요",
    "푸짐해요",
    "가성비 좋아요",
  ]);

  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (intent === "edit" && reviewId) {
      const fetchData = async () => {
        const reviewData = await fetchReviewById(reviewId);

        setName(reviewData.name ?? "");
        setSelectedTime(reviewData.time ?? null);
        setSelectedTags(reviewData.tags ?? []);
        setImageUrl(reviewData.imageUrl ?? null);
        setComment(reviewData.comment ?? "");
        setRating(reviewData.rating ?? 0);
      };

      fetchData();
    }
  }, [intent, reviewId]);

  useEffect(() => {
    if (intent === "create") {
      setName(foodNames.join("&"));
    }
  }, [intent, foodNames]);

  const handleTagPress = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  /* TODO: 태그 생성 */

  const handleSubmit = async () => {
    if (!foodNames) return;

    const foods = await classifyFoodNameArray(foodNames);

    try {
      if (intent == "edit") {
        editReview(reviewId, {
          name,
          foods,
          time: selectedTime,
          tags: selectedTags,
          imageUrl,
          comment,
          rating,
        });
      } else if (intent == "create") {
        createReview({
          name,
          foods,
          time: selectedTime,
          tags: selectedTags,
          imageUrl,
          comment,
          rating,
        });
      }

      onClose();
    } catch (error) {
      console.error("리뷰 저장 실패: ", error);
      Alert.alert("저장 실패", "리뷰를 저장하는 데 실패했습니다.");
    }
  };

  return (
    <View style={styles.overlay}>
      <IconBar onClose={onClose} />

      <View
        style={[
          styles.header,
          {
            backgroundColor:
              mode === "fast" ? Colors.point_red : Colors.point_green,
          },
        ]}
      >
        <Star />
        <TextInput
          style={[styles.headerText, { fontSize: name.length > 11 ? 18 : 30 }]}
          value={name}
          onChangeText={setName}
        />
        <Star />
      </View>

      <View style={styles.contentBox}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 시간대 선택 */}
          <Text style={styles.subtitle}>어느 시간대에 먹었나요?</Text>
          <TagContainer
            tags={timeOption}
            mode="select_single"
            onPress={(time) => setSelectedTime(time)}
            selectedTag={selectedTime}
            containerStyle={{ marginBottom: 20 }}
          />

          {/* 태그 선택 */}
          <Text style={styles.subtitle}>음식에 어울리는 태그를 골라보세요</Text>
          <TagContainer
            tags={tagOption}
            mode="select_multi"
            onPress={(tag) => handleTagPress(tag)}
            selectedTags={selectedTags}
            containerStyle={{ marginBottom: 20 }}
          />

          {/* 이미지 선택 */}
          <View>
            <TouchableOpacity
              onPress={() => pickImage({ setImageUrl })}
              style={styles.imageBox}
            >
              {imageUrl ? (
                <Image
                  source={{ uri: imageUrl }}
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

          {/* 한줄평 및 별점 */}
          <Text style={styles.subtitle}>한줄평을 남겨주세요!</Text>
          <TextInput
            style={styles.input}
            placeholder="후기 남기기..."
            value={comment}
            onChangeText={setComment}
          />
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <TouchableOpacity key={i} onPress={() => setRating(i)}>
                <ReviewStar fill={rating >= i ? Colors.point_red : "white"} />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.buttonRow}>
            {intent !== "edit" && (
              <TouchableOpacity
                style={[styles.bottomButton, { backgroundColor: "#D9D9D9" }]}
                onPress={onBack}
              >
                <Text style={styles.bottomButtonText}>뒤로가기</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.bottomButton}
              onPress={handleSubmit}
            >
              <Text style={styles.bottomButtonText}>
                {intent === "edit" ? "수정 저장" : "후기 등록"}
              </Text>
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
    backgroundColor: Colors.point_red,
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
