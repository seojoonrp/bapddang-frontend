// src/components/common/QuestionMarshmallow.js

import { View } from "react-native";
import Marsh_5 from "../../assets/images/marshmallows/marsh_5.svg";
import QuestionMark from "../../assets/images/marshmallows/question.svg";
import { BlurView } from "expo-blur";

const QuestionMarshmallow = ({ width = 160, height = 160 }) => {
  return (
    <View
      style={{
        width: width,
        height: height,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Marsh_5 width={width} height={height} />
      <QuestionMark
        width={width * 0.25}
        height={height * 0.25}
        style={{
          position: "absolute",
          top: height * 0.375,
          left: width * 0.375,
        }}
      />
      <BlurView
        style={{
          position: "absolute",
          width: width * 0.5,
          height: height * 0.5,
          top: height * 0.25,
          left: width * 0.25,
          justifyContent: "center",
          alignItems: "center",
        }}
        intensity={6}
        tint="light"
      />
    </View>
  );
};

export default QuestionMarshmallow;
