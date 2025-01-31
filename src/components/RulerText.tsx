import { View, Text } from "react-native";
import React from "react";
import { RulerTextProps } from "../types/rulerText";
import { color } from "../constants/colors";

const RulerText: React.FC<RulerTextProps> = ({
  textColor = color.black,
  lineColor = color.dark_gray,
}) => {
  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginVertical: 20 }}
    >
      <View style={{ ...styles.line, backgroundColor: lineColor }} />
      <View>
        <Text style={{ ...styles.text, color: textColor }}>OR</Text>
      </View>
      <View style={{ ...styles.line, backgroundColor: lineColor }} />
    </View>
  );
};

const styles = {
  line: { flex: 1, height: 1, backgroundColor: color.gray },
  text: {
    width: 50,
    textAlign: "center" as "center",
    color: "white",
    fontWeight: 900 as 900,
  },
};

export default RulerText;
