// src/screens/MainScreen.js

import { StyleSheet, View, Text } from "react-native";
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
import Colors from "../constants/colors";
import { MAIN_LAYOUT } from "../constants/layout";
import EditAndLike from "../components/MainScreen/EditAndLike";
import DebugButton from "../components/DebugButton";

const MainScreen = () => {
  const navigation = useNavigation();

  const { screenWidth, insets, scrollThreshold } = useMainLayout();

  const { animatedStyles, panGesture, scrollY } =
    useMainAnimations(scrollThreshold);

  const showTextBubble = useSharedValue(0);

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <MainHeader
          animatedStyles={animatedStyles}
          onBellPress={() => console.log("Bell pressed")}
          onSettingsPress={() => navigation.navigate("Setting")}
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
          />
        </Animated.View>

        <MainBottomSheet
          animatedStyle={animatedStyles}
          scrollThreshold={scrollThreshold}
        />
      </View>
    </GestureDetector>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background_yellow,
  },
});
