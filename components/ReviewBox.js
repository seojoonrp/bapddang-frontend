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
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import keywordMap from "../data/keywordMap.json";
import Colors from "../styles/colors";
import Star from "./svg/Star";
const { width, height } = Dimensions.get("window");
const PADDING_HORIZONTAL = 11;

const ReviewBox = ({ visible, onClose, item, mode }) => {
  const [tagsTime, setTagsTime] = useState([]);
  setTagsTime(["아침", "점심", "저녁", "기타"]);
  const [tagsSituation, setTagsSituation] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [selectedSituations, setSelectedSituations] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const totalCharLength = Array.isArray(item.name)
  ? item.name.join(" & ").length
  : item.name.length; // 글자수 계산
  useEffect(() => {
    if (!item?.name) return;
    const tagData = keywordMap[item.name];
    if (tagData) {
      setTagsSituation(tagData.situation || []);
    } else {
      setTagsSituation(["혼밥"]);
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
    <Modal
      visible={visible}
      animationType="fade"
      transparent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.boxContainer}>
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
                      mode === "fast" ? Colors.point_red : "#00CA80",
                  },
                ]}
              >
                <Star />
                <Text style={[styles.headerText,{fontSize: totalCharLength > 11 ? 18 : 30},]}>{item.name.join("&")}</Text>
                <Star />
              </View>

              <View style={styles.contentBox}>
                <Text style={styles.subtitle}>어느 시간대에 먹었나요?</Text>
                <View style={styles.tagContainer}>
                  {tagsTime.map((tag) => (
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
                  {tagsSituation.map((tag) => (
                    <TouchableOpacity
                      key={tag}
                      style={[
                        styles.tag,
                        selectedSituations.includes(tag) && styles.tagSelected,
                      ]}
                      onPress={() =>
                        toggleTag(
                          tag,
                          selectedSituations,
                          setSelectedSituations
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.tagText,
                          {
                            opacity: selectedSituations.includes(tag) ? 1 : 0.5,
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
  boxContainer: {
    width: width - PADDING_HORIZONTAL * 2,
    backgroundColor: "transparent",
  },
  iconBar: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
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
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    paddingTop: 21,
    paddingBottom: 17,
    alignItems: "center",
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 12,
    height: 632,
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
