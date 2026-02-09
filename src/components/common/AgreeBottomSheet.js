// src/components/common/AgreeBottomSheet.js

import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import Colors from "../../constants/colors";
import CheckCircleYesIcon from "../../assets/icons/check-circle-yes.svg";
import CheckCircleNoIcon from "../../assets/icons/check-circle-no.svg";
import { Portal } from "@gorhom/portal";
import { LinearGradient } from "expo-linear-gradient";
import { handleAgreeToTerms } from "../../services/auth";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MAX_TRANSLATE_Y = -365;

const AgreeBottomSheet = ({
  isVisible,
  onClose,
  onAgree,
  isSocial,
  agreeText,
}) => {
  const translateY = useSharedValue(0);
  const active = useSharedValue(false);
  const [isRendered, setIsRendered] = useState(isVisible);

  const scrollTo = (destination, callback) => {
    "worklet";
    active.value = destination !== 0;
    translateY.value = withSpring(
      destination,
      {
        damping: 100,
        stiffness: 150,
        mass: 1,
      },
      (finished) => {
        if (finished && callback) {
          runOnJS(callback)();
        }
      },
    );
  };

  useEffect(() => {
    if (isVisible) {
      setIsRendered(true);
      scrollTo(MAX_TRANSLATE_Y);
    } else {
      scrollTo(0, () => {
        setIsRendered(false);
      });
    }
  }, [isVisible]);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateY.value = Math.max(
        MAX_TRANSLATE_Y + event.translationY,
        MAX_TRANSLATE_Y,
      );
    })
    .onEnd((event) => {
      if (event.translationY > 100) {
        runOnJS(onClose)();
      } else {
        scrollTo(MAX_TRANSLATE_Y);
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const rBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isVisible ? 1 : 0),
    };
  }, [isVisible]);

  // 동의 로직
  const [agreedApp, setAgreedApp] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const isAllAgreed = useMemo(
    () => agreedApp && agreedPrivacy,
    [agreedApp, agreedPrivacy],
  );

  const toggleAll = () => {
    const newValue = !isAllAgreed;
    setAgreedApp(newValue);
    setAgreedPrivacy(newValue);
  };

  const handleAgree = async () => {
    if (!isAllAgreed) return;

    if (isSocial) {
      try {
        const result = await handleAgreeToTerms();
        if (!result) throw new Error("Failed to agree to terms.");
      } catch (error) {
        Alert.alert(
          "약관 동의 실패",
          "약관 동의에 실패했습니다. 다시 시도해주세요.",
        );
        return;
      }
    }

    if (onAgree) onAgree();
    onClose();
  };

  if (!isRendered) {
    return null;
  }

  return (
    <Portal>
      <Animated.View style={[styles.backdrop, rBackdropStyle]}>
        <LinearGradient
          colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0.5)"]}
          style={StyleSheet.absoluteFill}
        />
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
          <View style={styles.grabBar} />
          <Text style={styles.modalTitle}>
            서비스 이용에 필요한 약관에 동의해주세요
          </Text>

          <View style={styles.checkboxWrapper}>
            <Pressable style={styles.checkboxRow} onPress={toggleAll}>
              {isAllAgreed ? (
                <CheckCircleYesIcon width={24} height={24} />
              ) : (
                <CheckCircleNoIcon width={24} height={24} />
              )}
              <Text style={[styles.termsText, { textDecorationLine: "none" }]}>
                전체 동의
              </Text>
            </Pressable>

            <Pressable
              style={styles.checkboxRow}
              onPress={() => setAgreedApp(!agreedApp)}
            >
              {agreedApp ? (
                <CheckCircleYesIcon width={24} height={24} />
              ) : (
                <CheckCircleNoIcon width={24} height={24} />
              )}
              <Text style={styles.termsText}>[필수] 앱 이용약관 동의</Text>
            </Pressable>

            <Pressable
              style={styles.checkboxRow}
              onPress={() => setAgreedPrivacy(!agreedPrivacy)}
            >
              {agreedPrivacy ? (
                <CheckCircleYesIcon width={24} height={24} />
              ) : (
                <CheckCircleNoIcon width={24} height={24} />
              )}
              <Text style={styles.termsText}>
                [필수] 개인정보 수집 및 이용 동의
              </Text>
            </Pressable>
          </View>

          <TouchableOpacity
            style={[
              styles.modalNextButton,
              {
                backgroundColor: isAllAgreed
                  ? Colors.point_red
                  : Colors.text_gray,
              },
              {
                borderColor: isAllAgreed
                  ? Colors.burn_red
                  : Colors.slightly_burn,
              },
            ]}
            onPress={handleAgree}
            disabled={!isAllAgreed}
          >
            <Text
              style={[
                styles.modalNextButtonText,
                { color: isAllAgreed ? Colors.background_yellow : Colors.burn },
              ]}
            >
              {agreeText}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </Portal>
  );
};

export default AgreeBottomSheet;

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: "100%",
    backgroundColor: "white",
    position: "absolute",
    top: SCREEN_HEIGHT,
    zIndex: 20,
    paddingHorizontal: 12,
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  grabBar: {
    width: 36,
    height: 5,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    marginTop: 8,
    marginBottom: 36,
  },
  modalTitle: {
    fontFamily: "NanumSquareEB",
    fontSize: 18,
    color: Colors.light_red,
    marginBottom: 36,
  },
  checkboxWrapper: {
    width: "100%",
    marginBottom: 30,
    paddingHorizontal: 32,
    gap: 16,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  termsText: {
    fontFamily: "NanumSquareRoundB",
    fontSize: 16,
    color: Colors.burn,
    textDecorationLine: "underline",
  },
  modalNextButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    marginTop: 16,
  },
  modalNextButtonText: {
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "NanumSquareB",
  },
});
