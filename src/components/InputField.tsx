import React, { useState } from "react";
import { View, Text, TextInput, KeyboardTypeOptions } from "react-native";
import { InputFieldProps } from "../types/inputField";


function InputField({ placeholder, type = "default", title, secureTextEntry = false, setVal, val }: InputFieldProps) {
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
          color: "#3D4A7A",
        }}
        placeholder={placeholder || ""}
        placeholderTextColor="#CDD1D0"
        value={val}
        secureTextEntry={secureTextEntry} 
        onChangeText={(text) => handleChange(text)}
        keyboardType={type} 
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
