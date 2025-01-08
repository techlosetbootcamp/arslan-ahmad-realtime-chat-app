import { View, Text } from "react-native";
import React from "react";
import { RulerTextProps } from "../types/RulerText";

const RulerText: React.FC<RulerTextProps> = ({
  children,
  textColor = "black",
  lineColor = "#2A3046",
}) => {
  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginVertical: 20 }}
    >
      <View style={{ ...styles.line, backgroundColor: lineColor }} />
      <View>
        <Text style={{ ...styles.text, color: textColor }}>{children}</Text>
      </View>
      <View style={{ ...styles.line, backgroundColor: lineColor }} />
    </View>
  );
};

const styles = {
  line: { flex: 1, height: 1, backgroundColor: "#2A3046" },
  text: {
    width: 50,
    textAlign: "center" as "center",
    color: "white",
    fontWeight: 900 as 900,
  },
};

export default RulerText;
