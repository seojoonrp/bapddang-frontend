import { useRef } from "react";
import { View, StyleSheet, Animated, TouchableOpacity } from "react-native";

import Marshmallow from "../svg/Marshmallow";
import marshmallowData from "../../data/MarshmallowData.json";
import Colors from "../../styles/colors";

const ITEM_HEIGHT = 180;
const MARSHMALLOW_SIZE = 160;

const MarshmallowStick = ({onClick}) => {
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Animated.View
        style={[
          styles.stick,
          {
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [
                    0,
                    ITEM_HEIGHT * marshmallowData.marshmallows.length,
                  ],
                  outputRange: [
                    0,
                    -ITEM_HEIGHT * (marshmallowData.marshmallows.length - 1),
                  ],
                  extrapolate: "extend",
                }),
              },
            ],
          },
        ]}
      />
      <Animated.FlatList
        style={styles.listContainer}
        data={marshmallowData.marshmallows}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if(onClick){
                onClick(index);
              }
            }}
            style={{
              height: ITEM_HEIGHT, // FlatList의 snapToInterval과 일치시킴
              justifyContent: "center",
              alignItems: "center",
            }}
          >
          <Marshmallow
            roastStep={item.roastStep}
            rotation={item.rotation}
            size={MARSHMALLOW_SIZE}
            verticalGap={(ITEM_HEIGHT - MARSHMALLOW_SIZE) / 2}
          />
          </TouchableOpacity>
        )}
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
        // bounces={false}
        // overScrollMode="never"
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
    height: ITEM_HEIGHT * marshmallowData.marshmallows.length + 100,

    backgroundColor: Colors.burn,
  },
});
