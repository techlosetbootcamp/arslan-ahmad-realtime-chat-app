import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import IconButton from "../components/IconButton";
import RulerText from "../components/RulerText";
import InputField from "../components/InputField";

const signin = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "android" ? "padding" : undefined}
      style={{ flex: 1, flexDirection: "column", padding: 20 }}
    >
      <View
        style={{
          flex: 3,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "blue",
            fontSize: 18,
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          Log in to Chatbox
        </Text>
        <Text
          style={{
            color: "black",
            fontSize: 14,
            fontWeight: 300,
            width: 293,
            textAlign: "center",
          }}
        >
          Welcome back! Sign in using your social account or email to continue
          us
        </Text>
      </View>

      <View style={{ flex: 6 }}>
        <IconButton
          src={require("../assets/imgs/profile_placeholder_image.png")}
          onPress={() => "'Google Icon' on Sign Clicked"}
        />
        <View style={styles.gapVertical}>
          <RulerText lineColor="#797C7B">OR</RulerText>
        </View>

        <View style={{ gap: 25 }}>
          <InputField
            title="Enter Email"
            type="email-address"
            placeholder="i.e. Jhon@gmail.com"
          />

          <InputField title="Password" type="default" secureTextEntry={true} />
        </View>
      </View>
      <View style={{ flex: 2 }}>
        <TouchableOpacity
          style={{ backgroundColor: "orange", padding: 14, borderRadius: 16 }}
        >
          <Text style={{ fontSize: 18, textAlign: "center" }}>
            Sign up with mail
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => console.log("Forget Password, clicked")}
        >
          <Text
            style={{
              color: "black",
              textAlign: "center",
              marginTop: 15,
            }}
          >
            Forgot password?
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default signin;

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
  gapVertical: { marginTop: 10 },
});
