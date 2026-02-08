import { useRef, useState, useEffect, useMemo } from "react";
import { View, StyleSheet, Animated, TouchableOpacity } from "react-native";
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
import { useMarshmallowStore } from "../../stores/marshmallowStore";

const ITEM_HEIGHT = 160;
const MARSHMALLOW_SIZE = 160;

const TARGET_VIEW_RATIO = 0.45;
const FIXED_TOP_PADDING = 300;
const FIXED_BOTTOM_PADDING = 250;

const MarshmallowStick = ({ onClick }) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const listRef = useRef(null);
  const [listHeight, setListHeight] = useState(0);
  const variantCacheRef = useRef(new Map());

  const marshmallows = useMarshmallowStore((state) => state.marshmallows);
  const { fetchMarshmallowsFromStore } = useMarshmallowStore();

  const bottomPadding = useMemo(() => {
    if (listHeight <= 0) return 200;
    return listHeight * (1 - TARGET_VIEW_RATIO) - ITEM_HEIGHT / 2;
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
    () => ITEM_HEIGHT * marshmallows.length + 500,
    [marshmallows.length],
  );

  const scrollToIndexCustom = (index) => {
    if (!listRef.current || listHeight <= 0) return;

    const itemCenterY = index * ITEM_HEIGHT + ITEM_HEIGHT / 2;
    const screenTargetY = listHeight * TARGET_VIEW_RATIO;
    let targetOffset = itemCenterY - screenTargetY + FIXED_TOP_PADDING;

    const contentHeight =
      ITEM_HEIGHT * marshmallows.length +
      FIXED_TOP_PADDING +
      FIXED_BOTTOM_PADDING;
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

  const handleMomentumScrollEnd = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);

    if (index >= 0 && index < marshmallows.length) {
      onClick?.(index);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Animated.View
        style={[
          styles.stick,
          {
            height: stickHeight,
            width: CANVAS_WIDTH,
            top: FIXED_TOP_PADDING - 80,
            transform: [
              {
                translateY: Animated.multiply(scrollY, -1),
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
      </Animated.View>

      <Animated.FlatList
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
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                scrollToIndexCustom(index);
                onClick?.(index);
              }}
              style={{
                height: ITEM_HEIGHT,
                justifyContent: "center",
                alignItems: "center",
                zIndex: marshmallows.length - index,
                elevation: marshmallows.length - index,
              }}
            >
              <SvgComp width={MARSHMALLOW_SIZE} height={MARSHMALLOW_SIZE} />
            </TouchableOpacity>
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
          paddingBottom: FIXED_BOTTOM_PADDING,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
      />
    </View>
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
});
