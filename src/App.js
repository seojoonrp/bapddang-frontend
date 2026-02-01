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
      NanumSquareEB: require("./assets/fonts/NanumSquareOTF_acEB.otf"),
      NanumSquareB: require("./assets/fonts/NanumSquareOTF_acB.otf"),
      NanumSquareR: require("./assets/fonts/NanumSquareOTF_acR.otf"),
      NanumSquareL: require("./assets/fonts/NanumSquareOTF_acL.otf"),
      NanumSquareRoundEB: require("./assets/fonts/NanumSquareRoundOTFEB.otf"),
      NanumSquareRoundB: require("./assets/fonts/NanumSquareRoundOTFB.otf"),
      NanumSquareRoundR: require("./assets/fonts/NanumSquareRoundOTFR.otf"),
      NanumSquareRoundL: require("./assets/fonts/NanumSquareRoundOTFL.otf"),
      KCCGanpan: require("./assets/fonts/KCC-Ganpan.ttf"),
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
