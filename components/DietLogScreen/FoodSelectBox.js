import React from "react";
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

const { width } = Dimensions.get("window");

const recentFoods = ["로제떡볶이", "삼계탕", "마라상궈", "고추바사삭", "라면"];

const FoodSelectBox = ({ visible, onClose, onSelect, inputValue, setInputValue }) => {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.question}>어떤 음식을 먹었나요?</Text>
              <TextInput
                style={styles.input}
                placeholder="음식 이름을 입력해주세요"
                value={inputValue}
                onChangeText={setInputValue}
              />

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
    borderRadius: 20,
    padding: 24,
    width: width - 48,
    alignItems: "center",
  },
  question: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5B1E1E",
    marginBottom: 18,
  },
  input: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 15,
    marginBottom: 20,
  },
  subTitle: {
    color: "#8C5B5B",
    fontSize: 14,
    marginBottom: 8,
  },
  foodTagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 24,
  },
  foodTag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    margin: 6,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 0.5,
    borderColor: "#D9D9D9",
    shadowColor: "#A94946",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  foodTagText: {
    color: "#5B1E1E",
    fontWeight: "500",
  },
  confirmButton: {
    marginTop: 10,
    width: 120,
    height: 44,
    backgroundColor: "#E90C05",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
