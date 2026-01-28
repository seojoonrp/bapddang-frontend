import { useRef, useState, useEffect, useMemo } from "react";
import { View, StyleSheet, Animated, TouchableOpacity, Pressable } from "react-native";
import Svg, { Polygon, Circle } from "react-native-svg";
import Marshmallow from "../svg/Marshmallow";
import Colors from "../../constants/colors";
import { fetchMarshmallows } from "../../services/marshmallow";
import Marsh_1_1 from "../../assets/images/marshmallows/marsh_1-1.svg";
import Marsh_1_2 from "../../assets/images/marshmallows/marsh_1-2.svg";
import Marsh_2_1 from "../../assets/images/marshmallows/marsh_2-1.svg";
import Marsh_2_2 from "../../assets/images/marshmallows/marsh_2-2.svg";
import Marsh_3_1 from "../../assets/images/marshmallows/marsh_3-1.svg";
import Marsh_3_2 from "../../assets/images/marshmallows/marsh_3-2.svg";
import Marsh_4_1 from "../../assets/images/marshmallows/marsh_4-1.svg";
import Marsh_4_2 from "../../assets/images/marshmallows/marsh_4-2.svg";
import Marsh_5 from "../../assets/images/marshmallows/marsh_5.svg";
const ITEM_HEIGHT = 160;
const MARSHMALLOW_SIZE = 160;

const TARGET_VIEW_RATIO = 0.45;
const FIXED_TOP_PADDING = 300;
const FIXED_BOTTOM_PADDING = 250;

const MarshmallowStick = ({ onClick }) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const listRef = useRef(null);
  const [listHeight, setListHeight] = useState(0);
  const [marshmallows, setMarshmallows] = useState([]);
  const variantCacheRef = useRef(new Map());

  const bottomPadding = useMemo(() => {
    if (listHeight <= 0) return 200;
    // (리스트 높이 * (1 - 타겟비율)) - (아이템 절반)
    return listHeight * (1 - TARGET_VIEW_RATIO) - (ITEM_HEIGHT / 2);
  }, [listHeight]);

  const pickVariantOnce = (key) => {
    if (!variantCacheRef.current.has(key)) {
      variantCacheRef.current.set(key, Math.random() < 0.5 ? 0 : 1);
    }
    return variantCacheRef.current.get(key); // 0 or 1
  };

  const getMarshmallowSvgByStatus = (item) => {
    const { status, id } = item;
    const key = `${id}:s${status}`; // 주차(id)별 + status별로 독립 랜덤

    switch (status) {
      case 0: {
        const v = pickVariantOnce(key);
        return v === 0 ? Marsh_4_1 : Marsh_4_2; // 잠김 전용 svg 있으면 여기만 바꾸면 됨
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
      case -1: { // 리뷰 완료
        const v = pickVariantOnce(key);
        //console.log("pickVariantOnce for -1 status:", v);
        return v === 0 ? Marsh_4_1 : Marsh_4_2;
      }
      case -2: return Marsh_5;
      default:
        return Marshmallow;
    }
  };
  const DEBUG_STICK = true;
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const data = await fetchMarshmallows();
        const sorted = [...(data ?? [])].sort((a, b) => {
          const aw = Number(a.week ?? a.weekIndex ?? a.weekNumber ?? NaN);
          const bw = Number(b.week ?? b.weekIndex ?? b.weekNumber ?? NaN);


          if (Number.isFinite(aw) && Number.isFinite(bw)) return bw - aw;


          return Number(b.id) - Number(a.id);
        });
        if (mounted) setMarshmallows(sorted);
        console.log("render marshmallows length:", marshmallows.length);
      }
      catch (e) {
        console.log("Error fetching marshmallows:", e);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const stickHeight = useMemo(
    () => ITEM_HEIGHT * marshmallows.length + 200,
    [marshmallows.length]
  );

  const scrollToIndexCustom = (index) => {
    if (!listRef.current || listHeight <= 0) return;

    // 1. 목표 위치 계산
    const itemCenterY = index * ITEM_HEIGHT + ITEM_HEIGHT / 2;
    const screenTargetY = listHeight * TARGET_VIEW_RATIO;
    let targetOffset = itemCenterY - screenTargetY + FIXED_TOP_PADDING;


    const contentHeight = (ITEM_HEIGHT * marshmallows.length) + FIXED_TOP_PADDING + FIXED_BOTTOM_PADDING;
    const maxOffset = contentHeight - listHeight;

    const finalOffset = Math.max(0, Math.min(targetOffset, maxOffset));

    listRef.current.scrollToOffset({
      offset: finalOffset,
      animated: true,
    });
  };
  // 막대기 만들기
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
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Animated.View
        style={[
          styles.stick,
          {
            height: stickHeight,
            // SVG를 담기 위해 너비를 넉넉하게 잡습니다.
            width: CANVAS_WIDTH,
            top: FIXED_TOP_PADDING - 80,
            transform: [
              {
                translateY: Animated.multiply(scrollY, -1)
              },
            ],
          },
        ]}
      >
        {/* ✅ 기존의 backgroundColor View 대신 SVG 사용 */}
        <Svg height={stickHeight} width={CANVAS_WIDTH}>
          <Circle 
            cx={CANVAS_WIDTH / 2} 
            cy={RADIUS} 
            r={RADIUS} 
            fill={Colors.burn} 
          />
          <Polygon
            points={stickPoints}
            fill={Colors.burn} // 꼬치 색상
          />
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
        decelerationRate="fast"
        snapToAlignment="center"
        contentContainerStyle={{
          paddingHorizontal: 100,
          paddingTop: FIXED_TOP_PADDING,
          paddingBottom: FIXED_BOTTOM_PADDING,
        }}

        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false } // layout 속성 의존 시 false, 단순 transform이면 true 권장되나 현재 구조상 false 유지
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
