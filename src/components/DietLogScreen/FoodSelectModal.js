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
import { fetchLikedFoodNames } from "../../services/user";
import { fetchAllFoodNames } from "../../services/food";
// 모달은 쓰지 않지만, 기존의 유사도 함수만 재활용
import { getBestMatches } from "./NameCheckAlgorithm";

import Colors from "../../styles/colors";
import IconBar from "./IconBar";
import TagContainer from "../TagContainer";

const FoodSelectModal = ({ onClose, onSelect, initialFoods }) => {
  const { user } = useAuthStore();
  const [likedFoods, setLikedFoods] = useState([]);
  const [allFoodNames, setAllFoodNames] = useState([]);

  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        const liked = await fetchLikedFoodNames(user.uid);
        setLikedFoods(liked || []);
      } catch (e) {
        console.log("fetchLikedFoodNames failed:", e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const names = await fetchAllFoodNames();
        const uniq = Array.from(new Set((names || []).filter(Boolean)));
        setAllFoodNames(uniq);
      } catch (e) {
        console.log("fetchAllFoodNames failed:", e);
      }
    })();
  }, []);

  // 입력 단계 상태
  const [inputList, setInputList] = useState(
    Array.isArray(initialFoods) && initialFoods.length ? initialFoods : [""]
  );
  const [curInputIndex, setCurInputIndex] = useState(0);

  // 검수 단계 상태
  const [phase, setPhase] = useState("input"); // 'input' | 'check'
  const [pendingList, setPendingList] = useState([]); // 검수 대상
  const [checkIdx, setCheckIdx] = useState(0);
  const [targetMode, setTargetMode] = useState("fast"); // 'fast' | 'slow'
  const updateInput = (index, value) => {
    const next = [...inputList];
    next[index] = value;
    setInputList(next);
  };

  const addInput = () => {
    setInputList((prev) => [...prev, ""]);
    setCurInputIndex(inputList.length);
  };

  const startCheck = (mode) => {
    const filtered = inputList
      .map((s) => (s || "").trim())
      .filter((s) => s.length > 0);

    if (!filtered.length) return;
    setTargetMode(mode);
    console.log("Starting check in mode:", mode);
    setPendingList(filtered);
    setCheckIdx(0);
    setPhase("check");
  };

  const finishAndEmit = (finalArr) => {
    onSelect?.(finalArr, targetMode); // 부모로 최종 배열 전달
    onClose?.();          // 겹침 방지 위해 닫기(원하면 제거 가능)
  };

  const goNextOrFinish = (updatedArr) => {
    const next = checkIdx + 1;
    if (next >= updatedArr.length) {
      finishAndEmit(updatedArr);
    } else {
      setCheckIdx(next);
    }
  };

  // ---------- 내장 NameCheck UI ----------
  const NameCheckPanel = ({
    value,
    candidates,
    onPick,      // 제안 수락 (문자열 전달)
    onKeep,      // 원문 유지
    onCancel,    // 전체 검수 취소
  }) => {
    // 상위의 getBestMatches 재활용 (없으면 방어)
    const suggestions = useMemo(() => {
      try {
        const { top } = getBestMatches(value, candidates, 5) || { top: [] };
        return top;
      } catch {
        return [];
      }
   }, [value, candidates]);

    return (
      <View style={styles.checkBox}>
        <Text style={styles.checkTitle}>이 이름이 맞나요?</Text>
        <Text style={styles.checkInputName}>{value}</Text>

        <Text style={styles.checkSubTitle}>추천 후보</Text>
        <View style={styles.suggestionContainer}>
          {suggestions.length === 0 ? (
            <Text style={styles.noSuggestion}>추천 후보가 없습니다.</Text>
          ) : (
            suggestions.map(({name,score}, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.suggestionChip}
                onPress={() => onPick(name)}
              >
                <Text style={styles.suggestionText}>{name} ({score.toFixed(3)})</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.checkButtonsRow}>
          <TouchableOpacity style={[styles.smallBtn, { backgroundColor: "#EEE" }]} onPress={onKeep}>
            <Text style={[styles.smallBtnText, { color: Colors.burn }]}>원문 유지</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.smallBtn, { backgroundColor: Colors.point_red }]} onPress={onCancel}>
            <Text style={[styles.smallBtnText, { color: "#FFF" }]}>취소</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.checkHint}>
          • 후보를 탭하면 바로 확정됩니다.{"\n"}• 원문 유지/스킵은 입력한 이름 그대로 진행합니다.
        </Text>
      </View>
    );
  };

  // 현재 검수 중 이름
  const currentName = phase === "check" ? pendingList[checkIdx] : "";

  const acceptSuggestion = (suggested) => {
    const arr = [...pendingList];
    arr[checkIdx] = suggested || arr[checkIdx];
    setPendingList(arr);
    goNextOrFinish(arr);
  };

  const keepOriginal = () => {
    goNextOrFinish(pendingList);
  };

  const cancelCheck = () => {
    // 검수 전체 취소 → 입력 단계로 되돌림 (선택 전달 없음)
    setPhase("input");
    setPendingList([]);
    setCheckIdx(0);
    setTargetMode(null);
  };

  // ---------------- Render ----------------
  if (phase === "check") {
    return (
      <View style={styles.container}>
        <IconBar onClose={onClose} />
        <View style={styles.contentBox}>
          <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            <Text style={styles.question}>이름 검수 ({checkIdx + 1} / {pendingList.length})</Text>

            <NameCheckPanel
              value={currentName}
              candidates={allFoodNames}
              onPick={acceptSuggestion}
              onKeep={keepOriginal}
              onCancel={cancelCheck}
            />
          </ScrollView>
        </View>
      </View>
    );
  }

  // phase === 'input'
  return (
    <View style={styles.container}>
      <IconBar onClose={onClose} />

      <View style={styles.contentBox}>
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
              style={[styles.confirmButton, { backgroundColor: Colors.point_red }]}
              onPress={() => startCheck("fast")}
            >
              <Text style={styles.confirmText}>고속노화로 저장</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: Colors.point_green }]}
              onPress={() => startCheck("slow")}
            >
              <Text style={styles.confirmText}>저속노화로 저장</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  confirmText: {
    fontFamily: "NanumSquareEB",
    fontSize: 18,
    fontWeight: 800,
    color: "#FFF",
  },
  // ----- inline check UI -----
  checkBox: {
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.light_gray,
    borderRadius: 16,
  },
  checkTitle: {
    fontFamily: "NanumSquareEB",
    fontSize: 16,
    color: Colors.burn,
    marginBottom: 8,
  },
  checkInputName: {
    fontFamily: "NanumSquareEB",
    fontSize: 22,
    color: Colors.point_red,
    textAlign: "center",
    marginBottom: 16,
  },
  checkSubTitle: {
    fontFamily: "NanumSquareB",
    fontSize: 14,
    color: Colors.slightly_burn,
    marginBottom: 8,
  },
  suggestionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  suggestionChip: {
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.light_gray,
  },
  suggestionText: {
    fontFamily: "NanumSquareB",
    fontSize: 14,
    color: Colors.burn,
  },
  smallBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  smallBtnText: {
    fontFamily: "NanumSquareEB",
    fontSize: 14,
  },
  checkButtonsRow: {
    flexDirection: "row",
    width: "100%",
    marginTop: 6,
  },
  checkHint: {
    marginTop: 10,
    fontSize: 12,
    color: Colors.slightly_burn,
    textAlign: "left",
    lineHeight: 18,
  },
});
