import React from "react";
import { StyleProp, Text, TextStyle } from "react-native";
import { StyleSheet } from "react-native";

type PrimaryTextProp = {
  style?: StyleProp<TextStyle>;
  children: React.ReactNode; // ← 修改这里，允许嵌套文本或元素
};

const PrimaryText = ({ style, children }: PrimaryTextProp) => {
  return <Text style={[styles.primary, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  primary: {
    fontFamily: "Roboto-Bold",
    fontSize: 18,
    color: "#45474E",
  },
});

export default PrimaryText;
