import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

import Colors from "../../styles/colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ScrollView } from "react-native-gesture-handler";

const recentFoods = ["로제떡볶이", "삼계탕", "마라상궈", "고추바사삭", "라면"];
const likedFoods = ["김치찌개", "된장찌개", "비빔밥", "불고기", "떡볶이"];

const FoodSelectBox = ({ visible, onClose, onSelect }) => {
  const [inputList, setInputList] = useState([""]);
  const [curInputIndex, setCurInputIndex] = useState(0);

  const updateInput = (index, value) => {
    const newInputs = [...inputList];
    newInputs[index] = value;
    setInputList(newInputs);
  };

  const addInput = () => {
    setInputList([...inputList, ""]);
  };

  const handleConfirm = () => {
    const filtered = inputList.filter((item) => item.trim() !== "");
    onSelect(filtered);
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

                  <Text style={styles.subTitle}>최근 자주 먹은 음식</Text>
                  <View style={styles.foodTagContainer}>
                    {recentFoods.map((food) => (
                      <TouchableOpacity
                        key={food}
                        style={styles.foodTag}
                        onPress={() => updateInput(curInputIndex, food)}
                      >
                        <Text style={styles.foodTagText}>{food}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.subTitle}>좋아요한 음식</Text>
                  <View style={styles.foodTagContainer}>
                    {likedFoods.map((food) => (
                      <TouchableOpacity
                        key={food}
                        style={styles.foodTag}
                        onPress={() => updateInput(curInputIndex, food)}
                      >
                        <Text style={styles.foodTagText}>{food}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleConfirm}
                  >
                    <Text style={styles.confirmText}>확인</Text>
                  </TouchableOpacity>
                </ScrollView>
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
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "100%",
    paddingHorizontal: 14,
    backgroundColor: "transparent",
    height: "70%",
    marginBottom: 40,
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
  contentBox: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
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
    gap: 25,
  },
  question: {
    fontFamily: "NanumSquareRoundOTF",
    fontSize: 18,
    fontWeight: 800,
    color: Colors.point_red,
  },
  input: {
    width: "100%",
    height: 51,
    borderColor: Colors.point_red,
    borderRadius: 20,
    borderWidth: 2,
    borderRadius: 20,
    color: Colors.burn,
    fontFamily: "NanumSquareR",
    fontSize: 16,
    textAlign: "center",
    marginBottom: -13,
  },
  addButton: {
    width: "100%",
    paddingVertical: 8,
    width: 72,
    borderWidth: 1,
    borderColor: "#FF7873",
    backgroundColor: "#FFFAED",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: Colors.point_red,
    textAlign: "center",
    fontFamily: "NanumSquareOTF",
    fontSize: 18,
    fontWeight: 800,
  },
  subTitle: {
    color: Colors.slightly_burn,
    fontFamily: "NanumSquareOTF",
    fontSize: 15,
    fontWeight: 400,
    marginBottom: -13,
  },
  foodTagContainer: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  foodTag: {
    display: "flex",
    borderWidth: 0.4,
    borderColor: Colors.light_gray,
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
    color: Colors.slightly_burn,
    fontWeight: 700,
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
});
