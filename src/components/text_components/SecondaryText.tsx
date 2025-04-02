import React, { ReactNode } from "react";
import { StyleProp, Text, TextStyle } from "react-native";
import { StyleSheet } from "react-native";

type SecondaryTextProp = {
  style?: StyleProp<TextStyle>;
  children: ReactNode;
};

const SecondaryText = ({ style, children }: SecondaryTextProp) => {
  return <Text style={[styles.secondary, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  secondary: {
    fontFamily: "Roboto-Regular",
    // fontWeight: "normal",
    fontSize: 16,
    color: "#000000",
  },
});

export default SecondaryText;
