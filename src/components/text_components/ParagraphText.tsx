import { StyleProp, Text, TextStyle } from "react-native";
import React from "react";

type ParagraphTextProps = {
  style?: StyleProp<TextStyle>;
  children: string;
};

const ParagraphText = ({ style, children }: ParagraphTextProps) => {
  return (
    <>
      <Text
        style={[
          {
            fontSize: 14,
            marginVertical: 7.5,
            lineHeight: 20,
          },
          style,
        ]}
      >
        {children}
      </Text>
    </>
  );
};

export default ParagraphText;
