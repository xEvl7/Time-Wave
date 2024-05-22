import { Text } from "react-native";
import React from "react";

type SecondaryTextProp = {
  children: string;
};

const SecondaryText = ({ children }: SecondaryTextProp) => {
  return (
    <Text style={{ fontSize: 16, color: "#000000", fontWeight: "normal" }}>
      {children}
    </Text>
  );
};

export default SecondaryText;
