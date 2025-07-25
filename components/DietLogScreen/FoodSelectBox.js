import React,{useState} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";

const { width, height } = Dimensions.get("window");

const recentFoods = ["로제떡볶이", "삼계탕", "마라상궈", "고추바사삭", "라면"];

const FoodSelectBox = ({ visible, onClose, onSelect }) => {
  const [inputList, setInputList] = useState([""]);

  const updateInput = (index, value) => {
    const newInputs = [...inputList];
    newInputs[index] = value;
    setInputList(newInputs);
  };

  const addInput = () => {
    setInputList([...inputList, ""]);
  };

  const setFromRecent = (food) => {
    const lastIndex = inputList.length - 1;
    updateInput(lastIndex, food);
  };

  const handleConfirm = () => {
    const filtered = inputList.filter(item => item.trim() !== "");
    onSelect(filtered);
  };
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.outerBox}>
                <Text style={styles.question}>어떤 음식을 먹었나요?</Text>
                <TextInput
                  key={index}
                  style={styles.input}
                  placeholder="음식 이름을 입력해주세요"
                  value={input}
                  onChangeText={(text) => updateInput(index, text)}
                />
                <TouchableOpacity style={styles.addButton} onPress={addInput}>
                    <Text style={styles.addButtonText}>+ 추가하기</Text>
                </TouchableOpacity>
                <Text style={styles.subTitle}>최근 자주 먹은 음식</Text>
                <View style={styles.foodTagContainer}>
                  {recentFoods.map((food) => (
                    <TouchableOpacity
                      key={food}
                      style={styles.foodTag}
                      onPress={() => setInputValue(food)}
                    >
                      <Text style={styles.foodTagText}>{food}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity style={styles.confirmButton} onPress={() => onSelect(inputValue)}>
                  <Text style={styles.confirmText}>확인</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default FoodSelectBox;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: width - 22,
    height: height - 200,
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: "center",
    gap: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  outerBox: {
    display: "flex",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    paddingVertical: 46,
    paddingHorizontal: 23,
    borderColor: "#D9D9D9",
    borderRadius: 13,
    borderWidth: 1,
    flexDirection: "column",
    gap: 25,
    alignItems: "center",
    backgroundColor: "white",
    alignSelf: "stretch",
  },
  question: {
    fontFamily: "NanumSquareOTF",
    fontSize: 18,
    color: "#521210",
    fontWeight: 700,
  },
  input: {
    height: 51,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 13,
    alignSelf: "stretch",
    fontFamily: "NanumSquareOTF",
    fontSize: 16,
    textAlign: "center",
    display: "flex",
  },
  subTitle: {
    color: "#A88786",
    fontFamily: "NanumSquareOTF",
    fontSize: 14,
    fontWeight: 400,
  },
  foodTagContainer: {
    display: "flex",
    width: 314,
    alignContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  foodTag: {
    display: "flex",
    borderWidth: 0.4,
    borderColor: "#D9D9D9",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 9,
    gap: 10,
    boxShadow: "0px -2px 4px 0px #A94946 inset, 0px -2px 6px 2px #FDEDC0 inset",
  },
  foodTagText: {
    fontFamily: "NanumSquareOTF",
    fontSize: 16,
    color: "#521210",
    opacity: 0.5,
    fontWeight:700,
  },
  confirmButton: {
  paddingVertical: 16,
  paddingHorizontal: 30,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 20,
  borderWidth: 0.4,
  borderColor: "#D9D9D9",
  backgroundColor: "#E90C05", // fallback color
  gap: 10, // 이건 View 내부에 요소가 여러 개 있을 경우만 의미 있음
},
  confirmText: {
    fontFamily: "NanumSquareOTF",
    fontSize: 18,
    fontWeight: 800,
    color:"#FFF",
  },
});
