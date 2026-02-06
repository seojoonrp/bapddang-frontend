// src/components/common/AnimatedMarshmallow.js

import React, { useState } from "react";
import { TouchableWithoutFeedback } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from "react-native-reanimated";

const AnimatedMarshmallow = ({ status, getSvg }) => {
  const [variant, setVariant] = useState(0);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    setVariant((prev) => (prev === 0 ? 1 : 0));

    scale.value = 1.07;

    scale.value = withSpring(1, {
      stiffness: 1000,
      damping: 50,
    });
  };

  const MarshmallowSvg = getSvg(status, variant);

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <Animated.View style={animatedStyle}>
        {MarshmallowSvg && <MarshmallowSvg width={150} height={130} />}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default AnimatedMarshmallow;
