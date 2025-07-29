import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import keywordMap from "../data/keywordMap.json";
import Colors from "../styles/colors";
import Star from "./svg/Star";

const ReviewBox = ({ visible, onClose, item, mode }) => {
  const [timeOption, setTimeOption] = useState([
    "아침",
    "점심",
    "저녁",
    "기타",
  ]);
  const [tagOption, setTagOption] = useState([]);

  const [selectedTimes, setSelectedTimes] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const totalCharLength = Array.isArray(item.name)
    ? item.name.join(" & ").length
    : item.name.length;
  useEffect(() => {
    if (!item?.name) return;
    const tagData = keywordMap[item.name];
    if (tagData) {
      setTagOption(tagData.situation || []);
    } else {
      setTagOption(["혼밥"]);
    }
  }, [item]);

  const toggleTag = (tag, selectedList, setSelectedList) => {
    if (selectedList.includes(tag)) {
      setSelectedList(selectedList.filter((t) => t !== tag));
    } else {
      setSelectedList([...selectedList, tag]);
    }
  };

  const handleSubmit = () => {
    console.log("이유:", selectedTimes);
    console.log("상황:", selectedSituations);
    console.log("한줄평:", comment);
    console.log("별점:", rating);
    alert("후기가 등록되었습니다!");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.iconBar}>
                <TouchableOpacity onPress={onClose} style={styles.iconLeft}>
                  <Ionicons name="chevron-back" size={20} color="#CCC" />
                  <Text style={styles.iconText}>CALENDAR</Text>
                </TouchableOpacity>
              </View>

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
                  {item.name.join("&")}
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
                  <View style={styles.tagContainer}>
                    {timeOption.map((tag) => (
                      <TouchableOpacity
                        key={tag}
                        style={[
                          styles.tag,
                          selectedTimes.includes(tag) && styles.tagSelected,
                        ]}
                        onPress={() =>
                          toggleTag(tag, selectedTimes, setSelectedTimes)
                        }
                      >
                        <Text
                          style={[
                            styles.tagText,
                            { opacity: selectedTimes.includes(tag) ? 1 : 0.5 },
                          ]}
                        >
                          {tag}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.subtitle}>어떤 상황에서 먹었나요?</Text>
                  <View style={styles.tagContainer}>
                    {tagOption.map((tag) => (
                      <TouchableOpacity
                        key={tag}
                        style={[
                          styles.tag,
                          selectedTags.includes(tag) && styles.tagSelected,
                        ]}
                        onPress={() =>
                          toggleTag(tag, selectedTags, setSelectedTags)
                        }
                      >
                        <Text
                          style={[
                            styles.tagText,
                            {
                              opacity: selectedTags.includes(tag) ? 1 : 0.5,
                            },
                          ]}
                        >
                          {tag}
                        </Text>
                      </TouchableOpacity>
                    ))}
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
                        <Text
                          style={[
                            styles.star,
                            rating >= i && styles.starSelected,
                          ]}
                        >
                          ★
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[
                        styles.bottomButton,
                        { backgroundColor: "#D9D9D9" },
                      ]}
                      onPress={onClose}
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
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ReviewBox;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
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
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 35,
  },
  tagText: {
    fontFamily: "NanumSquareB",
    fontSize: 16,
    color: Colors.burn,
    opacity: 0.5,
  },
  tag: {
    borderWidth: 0.4,
    borderColor: "#D9D9D9",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    margin: 3,
    boxShadow: "0px -2px 4px 0px #A94946 inset, 0px -2px 6px 2px #FDEDC0 inset",
  },
  tagSelected: {
    boxShadow:
      "0px 2px 4px 0px #A94946 inset, 0px 2px 4px 4px rgba(169, 73, 70, 0.30) inset, 0px 2px 6px 4px #FDEDC0 inset",
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
