import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

import { auth } from "../../services/firebase";
import { fetchLikedFoodNames } from "../../services/user";

import Colors from "../../styles/colors";
import IconBar from "./IconBar";
import TagContainer from "../TagContainer";

const FoodSelectModal = ({ onClose, onSelect, initialFoods }) => {
  const [likedFoods, setLikedFoods] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const fetchData = async () => {
      const likedFoods = await fetchLikedFoodNames(user.uid);
      setLikedFoods(likedFoods);
    };

    fetchData();
  }, []);

  const [inputList, setInputList] = useState(
    initialFoods.length === 0 ? [""] : initialFoods
  );
  const [curInputIndex, setCurInputIndex] = useState(0);

  const updateInput = (index, value) => {
    const newInputs = [...inputList];
    newInputs[index] = value;
    setInputList(newInputs);
  };

  const addInput = () => {
    setInputList([...inputList, ""]);
    setCurInputIndex(inputList.length);
  };

  const handleConfirm = () => {
    const filtered = inputList.filter((item) => item.trim() !== "");
    console.log("Selected food items:", filtered);

    if (filtered.length > 0) {
      onSelect(filtered);
    } else {
      console.log("No food items selected.");
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

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmText}>확인</Text>
          </TouchableOpacity>
        </ScrollView>
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
    borderRadius: 20,
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
});
