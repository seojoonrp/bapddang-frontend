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
import { doc, setDoc, getDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../../firebase";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";

import keywordMap from "../../data/keywordMap.json";
import Colors from "../../styles/colors";
import Star from "../svg/Star";
import ReviewStar from "../svg/ReviewStar";
import IconBar from "./IconBar";
import TagContainer from "../TagContainer";

const ReviewBox = ({ onClose, foods, mode, onBack }) => {
  const [timeOption, setTimeOption] = useState([
    "아침",
    "점심",
    "저녁",
    "기타",
  ]);
  const [tagOption, setTagOption] = useState([]);

  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const [response, setResponse] = useState("");
  const [imageUri, setImageUri] = useState(null);

  const requestPermissions = async () => {
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return (
      cameraStatus.status === "granted" && mediaStatus.status === "granted"
    );
  };

  const pickImage = async () => {
    // 권한 요청
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert(
        "권한이 필요합니다",
        "카메라 및 앨범 접근 권한을 허용해주세요."
      );
      return;
    }

    Alert.alert("사진 선택", "어떤 방식으로 사진을 추가할까요?", [
      {
        text: "앨범에서 선택",
        onPress: pickFromLibrary,
      },
      {
        text: "카메라로 촬영",
        onPress: takePhoto,
      },
      { text: "취소", style: "cancel" },
    ]);
  };
  const pickFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.Images,
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.Images,
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleTagPress = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const totalCharLength = Array.isArray(foods)
    ? foods.join(" & ").length
    : foods.length;

  useEffect(() => {
    if (!foods) return;

    const tagData = keywordMap[foods[0]];
    if (tagData) {
      setTagOption(tagData.situation || []);
    } else {
      setTagOption(["혼밥", "매콤해요", "건강해요"]);
    }
  }, [foods]);

  const handleSubmit = async () => {
    if (!foods) return;

    const user = auth.currentUser;
    if (!user) {
      Alert.alert("로그인이 필요합니다!");
      return;
    }

    const uid = user.uid;

    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      let day = 1;

      if (userDoc.exists()) {
        const createdAt =
          userDoc.data().createdAt?.toDate?.() ||
          new Date(userDoc.data().createdAt);

        const now = new Date();
        const diffMs = now - createdAt;
        day = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
      }

      const reviewData = {
        food: foods.join(", "),
        time: selectedTime,
        tags: selectedTags,
        comment,
        rating,
        imageUri,
        createdAt: new Date(),
        day,
      };
      const docRef = doc(db, "userReviews", uid);

      await setDoc(
        docRef,
        {
          reviews: arrayUnion(reviewData),
        },
        { merge: true }
      );

      alert("후기가 등록되었습니다!");
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
        <Text
          style={[
            styles.headerText,
            { fontSize: totalCharLength > 11 ? 18 : 30 },
          ]}
        >
          {foods.join(" & ")}
        </Text>
        <Star />
      </View>

      <View style={styles.contentBox}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.subtitle}>어느 시간대에 먹었나요?</Text>
          <TagContainer
            tags={timeOption}
            mode="select_single"
            onPress={(time) => setSelectedTime(time)}
            selectedTag={selectedTime}
            containerStyle={{ marginBottom: 20 }}
          />

          <Text style={styles.subtitle}>어떤 상황에서 먹었나요?</Text>
          <TagContainer
            tags={tagOption}
            mode="select_multi"
            onPress={(tag) => handleTagPress(tag)}
            selectedTags={selectedTags}
            containerStyle={{ marginBottom: 20 }}
          />

          <View>
            <Image
              source={response ? { uri: response.assets[0].uri } : 0}
              style={styles.img}
            />

            <TouchableOpacity onPress={pickImage} style={styles.imageBox}>
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
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
            <TouchableOpacity
              style={[styles.bottomButton, { backgroundColor: "#D9D9D9" }]}
              onPress={onBack}
            >
              <Text style={styles.bottomButtonText}>뒤로가기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bottomButton}
              onPress={handleSubmit}
            >
              <Text style={styles.bottomButtonText}>후기 등록</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ReviewBox;

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
