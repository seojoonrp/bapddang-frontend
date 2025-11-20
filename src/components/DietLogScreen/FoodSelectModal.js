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
import { validateFoods } from "../../services/food";

import Colors from "../../styles/colors";
import IconBar from "./IconBar";
import TagContainer from "../TagContainer";

const FoodSelectModal = ({ onClose, onSelect, initialFoods }) => {
  const { user } = useAuthStore();
  const [likedFoods, setLikedFoods] = useState([]);

  // 서버 요청 진행 상태
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 입력 단계 상태
  const [inputList, setInputList] = useState(
    Array.isArray(initialFoods) && initialFoods.length ? initialFoods : [""]
  );
  const [curInputIndex, setCurInputIndex] = useState(0);

  //좋아요한 음식 fetch
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
    if(!user){
      alert("로그인이 필요합니다.");
      return;
    }
    try{
      setIsSubmitting(true);
      const results = await validateFoods(filtered);

      const finalNames = results.map((item,idx) =>{
        switch(item.status){
          case "ok":
            return item.food?.name ?? item.originalName ?? filtered[idx];
          case "suggestion":
            return item.correctedName;
          case "new":
          default:
            return item.originalName ?? filtered[idx];
        }
      });

      onSelect(finalNames, mode);
      onClose?.();
    }catch(error){
      alert("음식 확인 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("Error in startCheck:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
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
