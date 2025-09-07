import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import Colors from "../styles/colors";

const TagContainer = ({
  tags,
  mode,
  onPress,
  selectedTag,
  selectedTags,
  containerStyle,
}) => {
  if (mode === "assign") {
    return (
      <View style={[styles.container, containerStyle]}>
        {tags.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={styles.button}
            onPress={() => onPress(tag)}
          >
            <Text style={styles.buttonText}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  if (mode === "select_multi") {
    return (
      <View style={[styles.container, containerStyle]}>
        {tags.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[
              styles.button,
              selectedTags.includes(tag) && styles.buttonSelected,
            ]}
            onPress={() => onPress(tag)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.buttonText,
                selectedTags.includes(tag) && styles.buttonTextSelected,
              ]}
            >
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  if (mode === "select_single") {
    return (
      <View style={[styles.container, containerStyle]}>
        {tags.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[
              styles.button,
              selectedTag === tag && styles.buttonSelected,
            ]}
            onPress={() => onPress(tag)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.buttonText,
                selectedTag === tag && styles.buttonTextSelected,
              ]}
            >
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  return null;
};

export default TagContainer;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  button: {
    display: "flex",
    borderWidth: 0.4,
    borderColor: Colors.light_gray,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 9,
    gap: 10,
    boxShadow: "0px -2px 4px 0px #A94946 inset, 0px -2px 6px 2px #FDEDC0 inset",
  },
  buttonSelected: {
    backgroundColor: Colors.pressed_button,
    boxShadow: "",
  },
  buttonText: {
    fontFamily: "NanumSquareEB",
    fontSize: 16,
    color: Colors.slightly_burn,
    fontWeight: 700,
  },
  buttonTextSelected: {
    color: Colors.background_yellow,
  },
});
