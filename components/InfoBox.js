import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Colors from "../styles/colors";

const { width, height } = Dimensions.get("window");
const PADDING_HORIZONTAL = 11;

const InfoBox = ({ visible, onClose, item, mode }) => {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      presentationStyle="overFullScreen"
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.boxContainer}>
              <View style={styles.iconBar}>
                <TouchableOpacity onPress={onClose} style={styles.iconLeft}>
                  <Ionicons name="chevron-back" size={22} color="#fff" />
                  <Text style={styles.iconText}>HOME</Text>
                </TouchableOpacity>
                <Ionicons name="calendar-outline" size={22} color="#fff" />
              </View>

              <View
                style={[
                  styles.header,
                  { backgroundColor: mode === "fast" ? "#E90C05" : "#00CA80" },
                ]}
              >
                <Text style={styles.headerText}>★ {item.name} ★</Text>
              </View>

              <View style={styles.contentBox}>
                <View style={styles.imageContainer}>
                  {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.image} />
                  ) : (
                    <View style={styles.placeholder}>
                      <Text style={styles.placeholderText}>사진</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.brandText}>
                  {item.brand
                    ? `${item.brand}에서 먹을 수 있어요!`
                    : "알 수 없는 브랜드"}
                </Text>

                <Text style={styles.infoText}>한식</Text>
                <Text style={styles.infoText}>칼로리: {item.kcal}kcal</Text>
                <Text style={styles.infoText}>맵기지수: {item.spicy}</Text>
                <Text style={styles.infoText}>단맛지수: {item.sweet}</Text>
                <Text style={styles.infoText}>짠맛지수: {item.salty}</Text>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.emojiButton, { backgroundColor: "#FFF" }]}
                    onPress={onClose}
                  >
                    <Text style={styles.emojiText}>👍</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.emojiButton,
                      { backgroundColor: "#FFFAED" },
                    ]}
                    onPress={onClose}
                  >
                    <Text style={styles.emojiText}>👎</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default InfoBox;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  boxContainer: {
    width: width - PADDING_HORIZONTAL * 2,
    backgroundColor: "transparent",
  },
  iconBar: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  iconLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconText: {
    color: "white",
    marginLeft: 4,
    fontWeight: "bold",
    fontSize: 13,
  },
  header: {
    paddingTop: 27,
    paddingBottom: 11,
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerText: {
    fontFamily: "NanumSquareEB",
    fontSize: 30,
    color: "white",
  },
  contentBox: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 12,
    height: 632,
  },
  imageContainer: {
    width: 292,
    height: 276,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    resizeMode: "cover",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  placeholderText: {
    fontSize: 20,
    color: "#333",
  },
  brandText: {
    color: "#a38888",
    fontSize: 14,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 2,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginTop: 28,
  },
  emojiButton: {
    borderWidth: 0.4,
    borderColor: "#D9D9D9",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
    margin: 1,
    boxShadow: "0px -2px 4px 0px #A94946 inset, 0px -2px 6px 2px #FDEDC0 inset",
  },
  emojiText: {
    fontSize: 24,
  },
});
