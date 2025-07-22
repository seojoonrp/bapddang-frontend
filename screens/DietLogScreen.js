import { useEffect, useRef, useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import Colors from "../styles/colors";
import MarshmallowStick from "../components/DietLogScreen/MarshmallowStick";
import FoodSelectBox from "../components/DietLogScreen/FoodSelectBox";
import ReviewBox from "../components/ReviewBox";

const DietLogScreen = () => {
  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => [660], []);
  const [inputValue, setInputValue] = useState("");
  const [isFoodSelectVisible, setIsFoodSelectVisible] = useState(false);
  const [isReviewVisible, setIsReviewVisible] = useState(false);
  const [selectedFoodItem, setSelectedFoodItem] = useState(null);
  const sheetPosition = useSharedValue(0);
  const animatedTextStyle = useAnimatedStyle(() => {
    const fontSize = interpolate(
      sheetPosition.value,
      [0, 1],
      [30, 40],
      "clamp"
    );
    return {
      fontSize,
    };
  });

  // 나중에 초기값 받아와서 설정 필요
  const [selectedDay, setSelectedDay] = useState(1);

  return (
    <LinearGradient colors={["#FFFFFF", "#CCCCCC"]} style={styles.container}>
      <MarshmallowStick />
      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        handleComponent={() => null}
        onAnimate={(fromIndex, toIndex) => {
          sheetPosition.value = withTiming(toIndex, {
            duration: 500,
            easing: Easing.out(Easing.exp),
          });
        }}
        backgroundComponent={() => (
          <View style={{ backgroundColor: "transparent" }} />
        )}
      >
        <BottomSheetView style={styles.sheetContainer}>
          <View style={styles.innerSheetContainer}>
            <View style={styles.sheetIndicator} />

            <Animated.Text style={[styles.sheetTitleText, animatedTextStyle]}>
              주간 식단기록
            </Animated.Text>

            <TouchableOpacity
              onPress={() => setIsFoodSelectVisible(true)}
              style={styles.addButton}
            >
              <Text style={{ color: "black" }}>추가</Text>
            </TouchableOpacity>
            {isFoodSelectVisible && (
              <FoodSelectBox
                visible={isFoodSelectVisible}
                onClose={() => setIsFoodSelectVisible(false)}
                onSelect={(foodName) => {
                  setIsFoodSelectVisible(false);
                  setSelectedFoodItem({ name: foodName });
                  setIsReviewVisible(true);
                }}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
            )}

            {isReviewVisible && (
              <ReviewBox
                visible={isReviewVisible}
                onClose={() => setIsReviewVisible(false)}
                item={selectedFoodItem}
                mode="fast"
              />
            )}
            <View style={styles.dayContainer}>
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <TouchableOpacity
                  key={num}
                  onPress={() => setSelectedDay(num)}
                  activeOpacity={1}
                  style={[
                    styles.dayButton,
                    selectedDay === num && { backgroundColor: "#521210" },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      selectedDay === num && { color: "white" },
                    ]}
                  >
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </LinearGradient>
  );
};

export default DietLogScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#F5F4F2",
  },
  sheetContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    height: 260,
  },
  innerSheetContainer: {
    width: "100%",
    height: 1000,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 12,

    backgroundColor: "white",
    borderRadius: 40,
  },
  sheetIndicator: {
    width: 144,
    height: 5,
    marginTop: 12,

    backgroundColor: "#D9D9D9",
    borderRadius: 2.5,
  },
  sheetTitleText: {
    marginTop: 20,
    fontFamily: "NanumSquareEB",
    color: Colors.burn,
  },
  dayContainer: {
    marginTop: 43,
    width: "100%",
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    borderColor: "#D9D9D9",
    borderWidth: 1,
    borderRadius: 13,
  },
  dayButton: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 0,

    borderRadius: 21,
  },
  dayText: {
    color: Colors.burn,
    fontSize: 36,
    fontFamily: "NanumSquareB",
    marginTop: 2,
  },
});
