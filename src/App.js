import { useEffect, useState } from "react";
import * as Font from "expo-font";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Navigation from "./Navigation";
import { initGoogleLogin } from "./services/auth";
import { PortalProvider } from "@gorhom/portal";

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      NanumSquareEB: require("./assets/fonts/NanumSquareEB.woff2"),
      NanumSquareB: require("./assets/fonts/NanumSquareB.woff2"),
      NanumSquareR: require("./assets/fonts/NanumSquareR.woff2"),
      NanumSquareL: require("./assets/fonts/NanumSquareL.woff2"),
      NanumSquareRoundEB: require("./assets/fonts/NanumSquareRoundEB.woff2"),
      NanumSquareRoundB: require("./assets/fonts/NanumSquareRoundB.woff2"),
      NanumSquareRoundR: require("./assets/fonts/NanumSquareRoundR.woff2"),
      NanumSquareRoundL: require("./assets/fonts/NanumSquareRoundL.woff2"),
      KCCGanpan: require("./assets/fonts/KCC-Ganpan.woff2"),
    }).then(() => setFontsLoaded(true));

    initGoogleLogin();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PortalProvider>
          <Navigation />
        </PortalProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
