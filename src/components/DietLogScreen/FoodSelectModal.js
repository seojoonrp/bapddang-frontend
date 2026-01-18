import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

import useAuthStore from "../../stores/authStore";

import { getBestMatches } from "../../utils/nameCheck.js";
import { standardFoodNames } from "../../constants/data/standardFoodNames.js";

import { fetchLikedFoods } from "../../services/like.js";

import Colors from "../../constants/colors";
import IconBar from "./IconBar";
import TagContainer from "../TagContainer";

const SCORE_THRESHOLD = 0.7;

const FoodSelectModal = ({ onClose, onSelect, initialFoods }) => {
  const user = useAuthStore((state) => state.user);

  // 입력 단계 상태
  const [likedFoodNames, setLikedFoodNames] = useState([]);
  const [inputList, setInputList] = useState(
    Array.isArray(initialFoods) && initialFoods.length ? initialFoods : [""]
  );
  const [curInputIndex, setCurInputIndex] = useState(0);

  // 검사 관련
  const [isInCheckMode, setIsInCheckMode] = useState(false);
  const [suggestionQueue, setSuggestionQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [finalNames, setFinalNames] = useState([]);
  const [currentMode, setCurrentMode] = useState("fast");

  // 좋아요한 음식 불러오기
  useEffect(() => {
    if (!user) return;

    fetchLikedFoods()
      .then((data) => {
        if (data.liked_foods) {
          const names = data.liked_foods.map((food) => food.name);
          console.log("Fetched liked foods:", names);
          setLikedFoodNames(names);
        } else {
          console.log("No liked foods found.");
          setLikedFoodNames([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching liked foods:", error);
      });
  }, [user]);

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
        // 완전 일치
        autoResolvedNames.push(topMatch.name);
      } else {
        const validSuggestions = result.top.filter(
          (opt) => opt.score >= SCORE_THRESHOLD
        );

        queue.push({
          originalName: name,
          suggestions: validSuggestions,
        });
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

      <View style={styles.contentBox}>
        {isInCheckMode && currentTarget ? (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.question}>혹시 이 음식을 말씀하신 건가요?</Text>

            <Text style={styles.checkHint}>
              {currentIndex + 1} / {suggestionQueue.length} 번째 음식 확인 중
            </Text>

            <View style={styles.checkBox}>
              <Text style={styles.checkTitle}>입력한 음식</Text>
              <Text style={styles.checkInputName}>
                {currentTarget.originalName}
              </Text>
            </View>

            <View style={{ width: "100%", marginTop: 20 }}>
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
              style={[
                styles.confirmButton,
                {
                  backgroundColor: Colors.slightly_burn,
                  marginTop: 30,
                  width: "100%",
                },
              ]}
              onPress={() => handleSelectName(currentTarget.originalName)}
            >
              <Text style={styles.confirmText}>원문 그대로 사용</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <ScrollView
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
                  { backgroundColor: Colors.point_red },
                ]}
                onPress={() => startCheck("fast")}
              >
                <Text style={styles.confirmText}>고속노화로 저장</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  { backgroundColor: Colors.point_green },
                ]}
                onPress={() => startCheck("slow")}
              >
                <Text style={styles.confirmText}>저속노화로 저장</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default FoodSelectModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  contentBox: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: 580,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderColor: Colors.light_gray,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 20,
  },
  question: {
    color: Colors.point_red,
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
    marginBottom: 16,
  },
  addButton: {
    width: 72,
    height: 38,
    backgroundColor: Colors.light_text_gray,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 35,
  },
  addButtonText: {
    color: "white",
    textAlign: "center",
    fontFamily: "NanumSquareB",
    fontSize: 20,
  },
  subTitle: {
    color: Colors.slightly_burn,
    fontFamily: "NanumSquareB",
    fontSize: 15,
    marginBottom: 10,
  },
  confirmButton: {
    paddingVertical: 16,
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 0.4,
    borderColor: Colors.light_gray,
    backgroundColor: Colors.point_red,
    marginTop: 15,
  },
  dualConfirmRow: {
    width: "100%",
    marginTop: 10,
    gap: 10,
  },
  confirmText: {
    fontFamily: "NanumSquareEB",
    fontSize: 18,
    fontWeight: "800",
    color: "#FFF",
  },
  // ----- inline check UI -----
  checkBox: {
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.light_gray,
    borderRadius: 16,
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
    fontFamily: "NanumSquareEB",
    fontSize: 24,
    color: Colors.point_red,
    textAlign: "center",
  },
  checkHint: {
    marginBottom: 15,
    fontSize: 14,
    color: "black",
    fontFamily: "NanumSquareB",
  },
  suggestionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  suggestionChip: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.light_gray,
    backgroundColor: "white",
    marginBottom: 6,
  },
  suggestionText: {
    fontFamily: "NanumSquareB",
    fontSize: 16,
    color: Colors.burn,
  },
});
