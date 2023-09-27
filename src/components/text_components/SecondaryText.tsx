import { Text } from "react-native";
import React from "react";

const SecondaryText = ({ children }) => {
  return (
    <Text style={{ fontSize: 14, color: "#7BB8A3", fontWeight: "bold" }}>
      {children}
    </Text>
  );
};

export default SecondaryText;
