import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated as RNAnimated,
  TouchableOpacity,
} from "react-native";
import Svg, { Polygon, Circle } from "react-native-svg";
import Colors from "../../constants/colors";
import Marsh_1_1 from "../../assets/images/marshmallows/marsh_1-1.svg";
import Marsh_1_2 from "../../assets/images/marshmallows/marsh_1-2.svg";
import Marsh_2_1 from "../../assets/images/marshmallows/marsh_2-1.svg";
import Marsh_2_2 from "../../assets/images/marshmallows/marsh_2-2.svg";
import Marsh_3_1 from "../../assets/images/marshmallows/marsh_3-1.svg";
import Marsh_3_2 from "../../assets/images/marshmallows/marsh_3-2.svg";
import Marsh_4_1 from "../../assets/images/marshmallows/marsh_4-1.svg";
import Marsh_4_2 from "../../assets/images/marshmallows/marsh_4-2.svg";
import QuestionMarshmallow from "../common/QuestionMarshmallow";
import TextBubbleMarshmallow from "../../assets/images/textbubble-marshmallow.svg";
import { useMarshmallowStore } from "../../stores/marshmallowStore";
import { useAuthStore } from "../../stores/authStore";
import Animated, {
  Easing,
  SlideInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";

const ITEM_HEIGHT = 160;
const MARSHMALLOW_SIZE = 160;
const SELECTED_SCALE = 0.8;
const SELECTED_TRANSLATE_X = -28;
const BUBBLE_WIDTH = 120;
const BUBBLE_HEIGHT = 118;
const ANIMATION_DURATION = 400;

const TARGET_VIEW_RATIO = 0.45;
const FIXED_TOP_PADDING = 300;
const FIXED_BOTTOM_PADDING_MIN = 250;

const SPRING_CONFIG = { damping: 14, stiffness: 120, mass: 1 };

const MarshmallowItem = ({
  SvgComp,
  isSelected,
  onPress,
  zIndex,
  item,
  weekText,
}) => {
  const scale = useSharedValue(isSelected ? SELECTED_SCALE : 1);
  const translateX = useSharedValue(isSelected ? SELECTED_TRANSLATE_X : 0);
  const bubbleScale = useSharedValue(isSelected ? 1 : 0);
  const bubbleTranslateX = useSharedValue(isSelected ? 0 : -BUBBLE_WIDTH / 2);
  const bubbleOpacity = useSharedValue(isSelected ? 1 : 0);

  useEffect(() => {
    const timingConfig = {
      duration: ANIMATION_DURATION,
      easing: Easing.out(Easing.quad),
    };
    if (isSelected) {
      scale.value = withTiming(SELECTED_SCALE, timingConfig);
      translateX.value = withTiming(SELECTED_TRANSLATE_X, timingConfig);
      bubbleOpacity.value = withTiming(1, { duration: 200 });
      bubbleScale.value = withSpring(1, SPRING_CONFIG);
      bubbleTranslateX.value = withSpring(0, SPRING_CONFIG);
    } else {
      scale.value = withTiming(1, timingConfig);
      translateX.value = withTiming(0, timingConfig);
      bubbleOpacity.value = withTiming(0, { duration: 150 });
      bubbleScale.value = withTiming(0, { duration: 200 });
      bubbleTranslateX.value = withTiming(-BUBBLE_WIDTH / 2, { duration: 200 });
    }
  }, [isSelected]);

  const animatedMarshmallow = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
  }));

  const animatedBubble = useAnimatedStyle(() => ({
    opacity: bubbleOpacity.value,
    transform: [
      { translateX: bubbleTranslateX.value },
      { scaleX: bubbleScale.value },
      { scaleY: bubbleScale.value },
    ],
  }));

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={{
        height: ITEM_HEIGHT,
        justifyContent: "center",
        alignItems: "center",
        zIndex,
        elevation: zIndex,
      }}
    >
      <View style={styles.marshmallowRow}>
        <Animated.View style={animatedMarshmallow}>
          <SvgComp width={MARSHMALLOW_SIZE} height={MARSHMALLOW_SIZE} />
        </Animated.View>
        <Animated.View style={[styles.bubbleContainer, animatedBubble]}>
          <TextBubbleMarshmallow width={BUBBLE_WIDTH} height={BUBBLE_HEIGHT} />
          <View style={styles.bubbleContent}>
            <View style={styles.weekBadge}>
              <Text style={styles.weekBadgeText}>{weekText}</Text>
            </View>
            <Text style={styles.bubbleLabel}>남긴 기록 수</Text>
            <Text style={styles.bubbleValue}>{item?.reviewCount ?? 0}개</Text>
            <Text style={styles.bubbleLabel}>평균 별점</Text>
            <Text style={styles.bubbleValue}>
              {item?.reviewCount > 0
                ? (item.totalRating / item.reviewCount).toFixed(1)
                : "-"}
            </Text>
          </View>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const MarshmallowStick = ({ onClick }) => {
  const scrollY = useRef(new RNAnimated.Value(0)).current;
  const listRef = useRef(null);
  const [listHeight, setListHeight] = useState(0);
  const variantCacheRef = useRef(new Map());
  const isTapScrollRef = useRef(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const marshmallows = useMarshmallowStore((state) => state.marshmallows);
  const { fetchMarshmallowsFromStore } = useMarshmallowStore();
  const user = useAuthStore((state) => state.user);

  const getWeekText = useCallback(
    (itemWeek) => {
      if (!user?.createdAt || !itemWeek) return "";
      const startDate = new Date(user.createdAt);
      startDate.setDate(startDate.getDate() + (itemWeek - 1) * 7);
      const month = startDate.getMonth() + 1;
      const y = startDate.getFullYear();
      const m = startDate.getMonth();
      const firstOfMonth = new Date(y, m, 1);
      const firstDowMon0 = (firstOfMonth.getDay() + 6) % 7;
      const weekOfMonth =
        Math.floor((firstDowMon0 + (startDate.getDate() - 1)) / 7) + 1;
      return `${month}월 ${weekOfMonth}주차`;
    },
    [user?.createdAt],
  );

  const bottomPadding = useMemo(() => {
    if (listHeight <= 0) return FIXED_BOTTOM_PADDING_MIN;
    return Math.max(
      FIXED_BOTTOM_PADDING_MIN,
      listHeight * (1 - TARGET_VIEW_RATIO) - ITEM_HEIGHT / 2,
    );
  }, [listHeight]);

  const pickVariantOnce = (key) => {
    if (!variantCacheRef.current.has(key)) {
      variantCacheRef.current.set(key, Math.random() < 0.5 ? 0 : 1);
    }
    return variantCacheRef.current.get(key);
  };

  const getMarshmallowSvgByStatus = (item) => {
    const { status, id } = item;
    const key = `${id}:s${status}`;

    switch (status) {
      case 0: {
        const v = pickVariantOnce(key);
        return v === 0 ? Marsh_4_1 : Marsh_4_2;
      }
      case 1: {
        const v = pickVariantOnce(key);
        return v === 0 ? Marsh_1_1 : Marsh_1_2;
      }
      case 2: {
        const v = pickVariantOnce(key);
        return v === 0 ? Marsh_2_1 : Marsh_2_2;
      }
      case 3: {
        const v = pickVariantOnce(key);
        return v === 0 ? Marsh_3_1 : Marsh_3_2;
      }
      case -1: {
        const v = pickVariantOnce(key);
        return v === 0 ? Marsh_4_1 : Marsh_4_2;
      }
      case -2:
        return QuestionMarshmallow;
      default:
        return Marsh_1_1;
    }
  };

  useEffect(() => {
    if (marshmallows.length === 0) {
      fetchMarshmallowsFromStore();
    }
  }, []);

  const stickHeight = useMemo(
    () => ITEM_HEIGHT * marshmallows.length + FIXED_TOP_PADDING + bottomPadding,
    [marshmallows.length, bottomPadding],
  );

  const scrollToIndexCustom = (index) => {
    if (!listRef.current || listHeight <= 0) return;

    isTapScrollRef.current = true;

    const itemCenterY = index * ITEM_HEIGHT + ITEM_HEIGHT / 2;
    const screenTargetY = listHeight * TARGET_VIEW_RATIO;
    let targetOffset = itemCenterY - screenTargetY + FIXED_TOP_PADDING;

    const contentHeight =
      ITEM_HEIGHT * marshmallows.length + FIXED_TOP_PADDING + bottomPadding;
    const maxOffset = contentHeight - listHeight;

    const finalOffset = Math.max(0, Math.min(targetOffset, maxOffset));

    listRef.current.scrollToOffset({
      offset: finalOffset,
      animated: true,
    });
  };

  const STICK_TOP_WIDTH = 3;
  const STICK_BOTTOM_WIDTH = 25;
  const CANVAS_WIDTH = 20;
  const RADIUS = STICK_TOP_WIDTH / 2;

  const stickPoints = useMemo(() => {
    const cx = CANVAS_WIDTH / 2;
    return `
      ${cx - STICK_TOP_WIDTH / 2},${RADIUS}
      ${cx + STICK_TOP_WIDTH / 2},${RADIUS}
      ${cx + STICK_BOTTOM_WIDTH / 2},${stickHeight}
      ${cx - STICK_BOTTOM_WIDTH / 2},${stickHeight}
    `;
  }, [stickHeight]);

  const handleItemPress = useCallback(
    (index, item) => {
      if (item.status === -2) return;

      setSelectedIndex((prev) => (prev === index ? null : index));
      scrollToIndexCustom(index);
      onClick?.(index);
    },
    [onClick, listHeight, marshmallows.length, bottomPadding],
  );

  const handleMomentumScrollEnd = (event) => {
    if (isTapScrollRef.current) {
      isTapScrollRef.current = false;
      return;
    }

    const offsetY = event.nativeEvent.contentOffset.y;
    const viewportTargetY = offsetY + listHeight * TARGET_VIEW_RATIO;
    const index = Math.round(
      (viewportTargetY - FIXED_TOP_PADDING - ITEM_HEIGHT / 2) / ITEM_HEIGHT,
    );
    const clampedIndex = Math.max(0, Math.min(index, marshmallows.length - 1));

    onClick?.(clampedIndex);
  };

  if (marshmallows.length === 0) return null;

  return (
    <Animated.View
      entering={SlideInDown.duration(700).easing(Easing.bezier(0, 0.8, 0.2, 1))}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <RNAnimated.View
        style={[
          styles.stick,
          {
            height: stickHeight,
            width: CANVAS_WIDTH,
            top: FIXED_TOP_PADDING - 80,
            transform: [
              {
                translateY: RNAnimated.multiply(scrollY, -1),
              },
            ],
          },
        ]}
      >
        <Svg height={stickHeight} width={CANVAS_WIDTH}>
          <Circle
            cx={CANVAS_WIDTH / 2}
            cy={RADIUS}
            r={RADIUS}
            fill={Colors.burn}
          />
          <Polygon points={stickPoints} fill={Colors.burn} />
        </Svg>
      </RNAnimated.View>

      <RNAnimated.FlatList
        ref={listRef}
        onLayout={(e) => setListHeight(e.nativeEvent.layout.height)}
        style={styles.listContainer}
        data={marshmallows}
        keyExtractor={(item) => item.id.toString()}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        renderItem={({ item, index }) => {
          const SvgComp = getMarshmallowSvgByStatus(item);
          return (
            <MarshmallowItem
              SvgComp={SvgComp}
              isSelected={selectedIndex === index}
              onPress={() => handleItemPress(index, item)}
              zIndex={marshmallows.length - index}
              item={item}
              weekText={getWeekText(item.week)}
            />
          );
        }}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate={0.9}
        snapToAlignment="center"
        onMomentumScrollEnd={handleMomentumScrollEnd}
        contentContainerStyle={{
          paddingHorizontal: 100,
          paddingTop: FIXED_TOP_PADDING,
          paddingBottom: bottomPadding,
        }}
        onScroll={RNAnimated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
      />
    </Animated.View>
  );
};

export default MarshmallowStick;

const styles = StyleSheet.create({
  listContainer: {
    marginTop: 0,
    width: "100%",
  },
  stick: {
    position: "absolute",
  },
  marshmallowRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bubbleContainer: {
    position: "absolute",
    right: -BUBBLE_WIDTH + 42,
    top: (MARSHMALLOW_SIZE - BUBBLE_HEIGHT) / 2 - 12,
  },
  bubbleContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 6,
    paddingLeft: 25,
    paddingRight: 6,
    gap: 3,
  },
  weekBadge: {
    width: "100%",
    backgroundColor: Colors.point_red,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  weekBadgeText: {
    color: Colors.background_white,
    fontFamily: "NanumSquareRoundEB",
    fontSize: 14,
    letterSpacing: -0.3,
  },
  bubbleLabel: {
    color: Colors.slightly_burn,
    fontFamily: "NanumSquareRoundB",
    fontSize: 12,
    marginTop: 2,
    marginLeft: 8,
    letterSpacing: -0.3,
  },
  bubbleValue: {
    color: Colors.burn,
    fontFamily: "NanumSquareRoundB",
    fontSize: 16,
    letterSpacing: -0.3,
    marginLeft: 8,
  },
});
