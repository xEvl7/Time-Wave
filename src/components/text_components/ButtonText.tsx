import React from "react";
import { StyleProp, StyleSheet, TextStyle } from "react-native";
import { Text } from "react-native-paper";

type ButtonTextProp = {
  style?: StyleProp<TextStyle>;
  children: string;
};

const ButtonText = ({ style, children }: ButtonTextProp) => {
  return <Text style={[styles.button, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  button: {
    fontFamily: "Roboto-Bold",
    // fontWeight: "bold",
    fontSize: 14,
    color: "#FF8D13",
  },
});

export default ButtonText;
