import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MAIN_LAYOUT } from "../constants/layout";

export const useMainLayout = () => {
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const headerHeight = insets.top + MAIN_LAYOUT.HEADER;

  const scrollThreshold =
    screenHeight - headerHeight - MAIN_LAYOUT.BOTTOM_SHEET_HANDLE;

  const heroHeight =
    screenHeight -
    headerHeight -
    MAIN_LAYOUT.BOTTOM_SHEET_HANDLE -
    MAIN_LAYOUT.HEADER_HERO_GAP -
    screenWidth * MAIN_LAYOUT.CARDNEWS_RATIO -
    MAIN_LAYOUT.PAGINATION -
    MAIN_LAYOUT.EXTRA_STUFF;

  return {
    screenWidth,
    screenHeight,
    insets,
    headerHeight,
    scrollThreshold,
    heroHeight,
  };
};
