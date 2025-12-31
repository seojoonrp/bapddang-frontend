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
import { fetchLikedFoods } from "../../services/user";
import { validateFoods } from "../../services/food";
import { createCustomFood } from "../../services/food";

import Colors from "../../constants/colors";
import IconBar from "./IconBar";
import TagContainer from "../TagContainer";

const FoodSelectModal = ({ onClose, onSelect, initialFoods }) => {
  const { user } = useAuthStore();
  const [likedFoods, setLikedFoods] = useState([]);

  // 입력 단계 상태
  const [inputList, setInputList] = useState(
    Array.isArray(initialFoods) && initialFoods.length ? initialFoods : [""]
  );
  const [curInputIndex, setCurInputIndex] = useState(0);

  // 서버 요청 진행 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingMode, setPendingMode] = useState(null);

  const [isInCheckMode, setIsInCheckMode] = useState(false);
  const [suggestionQueue, setSuggestionQueue] = useState([]);
  const [resolvedItems, setResolvedItems] = useState([]);

  // 좋아요한 음식 불러오기
  useEffect(() => {
    if (!user) return;

    fetchLikedFoods()
      .then((data) => {
        console.log("Fetched liked foods:", data.likedFoods);
        if (data) {
          const names = data.map((food) => food.name);
          setLikedFoods(names);
        } else {
          setLikedFoods([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching liked foods:", error);
      });
  }, [user]);

  const updateInput = (index, value) => {
    const next = [...inputList];
    next[index] = value;
    setInputList(next);
  };

  const addInput = () => {
    setInputList((prev) => [...prev, ""]);
    setCurInputIndex(inputList.length);
  };

  const startCheck = async (mode) => {
    const filtered = inputList
      .map((s) => (s || "").trim())
      .filter((s) => s.length > 0);
    if (!filtered.length) return;
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    try {
      setIsSubmitting(true);
      setPendingMode(mode);

      const results = await validateFoods(filtered);

      const toResolve = [];
      const toCheck = [];

      results.forEach((item, idx) => {
        const fallbackName = item.originalName ?? filtered[idx];
        if (item.status === "suggestion") {
          toCheck.push({ ...item, fallbackName });
        } else {
          const output = item.okOutput || item.newOutput || {};
          toResolve.push({
            name: output.name ?? fallbackName,
            foodId: output.id,
            foodType:
              output.type || (item.status === "new" ? "new" : "general"),
          });
        }
      });

      setResolvedItems(toResolve);
      setSuggestionQueue(toCheck);

      if (toCheck.length > 0) {
        setIsInCheckMode(true);
      } else {
        completeSelection(toResolve, mode);
      }
    } catch (error) {
      alert("음식 확인 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("Error in startCheck:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleResolveSuggestion = (choiceItem) => {
    const newItem = {
      name: choiceItem.name,
      foodId: choiceItem.id,
      foodType: choiceItem.type,
    };
    const nextResolved = [...resolvedItems, newItem];
    setResolvedItems(nextResolved);
    const nextQueue = suggestionQueue.slice(1);
    setSuggestionQueue(nextQueue);
    if (nextQueue.length === 0) {
      completeSelection(nextResolved, pendingMode);
    }
  };
  const handleCreateCustom = async () => {
    const currentItem = suggestionQueue[0];
    if (!currentItem) return;

    try {
      setIsSubmitting(true);

      const newFoodData = await createCustomFood(currentItem.fallbackName);

      const newItem = {
        name: newFoodData.name,
        foodId: newFoodData.id,
        foodType: "custom",
      };
      moveToNext(newItem);
    } catch (error) {
      alert("음식 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("Error in handleCreateCustom:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const moveToNext = (newItem) => {
    const nextResolved = [...resolvedItems, newItem];
    setResolvedItems(nextResolved);

    const nextQueue = suggestionQueue.slice(1);
    setSuggestionQueue(nextQueue);

    if (nextQueue.length === 0) {
      completeSelection(nextResolved, pendingMode);
    }
  };

  const completeSelection = (finalFoods, mode) => {
    onSelect(finalFoods, mode);
    onClose?.();
  };

  const currentTarget = suggestionQueue[0];
  return (
    <View style={styles.container}>
      <IconBar onClose={onClose} />

      <View style={styles.contentBox}>
        {isInCheckMode && currentTarget ? (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.question}>혹시 이 음식을 말씀하신 건가요?</Text>

            <Text style={styles.checkHint}>
              {resolvedItems.length + 1} /{" "}
              {resolvedItems.length + suggestionQueue.length} 번째 음식 확인 중
            </Text>

            <View style={styles.checkBox}>
              <Text style={styles.checkTitle}>입력한 음식</Text>
              <Text style={styles.checkInputName}>
                {currentTarget.fallbackName}
              </Text>
            </View>

            <View style={{ width: "100%", marginTop: 20 }}>
              <Text style={styles.subTitle}>추천 검색 결과</Text>
              <View style={styles.suggestionContainer}>
                {currentTarget.suggestionOutputs?.map((opt) => (
                  <TouchableOpacity
                    key={opt.id}
                    style={styles.suggestionChip}
                    onPress={() => handleResolveSuggestion(opt)}
                  >
                    <Text style={styles.suggestionText}>{opt.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 원본 유지 버튼 */}
            <TouchableOpacity
              style={[
                styles.confirmButton,
                { backgroundColor: Colors.slightly_burn, marginTop: 30 },
              ]}
              onPress={handleCreateCustom}
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
              tags={likedFoods}
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

// ---------------- Styles ----------------
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
