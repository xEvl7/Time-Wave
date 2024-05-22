import { Text } from "react-native";
import React from "react";

type ButtonTextProp = {
  children: string;
};

const ButtonText = ({ children }: ButtonTextProp) => {
  return (
    <Text style={{ fontSize: 14, color: "#FF8D13", fontWeight: "bold" }}>
      {children}
    </Text>
  );
};

export default ButtonText;
