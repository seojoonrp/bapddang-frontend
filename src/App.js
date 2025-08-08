import { useEffect, useState } from "react";
import * as Font from "expo-font";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import Navigation from "./Navigation";

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      NanumSquareEB: require("./assets/fonts/NanumSquareEB.ttf"),
      NanumSquareB: require("./assets/fonts/NanumSquareB.ttf"),
      NanumSquareR: require("./assets/fonts/NanumSquareR.ttf"),
      NanumSquareL: require("./assets/fonts/NanumSquareL.ttf"),
      NanumSquareRoundEB: require("./assets/fonts/NanumSquareRoundEB.ttf"),
      NanumSquareRoundB: require("./assets/fonts/NanumSquareRoundB.ttf"),
      NanumSquareRoundR: require("./assets/fonts/NanumSquareRoundR.ttf"),
      NanumSquareRoundL: require("./assets/fonts/NanumSquareRoundL.ttf"),
    }).then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Navigation />
    </GestureHandlerRootView>
  );
};

export default App;
