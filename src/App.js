import { useCallback, useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "./Navigation";
import { initGoogleLogin, handleLoginSession } from "./services/auth";
import api from "./api/api";
import { PortalProvider } from "@gorhom/portal";
import { Alert } from "react-native";

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [fontsLoaded, fontError] = useFonts({
    NanumSquareEB: require("./assets/fonts/NanumSquareOTF_acEB.otf"),
    NanumSquareB: require("./assets/fonts/NanumSquareOTF_acB.otf"),
    NanumSquareR: require("./assets/fonts/NanumSquareOTF_acR.otf"),
    NanumSquareL: require("./assets/fonts/NanumSquareOTF_acL.otf"),
    NanumSquareRoundEB: require("./assets/fonts/NanumSquareRoundOTFEB.otf"),
    NanumSquareRoundB: require("./assets/fonts/NanumSquareRoundOTFB.otf"),
    NanumSquareRoundR: require("./assets/fonts/NanumSquareRoundOTFR.otf"),
    NanumSquareRoundL: require("./assets/fonts/NanumSquareRoundOTFL.otf"),
    KCCGanpan: require("./assets/fonts/KCCGanpan.otf"),
  });

  const [isReady, setIsReady] = useState(false);
  const [serverError, setServerError] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        try {
          const response = await api.get("/ping");
          if (response.status !== 200) throw new Error();
        } catch (error) {
          setServerError(true);
          Alert.alert(
            "서버 연결 오류",
            "와이파이 연결을 확인하고 잠시 후 다시 시도해주세요.",
          );
          return;
        }

        await Promise.all([handleLoginSession(), initGoogleLogin()]);
      } catch (e) {
        console.warn("Error while preparing app:", e);
      } finally {
        setIsReady(true);
      }
    };

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if ((fontsLoaded || fontError) && isReady && !serverError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, isReady, serverError]);

  if (!(fontsLoaded || fontError) || !isReady || serverError) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PortalProvider>
          <Navigation />
        </PortalProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
