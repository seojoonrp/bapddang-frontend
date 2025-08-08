import { Text, View } from "react-native";

const Marshmallow = ({ roastStep, rotation, size, verticalGap }) => {
  return (
    <View
      style={{
        marginVertical: verticalGap,
      }}
    >
      <View
        style={{
          width: size,
          height: size,
          backgroundColor: "#FFF",
          borderRadius: 20,
          transform: [{ rotate: `${rotation}deg` }],
          boxShadow:
            "0px -2px 4px 0px #A94946 inset, 0px -12px 20px 10px #FDEDC0 inset",
        }}
      />
    </View>
  );
};

export default Marshmallow;
