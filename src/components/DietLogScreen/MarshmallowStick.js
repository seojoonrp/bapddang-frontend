import { useRef, useState, useEffect, useMemo } from "react";
import { View, StyleSheet, Animated, TouchableOpacity } from "react-native";

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
const ITEM_HEIGHT = 150;
const MARSHMALLOW_SIZE = 160;

const MarshmallowStick = ({ onClick }) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [marshmallows, setMarshmallows] = useState([]);
  const variantCacheRef = useRef(new Map());

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
      case -2: { // 잠김
        const v = pickVariantOnce(key);
        return v === 0 ? Marsh_4_1 : Marsh_4_2; // 잠김 전용 svg 있으면 여기만 바꾸면 됨
      }
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
        if (mounted) setMarshmallows(data);
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
    () => ITEM_HEIGHT * marshmallows.length + 100,
    [marshmallows.length]
  );

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Animated.View
        style={[
          styles.stick,
          {
            height: stickHeight,
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, ITEM_HEIGHT * marshmallows.length],
                  outputRange: [0, -ITEM_HEIGHT * Math.max(marshmallows.length - 1, 0)],
                  extrapolate: "extend",
                }),
              },
            ],
          },
        ]}
      />
      <Animated.FlatList
        style={styles.listContainer}
        data={marshmallows}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => {
          const SvgComp = getMarshmallowSvgByStatus(item);
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                console.log(item.status);
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
        snapToAlignment="start"
        contentContainerStyle={styles.contentContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
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
  },
  contentContainer: {
    paddingHorizontal: 100,
    paddingVertical: 200,
  },
  stick: {
    position: "absolute",
    top: 155,
    width: 10,
    backgroundColor: Colors.burn,
  },
});
