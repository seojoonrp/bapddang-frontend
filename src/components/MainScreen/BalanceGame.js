import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";

import Colors from "../../styles/colors";

import { fetchMainFeedFoods } from "../../services/food";

const BalanceGame = () => {
  // const [selectedFoods, setSelectedFoods] = useState([]);
  // const [disabled, setDisabled] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  // const question = "부장님이 퇴근 10분 전 추가업무\n야밤에 퇴근할 때, 야식은?";
  // useEffect(() => {
  //   const loadAndSelectFoods = async () => {
  //     try {
  //       setIsLoading(true);
  //       const allFoods = (await fetchMainFeedFoods()) || [];
  //       if (allFoods && allFoods.length >= 2) {
  //         const shuffled = [...allFoods].sort(() => 0.5 - Math.random());
  //         setSelectedFoods(shuffled.slice(0, 2));
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch foods for BalanceGame:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   loadAndSelectFoods();
  // }, []);
  // const OnFoodSelect = (food) => {
  //   console.log("선택된 음식:", food.name);
  //   setDisabled(true);
  // };
  // if (isLoading) {
  //   return (
  //     <View style={styles.container}>
  //       <Text>밸런스 게임을 불러오는 중...</Text>
  //     </View>
  //   );
  // }
  // if (selectedFoods.length < 2) {
  //   return (
  //     <View style={styles.container}>
  //       <Text>밸런스 게임을 위한 음식이 부족합니다.</Text>
  //     </View>
  //   );
  // }
  // return (
  //   <View style={styles.container}>
  //     {!disabled ? (
  //       <>
  //         <Text style={styles.balanceGameText}>밸런스게임</Text>
  //         <Text style={styles.questionText}>{question}</Text>
  //         <View style={styles.choiceContainer}>
  //           <TouchableOpacity
  //             style={styles.choiceButton}
  //             onPress={() => OnFoodSelect(selectedFoods[0])}
  //           >
  //             <Image
  //               source={{ uri: selectedFoods[0].imageUrl }}
  //               style={styles.foodImage}
  //               resizeMode="cover"
  //             />
  //             <Text style={styles.choiceText}>{selectedFoods[0].name}</Text>
  //           </TouchableOpacity>
  //           <TouchableOpacity
  //             style={styles.choiceButton}
  //             onPress={() => OnFoodSelect(selectedFoods[1])}
  //           >
  //             <Image
  //               source={{ uri: selectedFoods[1].imageUrl }}
  //               style={styles.foodImage}
  //               resizeMode="cover"
  //             />
  //             <Text style={styles.choiceText}>{selectedFoods[1].name}</Text>
  //           </TouchableOpacity>
  //         </View>
  //         <Text style={styles.curPlayerText}>
  //           1928명이 참여중, 4시간 남았어요!
  //         </Text>
  //       </>
  //     ) : (
  //       <>
  //         <Text style={styles.disabledText}>
  //           오늘의 밸런스 게임을{"\n"}이미 진행하셨습니다!
  //         </Text>
  //         <Text>어쩌고저쩌고</Text>
  //         <TouchableOpacity
  //           onPress={() => setDisabled(false)}
  //           style={{ borderColor: "black", borderWidth: 1, padding: 8 }}
  //         >
  //           <Text>다시하기 (디버깅용)</Text>
  //         </TouchableOpacity>
  //       </>
  //     )}
  //   </View>
  // );
  return (
    <View style={styles.container}>
      <Text>밸런스 게임은 현재 준비중입니다!</Text>
    </View>
  );
};

export default BalanceGame;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 250,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    gap: 8,
    backgroundColor: Colors.bg_white,
    borderColor: "#A87C66",
    borderWidth: 1.5,
    borderRadius: 16,
    boxShadow: "0 4px 0 2px #FDEDC0",
  },
  balanceGameText: {
    color: Colors.slightly_burn,
    fontFamily: "NanumSquareB",
    fontSize: 16,
  },
  questionText: {
    textAlign: "center",
    color: Colors.pressed_button,
    fontFamily: "NanumSquareEB",
    fontSize: 24,
  },
  choiceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  choiceButton: {
    position: "relative",
    width: "49%",
    height: 130,
    justifyContent: "center",
    backgroundColor: Colors.burn,
    borderRadius: 8,
    borderColor: "#A87C66",
    borderWidth: 1.5,
    overflow: "hidden",
  },
  foodImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  choiceText: {
    textAlign: "center",
    color: Colors.bg_white,
    fontFamily: "NanumSquareB",
    fontSize: 16,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  },
  curPlayerText: {
    width: "100%",
    alignSelf: "flex-end",
    textAlign: "right",
    marginTop: 4,
    marginRight: 4,
    color: Colors.text_gray,
    fontFamily: "NanumSquareB",
    fontSize: 12,
  },
  disabledText: {
    textAlign: "center",
    color: Colors.burn,
    fontFamily: "NanumSquareEB",
    fontSize: 20,
  },
});
