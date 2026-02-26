import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
  useWindowDimensions,
} from "react-native";
import ChevronIcon from "../../assets/icons/chevron.svg";
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

const textOptions = ["최신 순으로", "오래된 순으로", "이름 순으로"];

const SortSelector = ({ onSelect }) => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(0);

  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  const wasOpen = useRef(false);

  useEffect(() => {
    if (wasOpen.current && !isOpen) {
      onSelect(selectedRef.current);
    }
    wasOpen.current = isOpen;
  }, [isOpen]);

  const selectSortOption = (option) => {
    setSelected(option);
  };

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isOpen ? 1 : 0, { duration: 300 }),
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
        <TouchableOpacity
          style={styles.dropdown}
          activeOpacity={0.8}
          onPress={() => setIsOpen(!isOpen)}
        >
          <Text style={styles.selectedTextStyle} numberOfLines={1}>
            정렬
          </Text>

          <View style={styles.rightIconContainer}>
            <ChevronIcon width={18} height={18} color={Colors.nurim} />
          </View>
        </TouchableOpacity>
      </View>

      {isOpen && (
        <Animated.View
          entering={FadeInUp.duration(300).easing(Easing.out(Easing.quad))}
          exiting={FadeOutUp.duration(300)}
          style={styles.listContainer}
        >
          {textOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionItem,
                selected === index && styles.optionItemActive,
              ]}
              onPress={() => selectSortOption(index)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionText,
                  selected === index && styles.optionTextActive,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
    </View>
  );
};

export default SortSelector;

const styles = StyleSheet.create({
  container: {
    marginLeft: 6,
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
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 99,
    borderWidth: 1.5,
    borderColor: Colors.nurim,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: "NanumSquareB",
    color: Colors.nurim,
    letterSpacing: 0.6,
  },
  rightIconContainer: {
    transform: [{ rotate: "270deg" }],
    marginLeft: 2,
    marginRight: -2,
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
    top: 38,
    width: 180,
    backgroundColor: Colors.background_white,
    borderRadius: 20,
    maxHeight: 240,
    borderWidth: 3,
    borderColor: Colors.background_yellow,
    padding: 4,
    zIndex: 501,
    boxShadow: "0 4px 6px 2px rgba(0, 0, 0, 0.15)",
  },
  optionItem: {
    display: "flex",
    borderColor: Colors.light_gray,
    backgroundColor: "white",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  optionItemActive: {
    backgroundColor: Colors.light_text_gray,
  },
  optionText: {
    fontSize: 16,
    fontFamily: "NanumSquareB",
    color: Colors.nurim,
    letterSpacing: 0.6,
  },
  divider: {
    height: 1.5,
    backgroundColor: Colors.light_text_gray,
    marginHorizontal: 24,
    marginVertical: 4,
  },
});
