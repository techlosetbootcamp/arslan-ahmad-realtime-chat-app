import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { IconButtonProps } from "../types/IconButton";

const IconButton: React.FC<IconButtonProps> = ({ src, size, onPress}) => {
  return (
    <TouchableOpacity
      style={styles.ghostIcon}
      onPress={onPress}
    >
      <Image
        source={src}
        style={!size ? { width: 22.7, height: 23.16 } : size}
      />
    </TouchableOpacity>
  );
};

export default IconButton;

const styles = StyleSheet.create({
  ghostIcon: {
    paddingVertical: 5,
    width: 40,
    height: 40,
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    alignSelf: "center",
  },
});
