// src/components/DietLogScreen/FoodSelectModal.js

import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useFoodStore } from "../../stores/foodStore.js";
import { getBestMatches } from "../../utils/nameCheck.js";
import { standardFoodNames } from "../../constants/data/standardFoodNames.js";
import Colors from "../../constants/colors";
import IconBar from "./IconBar";
import TagContainer from "../TagContainer";

const SCORE_THRESHOLD = 0.85;

const FoodSelectModal = ({ onClose, onSelect, initialFoods }) => {
  const [inputList, setInputList] = useState(
    Array.isArray(initialFoods) && initialFoods.length ? initialFoods : [""],
  );
  const [curInputIndex, setCurInputIndex] = useState(0);

  // 검사 관련
  const [isInCheckMode, setIsInCheckMode] = useState(false);
  const [suggestionQueue, setSuggestionQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [finalNames, setFinalNames] = useState([]);
  const [currentMode, setCurrentMode] = useState("fast");

  // 좋아요한 음식 불러오기
  const likedFoodIDs = useFoodStore((state) => state.likedFoodIDs);
  const foodsByID = useFoodStore((state) => state.foodsByID);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const likedFoodNames = useMemo(() => {
    const fullList = likedFoodIDs.map((id) => foodsByID[id]).filter(Boolean);
    const shuffledList = shuffleArray(fullList);
    const names = shuffledList.slice(0, 5).map((item) => item.food.name);
    return [...new Set(names)];
  }, [likedFoodIDs, foodsByID]);

  // 입력 로직
  const updateInput = (index, value) => {
    const next = [...inputList];
    next[index] = value;
    setInputList(next);
  };

  const addInput = () => {
    setInputList((prev) => [...prev, ""]);
    setCurInputIndex(inputList.length);
  };

  // 검사 시작
  const startCheck = (mode) => {
    const rawFiltered = inputList
      .map((s) => (s || "").trim())
      .filter((s) => s.length > 0);
    const filtered = [...new Set(rawFiltered)]; // 중복 제거

    if (!filtered.length) {
      console.log("음식을 한 개 이상 선택해주세요");
      return;
    }

    const queue = [];
    const autoResolvedNames = [];

    filtered.forEach((name) => {
      const result = getBestMatches(name, standardFoodNames, 3);
      const topMatch = result.best;

      if (topMatch && topMatch.score === 1) {
        autoResolvedNames.push(topMatch.name); // 완전 일치
      } else {
        const validSuggestions = result.top.filter(
          (opt) => opt.score >= SCORE_THRESHOLD,
        );

        if (validSuggestions.length > 0) {
          queue.push({
            originalName: name,
            suggestions: validSuggestions,
          });
        } else {
          autoResolvedNames.push(name); // 비슷한 게 없는 경우
        }
      }
    });

    if (queue.length === 0) {
      completeSelection(autoResolvedNames, mode);
      return;
    }

    setSuggestionQueue(queue);
    setCurrentIndex(0);
    setFinalNames(autoResolvedNames);
    setCurrentMode(mode);
    setIsInCheckMode(true);
  };

  const handleSelectName = (selectedName) => {
    const nextFinalNames = [...finalNames, selectedName];

    if (currentIndex + 1 < suggestionQueue.length) {
      setCurrentIndex(currentIndex + 1);
      setFinalNames(nextFinalNames);
    } else {
      const uniqueFinalNames = [...new Set(nextFinalNames)];
      completeSelection(uniqueFinalNames, currentMode);
    }
  };

  const completeSelection = (finalFoodNames, mode) => {
    console.log("Final selected food names:", finalFoodNames);
    onSelect(finalFoodNames, mode);
    onClose();
  };

  const currentTarget = suggestionQueue[currentIndex] || {};

  return (
    <View style={styles.container}>
      <IconBar onClose={onClose} />
      <View style={styles.outerFrame}>
        <View style={styles.contentBox}>
          {isInCheckMode && currentTarget ? (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <Text style={styles.question}>
                혹시 이 음식을 말씀하신 건가요?
              </Text>

              <View style={styles.checkBox}>
                <Text style={styles.checkTitle}>입력한 음식</Text>
                <Text style={styles.checkInputName}>
                  {currentTarget.originalName}
                </Text>
              </View>

              <View
                style={{
                  width: "100%",
                  marginTop: 20,
                  marginBottom: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.subTitle}>추천 검색 결과</Text>
                <View style={styles.suggestionContainer}>
                  {currentTarget.suggestions?.map((opt, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.suggestionChip}
                      onPress={() => handleSelectName(opt.name)}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text style={styles.suggestionText}>{opt.name}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => handleSelectName(currentTarget.originalName)}
              >
                <Text style={styles.confirmText}>원문 그대로 사용</Text>
              </TouchableOpacity>
            </ScrollView>
          ) : (
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.question}>어떤 음식을 먹었나요?</Text>

              {inputList.map((input, index) => (
                <TextInput
                  key={index}
                  style={styles.input}
                  placeholder="음식 이름을 입력해주세요"
                  value={input}
                  onChangeText={(text) => updateInput(index, text)}
                  onFocus={() => setCurInputIndex(index)}
                />
              ))}

              <TouchableOpacity style={styles.addButton} onPress={addInput}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>

              <Text style={styles.subTitle}>좋아요한 음식</Text>
              <TagContainer
                tags={likedFoodNames}
                mode="assign"
                onPress={(food) => updateInput(curInputIndex, food)}
                containerStyle={{ marginBottom: 20 }}
              />

              <View style={styles.dualConfirmRow}>
                <TouchableOpacity
                  style={[
                    styles.confirmButton,
                    {
                      backgroundColor: Colors.point_red,
                      alignSelf: "center",
                      width: 100,
                    },
                  ]}
                  onPress={() => startCheck("fast")}
                >
                  <Text style={styles.confirmText}>다음</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </View>
  );
};

export default FoodSelectModal;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "70%",
    maxHeight: 600,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  outerFrame: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    borderColor: Colors.background_yellow,
    borderWidth: 3,
    padding: 10,
    backgroundColor: Colors.background_white,
  },
  contentBox: {
    justifyContent: "center",
    width: "100%",
    height: "100%",
    paddingHorizontal: 20,
    borderColor: Colors.light_text_gray,
    borderRadius: 13,
    borderWidth: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  question: {
    color: Colors.burn,
    fontFamily: "NanumSquareRoundEB",
    fontSize: 18,
    fontWeight: 800,
    marginBottom: 25,
  },
  input: {
    width: "100%",
    height: 51,
    borderColor: Colors.point_red,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: "white",
    color: Colors.burn,
    fontFamily: "NanumSquareR",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    boxShadow: "0 1px 0 2px rgba(204, 204, 204, 0.30) inset",
  },
  addButton: {
    width: 72,
    height: 38,
    backgroundColor: "#eceaea",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 35,
  },
  addButtonText: {
    color: "white",
    textAlign: "center",
    fontFamily: "NanumSquareB",
    fontSize: 22,
  },
  subTitle: {
    color: Colors.slightly_burn,
    fontFamily: "NanumSquareRoundB",
    fontSize: 14,
    marginBottom: 10,
  },
  confirmButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 0.4,
    borderColor: Colors.light_gray,
    backgroundColor: Colors.point_red,
    marginTop: 10,
  },
  dualConfirmRow: {
    width: "100%",
    marginTop: 10,
    gap: 10,
  },
  confirmText: {
    color: Colors.background_white,
    fontFamily: "NanumSquareEB",
    fontSize: 18,
  },
  checkBox: {
    width: "100%",
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: Colors.light_text_gray,
    borderRadius: 99,
    alignItems: "center",
    marginBottom: 10,
  },
  checkTitle: {
    fontFamily: "NanumSquareB",
    fontSize: 14,
    color: Colors.slightly_burn,
    marginBottom: 8,
  },
  checkInputName: {
    fontFamily: "NanumSquareRoundEB",
    fontSize: 24,
    color: Colors.point_red,
    textAlign: "center",
  },
  suggestionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  suggestionChip: {
    display: "flex",
    borderWidth: 0.4,
    borderColor: Colors.light_gray,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
    boxShadow: "0px -2px 4px 0px #A94946 inset, 0px -2px 6px 2px #FDEDC0 inset",
  },
  suggestionText: {
    fontFamily: "NanumSquareB",
    fontSize: 16,
    color: Colors.slightly_burn,
  },
});
