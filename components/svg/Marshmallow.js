import { Text, View } from "react-native";
import InsetShadow from "react-native-inset-shadow";

const MarshMallow = () => {
  return (
    <View
      style={{
        width: 174,
        height: 174,
        backgroundColor: "#FFF",
        borderRadius: 20,
        boxShadow:
          "0px -2px 4px 0px #A94946 inset, 0px -12px 20px 10px #FDEDC0 inset",
      }}
    />
  );
};

export default MarshMallow;
