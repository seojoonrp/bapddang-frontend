import { Portal } from "@gorhom/portal";
import React from "react";
import { StyleSheet, Pressable, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";

const ReanimatedModal = ({ visible, onClose, children }) => {
  if (!visible) return null;

  return (
    <Portal hostName="modal">
      <View style={StyleSheet.absoluteFill}>
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={styles.backdrop}
        >
          <Pressable style={styles.flex1} onPress={onClose} />
        </Animated.View>

        <View style={styles.centeredView} pointerEvents="box-none">
          <Animated.View
            entering={SlideInDown.duration(200).springify()}
            exiting={SlideOutDown.duration(200)}
            style={styles.modalContent}
          >
            {children}
          </Animated.View>
        </View>
      </View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  modalContent: {
    width: "100%",
    overflow: "hidden",
  },
});

export default ReanimatedModal;
