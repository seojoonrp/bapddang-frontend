// src/screens/MainScreen.js

import { View, InteractionManager } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Animated, { useSharedValue } from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";
import { useMainLayout } from "../hooks/useMainLayout";
import { useMainAnimations } from "../hooks/useMainAnimations";
import MainHeader from "../components/MainScreen/MainHeader";
import Hero from "../components/MainScreen/Hero";
import TimeQuestion from "../components/MainScreen/TimeQuestion";
import FoodCardNews from "../components/MainScreen/FoodCardNews";
import MainBottomSheet from "../components/MainScreen/MainBottomSheet";
import EditAndLike from "../components/MainScreen/EditAndLike";
import Colors from "../constants/colors";
import { MAIN_LAYOUT } from "../constants/layout";
import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { useModeStore } from "../stores/modeStore";
import ReanimatedModal from "../components/common/ReanimatedModal";
import LastMarshmallowModal from "../components/MainScreen/LastMarshmallowModal";
import DebugButton from "../components/DebugButton";
import SettingsDrawer from "../components/common/SettingsDrawer";

const MainScreen = () => {
  const navigation = useNavigation();

  const mode = useModeStore((state) => state.mode);
  const bgColor =
    mode === "fast" ? Colors.background_yellow : Colors.background_white;

  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });
    return () => task.cancel();
  }, []);

  const { screenWidth, insets, scrollThreshold } = useMainLayout();

  const { animatedStyles, panGesture, scrollY } =
    useMainAnimations(scrollThreshold);

  const showTextBubble = useSharedValue(0);

  const lastWeekData = useAuthStore((state) => state.lastWeekData);
  const clearLastWeekData = useAuthStore((state) => state.clearLastWeekData);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (lastWeekData) setIsModalVisible(true);
  }, [lastWeekData]);

  const handleCloseModal = () => {
    setIsModalVisible(false);
    clearLastWeekData();
  };

  const [isSettingOpen, setIsSettingOpen] = useState(false);

  if (!isReady) {
    return null;
  }

  return (
    <>
      <GestureDetector gesture={panGesture}>
        <View
          style={{ flex: 1, paddingTop: insets.top, backgroundColor: bgColor }}
        >
          <MainHeader
            animatedStyles={animatedStyles}
            onBellPress={() => console.log("Bell pressed")}
            onSettingsPress={() => setIsSettingOpen(!isSettingOpen)}
          />

          <Hero scrollY={scrollY} scrollThreshold={scrollThreshold} />

          <EditAndLike
            onEdit={() => navigation.navigate("DietLog")}
            onLike={() => navigation.navigate("Liked")}
            animatedStyle={animatedStyles}
            showTextBubble={showTextBubble}
          />

          <Animated.View style={animatedStyles.middleContent}>
            <TimeQuestion showTextBubble={showTextBubble} />
            <FoodCardNews
              type="main"
              screenWidth={screenWidth}
              size={screenWidth * MAIN_LAYOUT.CARDNEWS_RATIO}
              canLoadMore={true}
              animationRatio={0.91}
              categories={undefined}
            />
          </Animated.View>

          <MainBottomSheet
            animatedStyle={animatedStyles}
            scrollThreshold={scrollThreshold}
          />
        </View>
      </GestureDetector>

      <ReanimatedModal visible={isModalVisible} onClose={handleCloseModal}>
        <LastMarshmallowModal
          marshmallow={lastWeekData?.lastMarshmallow}
          onClose={handleCloseModal}
        />
      </ReanimatedModal>

      <SettingsDrawer
        visible={isSettingOpen}
        onClose={() => setIsSettingOpen(false)}
      />

      {/* <DebugButton
        index={0}
        label={"Show modal"}
        onPress={() => setIsModalVisible(true)}
      /> */}
    </>
  );
};

export default MainScreen;
