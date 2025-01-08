import React from "react";
import { StyleProp, StyleSheet, TextStyle } from "react-native";
import { Text } from "react-native-paper";

type ParagraphTextProps = {
  style?: StyleProp<TextStyle>;
  children: string;
};

const ParagraphText = ({ style, children }: ParagraphTextProps) => {
  return (
    <>
      <Text style={[styles.paragraph, style]}>{children}</Text>
    </>
  );
};

const styles = StyleSheet.create({
  paragraph: {
    fontFamily: "Roboto-Regular",
    fontSize: 15,
    marginVertical: 7.5,
    lineHeight: 20,
    textAlign: "justify",
  },
});

export default ParagraphText;
