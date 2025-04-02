import React from "react";
import { StyleProp, Text, TextStyle } from "react-native";
import { StyleSheet } from "react-native";

type PrimaryTextProp = {
  style?: StyleProp<TextStyle>;
  children: string;
};

const PrimaryText = ({ style, children }: PrimaryTextProp) => {
  return <Text style={[styles.primary, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  primary: {
    fontFamily: "Roboto-Bold",
    // fontWeight: "600",
    fontSize: 18,
    color: "#45474E",
  },
});

export default PrimaryText;
