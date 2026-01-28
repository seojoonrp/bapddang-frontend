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
import ResetIcon from "../../assets/icons/refresh.svg";
import Colors from "../../constants/colors";
import { categoryGroups } from "../../constants/data/categoryData";
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
  FadeInUp,
  FadeOutUp,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CategorySelector = ({ onSelect }) => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState([]);

  const selectedRef = useRef(selected);
  const wasOpen = useRef(false);

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  useEffect(() => {
    if (wasOpen.current && !isOpen) {
      onSelect(selectedRef.current);
    }
    wasOpen.current = isOpen;
  }, [isOpen, onSelect]);

  const toggleCategory = (item) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((cat) => cat !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  const resetCategories = () => {
    setSelected([]);
  };

  const displayText = useMemo(() => {
    if (selected.length === 0) return "아무거나";
    const letterCount = selected.reduce((acc, curr) => acc + curr.length, 0);
    if ((letterCount > 9 && selected.length > 1) || selected.length > 3) {
      return `${selected[0]} 외 ${selected.length - 1}개`;
    }

    return selected.join(", ");
  }, [selected]);

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isOpen ? 1 : 0, { duration: 300 }),
  }));
  const animatedArrowStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: withTiming(isOpen ? "0deg" : "180deg", {
          duration: 300,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
      },
      {
        translateY: withTiming(isOpen ? 0 : 1.5, {
          duration: 300,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
      },
    ],
  }));
  const animatedDropdownShadowStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isOpen ? 0 : 1, { duration: 300 }),
  }));

  return (
    <View style={styles.container}>
      <AnimatedPressable
        pointerEvents={isOpen ? "auto" : "none"}
        style={[
          styles.overlay,
          {
            top: -SCREEN_HEIGHT,
            left: -SCREEN_WIDTH,
            width: SCREEN_WIDTH * 2,
            height: SCREEN_HEIGHT * 2,
          },
          animatedOverlayStyle,
        ]}
        onPress={() => setIsOpen(false)}
      />

      <View style={styles.dropdownRow}>
        <View>
          <Animated.View
            style={[styles.dropdownShadow, animatedDropdownShadowStyle]}
          />
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
              <Animated.View style={animatedArrowStyle}>
                <Triangle width={12} height={12} />
              </Animated.View>
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.questionText}>중에서 골라볼까요?</Text>
      </View>

      {isOpen && (
        <Animated.View
          entering={FadeInUp.duration(300).easing(Easing.out(Easing.quad))}
          exiting={FadeOutUp.duration(300)}
          style={styles.listContainer}
        >
          <ScrollView
            style={styles.scrollView}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 4 }}
          >
            {categoryGroups.map((group, index) => (
              <View key={group.id}>
                <View style={styles.optionsWrapper}>
                  {group.items.map((category) => {
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

                {index < categoryGroups.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.resetContainer}
            onPress={resetCategories}
            activeOpacity={0.7}
          >
            <ResetIcon width={20} height={20} />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

export default CategorySelector;

const styles = StyleSheet.create({
  container: {
    marginLeft: 22,
    zIndex: 1000,
  },
  overlay: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.2)",
    zIndex: 500,
  },
  dropdownRow: {
    flexDirection: "row",
    alignItems: "center",
    zIndex: 502,
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
  dropdownShadow: {
    position: "absolute",
    top: 2,
    width: "100%",
    height: "100%",
    borderRadius: 99,
    backgroundColor: "#FDEDC0",
    zIndex: -1,
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
  questionText: {
    marginLeft: 6,
    fontSize: 17,
    fontFamily: "NanumSquareRoundEB",
    color: Colors.burn,
  },
  listContainer: {
    position: "absolute",
    left: 0,
    top: 36,
    width: 270,
    backgroundColor: Colors.background_white,
    borderRadius: 20,
    maxHeight: 240,
    borderWidth: 3,
    borderColor: Colors.background_yellow,
    padding: 4,
    zIndex: 501,
    boxShadow: "0 4px 6px 2px rgba(0, 0, 0, 0.15)",
  },
  scrollView: {
    borderRadius: 16,
    borderColor: Colors.light_text_gray,
    borderWidth: 1,
    padding: 4,
  },
  optionsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 6,
    gap: 6,
  },
  optionItem: {
    display: "flex",
    borderWidth: 0.4,
    borderColor: Colors.light_gray,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    boxShadow: "0px -2px 4px 0px #A94946 inset, 0px -2px 6px 2px #FDEDC0 inset",
  },
  optionItemActive: {
    backgroundColor: Colors.nurim,
    borderColor: Colors.nurim,
    boxShadow: "",
  },
  optionText: {
    fontSize: 16,
    fontFamily: "NanumSquareEB",
    color: Colors.slightly_burn,
  },
  optionTextActive: {
    color: Colors.background_yellow,
  },
  divider: {
    height: 1.5,
    backgroundColor: Colors.light_text_gray,
    marginHorizontal: 24,
    marginVertical: 4,
  },
  resetContainer: {
    position: "absolute",
    top: -2,
    right: -44,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background_white,
    borderColor: Colors.background_yellow,
    borderWidth: 3,
    borderRadius: 99,
  },
});
