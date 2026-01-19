// src/components/MainScreen/CategorySelector.js

import { useEffect, useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
  useWindowDimensions,
} from "react-native";
import Triangle from "../../assets/icons/dropdown.svg";
import Colors from "../../constants/colors";
import { categories } from "../../constants/data/categoryData";

const CategorySelector = ({ onSelect }) => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();

  const [isOpen, setIsOpen] = useState(false);
  const wasOpen = useRef(false);
  const [selected, setSelected] = useState([]);

  // 닫힐 때 선택된 카테고리 전달
  useEffect(() => {
    if (wasOpen.current && !isOpen) {
      onSelect(selected);
    }
    wasOpen.current = isOpen;
  }, [isOpen, onSelect, selected]);

  // 맨 처음에 랜덤으로 하나 선택
  useEffect(() => {
    if (categories && categories.length > 0) {
      const randomIndex = Math.floor(Math.random() * categories.length);
      const randomCategory = categories[randomIndex];
      setSelected([randomCategory]);
      onSelect([randomCategory]);
    }
  }, []);

  const toggleCategory = (item) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((cat) => cat !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  const displayText = useMemo(() => {
    if (selected.length === 0) return "아무거나";
    const letterCount = selected.reduce((acc, curr) => acc + curr.length, 0);
    if ((letterCount > 9 && selected.length > 1) || selected.length > 3) {
      return `${selected[0]} 외 ${selected.length - 1}개`;
    }

    return selected.join(", ");
  }, [selected]);

  return (
    <View style={styles.container}>
      {isOpen && (
        <Pressable
          style={[
            styles.overlay,
            {
              top: -SCREEN_HEIGHT,
              left: -SCREEN_WIDTH,
              width: SCREEN_WIDTH * 2,
              height: SCREEN_HEIGHT * 2,
            },
          ]}
          onPress={() => setIsOpen(false)}
        />
      )}

      <TouchableOpacity
        style={styles.dropdown}
        activeOpacity={0.8}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.selectedTextStyle} numberOfLines={1}>
          {displayText}
        </Text>

        <View style={styles.rightIconContainer}>
          <View style={styles.verticalLine} />
          <Triangle
            width={12}
            height={12}
            style={{
              transform: [
                { rotate: isOpen ? "180deg" : "0deg" },
                { translateY: isOpen ? 1.5 : 0 },
              ],
            }}
          />
        </View>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.listContainer}>
          <ScrollView
            style={styles.scrollView}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.optionsWrapper}>
              {categories.map((category) => {
                const isSelected = selected.includes(category);
                return (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.optionItem,
                      isSelected && styles.optionItemActive,
                    ]}
                    onPress={() => toggleCategory(category)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextActive,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default CategorySelector;

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
  },
  overlay: {
    position: "absolute",
    backgroundColor: "transparent",
  },
  dropdown: {
    height: 28,
    paddingHorizontal: 8,
    backgroundColor: Colors.background_yellow,
    borderRadius: 99,
    borderWidth: 1.5,
    borderColor: Colors.nurim,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  selectedTextStyle: {
    fontSize: 18,
    fontFamily: "NanumSquareRoundEB",
    color: Colors.point_red,
    letterSpacing: -0.3,
    marginRight: 4,
  },
  rightIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
  },
  verticalLine: {
    width: 1,
    height: "70%",
    backgroundColor: Colors.text_gray,
    marginRight: 5,
  },
  listContainer: {
    position: "absolute",
    left: 0,
    top: 34,
    width: 240,
    backgroundColor: Colors.background_white,
    borderRadius: 20,
    maxHeight: 200,
    borderWidth: 1.5,
    borderColor: Colors.nurim,
    overflow: "hidden",
  },
  scrollView: {
    padding: 4,
  },
  optionsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 6,
    gap: 6,
    marginBottom: 4,
  },
  optionItem: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: "#F5F5F5",
    borderWidth: 1.5,
    borderColor: "#EEE",
  },
  optionItemActive: {
    backgroundColor: Colors.nurim,
    borderColor: Colors.nurim,
  },
  optionText: {
    fontSize: 14,
    fontFamily: "NanumSquareRoundB",
    color: "#666",
  },
  optionTextActive: {
    color: Colors.background_white,
    fontFamily: "NanumSquareRoundEB",
  },
});
