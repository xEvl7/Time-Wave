import { Text } from "react-native";
import React from "react";

const ButtonText = ({ children }) => {
  return (
    <Text style={{ fontSize: 14, color: "#FF8D13", fontWeight: "bold" }}>
      {children}
    </Text>
  );
};

export default ButtonText;
