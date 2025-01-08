import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, KeyboardTypeOptions } from "react-native";

interface InputFieldProps {
  type: KeyboardTypeOptions;
  title: string;
  placeholder?: string;
  secureTextEntry?: boolean;
}

function InputField({ placeholder, type, title, secureTextEntry = false }: InputFieldProps) {
  const [val, setVal] = useState("");
  const [error, setError] = useState("");

  const handleChange = (text: string) => {
    setVal(text);
    setError("");
  };

  return (
    <View>
      <Text style={{ color: "#3D4A7A", fontWeight: "500", fontSize: 16 }}>
        {title}
      </Text>
      <TextInput
        style={{
          height: 38,
          borderBottomWidth: 1,
          borderBottomColor: "#CDD1D0",
          paddingInlineStart: 0,
        }}
        placeholder={placeholder || ""}
        value={val}
        secureTextEntry={secureTextEntry} 
        onChangeText={(text) => handleChange(text)}
        keyboardType={type || "default"} 
        autoCapitalize="none"
      />
      {error && (
        <Text
          style={{
            color: "red",
            fontSize: 12,
            marginTop: 0,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}

export default InputField;
