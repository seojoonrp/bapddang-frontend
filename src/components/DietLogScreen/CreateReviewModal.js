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
import { fetchFoodItemsByNames } from "../../services/food";
import { createReview } from "../../services/review";
import { pickImage } from "../../utils/imagePicker";
import IconBar from "./IconBar";
import TagContainer from "../TagContainer";
import Colors from "../../constants/colors";
import Star from "../svg/Star";
import ReviewStar from "../svg/ReviewStar";
import { useAuthStore } from "../../stores/authStore";

const CreateReviewModal = ({ onClose, foodNames, onBack, onCreateSuccess }) => {
  const user = useAuthStore((state) => state.user);

  const [name, setName] = useState("");

  const dayOption = ["그저께", "어제", "오늘"];
  const timeOption = ["아침", "점심", "저녁", "기타"];

  const [foodItems, setFoodItems] = useState([]);
  const [selectedDay, setSelectedDay] = useState("오늘");
  const [selectedTime, setSelectedTime] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

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
      if (!selectedDay || !selectedTime || rating <= 0) {
        Alert.alert("시간과 별점을 필수로 선택해주세요.");
        return;
      }

      const finalDay = user.day - 2 + dayOption.indexOf(selectedDay);

      const created = await createReview({
        name: name,
        foods: foodItems,
        mealTime: selectedTime,
        imageURL: imageURL,
        comment: comment,
        rating: Number(rating),
        day: finalDay,
      });
      await new Promise((r) => setTimeout(r, 300));
      await onCreateSuccess?.(created);
      Alert.alert("등록 완료", "식단이 성공적으로 등록되었습니다.");
      onClose();
    } catch (error) {
      console.error("식단 저장 실패: ", error);
      Alert.alert("저장 실패", "식단을 저장하는 데 실패했습니다.");
    }
  };
  const COMMENT_MAX = 50;

  const handleChangeComment = (t) => {
    setComment(t.slice(0, COMMENT_MAX));
  };

  return (
    <View style={styles.container}>
      <IconBar onClose={onClose} />
      <View style={[styles.header, { backgroundColor: Colors.point_red }]}>
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
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
          >
            {/* 날짜 */}
            <Text style={styles.subtitle}>언제 먹었나요?</Text>
            <TagContainer
              tags={dayOption}
              mode="select_single"
              onPress={(day) => setSelectedDay(day)}
              selectedTag={selectedDay}
            />

            {/* 시간대 */}
            <Text style={[styles.subtitle, { marginTop: 32 }]}>
              어느 시간대에 먹었나요?
            </Text>
            <TagContainer
              tags={timeOption}
              mode="select_single"
              onPress={(time) => setSelectedTime(time)}
              selectedTag={selectedTime}
              containerStyle={{ marginBottom: 24 }}
            />

            {/* 이미지 */}
            <View style={{ width: "100%", alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => pickImage({ setImageUrl: setImageURL })}
                style={[
                  styles.imageBox,
                  imageURL !== "" ? styles.imageBoxWithImage : null,
                ]}
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
            <View style={{ width: "100%", marginTop: 20 }}>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  placeholder="한줄평을 남겨보세요..."
                  value={comment}
                  onChangeText={handleChangeComment}
                  maxLength={50}
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />
                <View style={styles.charBadge}>
                  <Text style={styles.charBadgeText}>
                    {comment.length}/{COMMENT_MAX}
                  </Text>
                </View>
              </View>
            </View>
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

export default CreateReviewModal;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 630,
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
    width: 222,
    height: 176,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: Colors.light_gray,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background_white,
    overflow: "hidden",
  },
  imageBoxWithImage: {
    width: "100%",
    height: 250,
    borderRadius: 16,
    borderWidth: 0,
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
  inputWrap: {
    width: "100%",
    position: "relative",
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.text_gray,
    borderRadius: 16,
    textAlign: "center",
    width: "100%",
    height: 48,
    paddingRight: 64,
    paddingLeft: 64,
    fontFamily: "NanumSquareRoundB",
    fontSize: 16,
    color: Colors.burn,
  },
  charBadge: {
    position: "absolute",
    right: 10,
    top: 6,
    bottom: 6,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    borderRadius: 13,
    backgroundColor: Colors.light_text_gray,
  },

  charBadgeText: {
    fontFamily: "NanumSquareRoundB",
    fontSize: 14,
    color: Colors.text_gray,
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
