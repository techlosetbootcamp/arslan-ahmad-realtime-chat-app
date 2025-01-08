import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "react-native";
import RulerText from "../components/RulerText";
import IconButton from "../components/IconButton";

const Welcome = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.link}>Connect friends easily & quickly</Text>
      <Text style={styles.description}>
        Our chat app is the perfect way to stay connected with friends and
        family.
      </Text>

      <IconButton src={require("../assets/imgs/search.png")} onPress={()=> console.log('"Google Icon" on Welcome clicled.')} />

      <RulerText textColor="white">OR</RulerText>

      <TouchableOpacity
        style={styles.ghostButton}
        onPress={() => console.log("/signup")}
      >
        <Text style={styles.ghostButton_text}>Sign up with mail</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => console.log("/signin")}>
        <Text
          style={{
            ...styles.description,
            fontSize: 14,
            color: "white",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          Existing account?{" "}
          <Text style={{ color: "white", fontWeight: "bold", marginTop: 9 }}>
            Log in
          </Text>{" "}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#050821",
    flex: 1,
    padding: 20,
  },
  link: {
    marginTop: 45,
    fontSize: 68,
    lineHeight: 80,
    fontWeight: 400,
    color: "white",
    paddingVertical: 15,
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: 400,
    color: "rgba(255, 255, 255, 0.5)",
    paddingVertical: 15,
  },
  ghostButton: {
    marginTop: 15,
    paddingVertical: 15,
    backgroundColor: "rgba(255, 255, 255, 0.30)",
    borderRadius: 10,
  },
  ghostButton_text: {
    textAlign: "center",
    color: "white",
    fontSize: 18,
  },
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
export default Welcome;
