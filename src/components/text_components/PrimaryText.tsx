import { Text } from "react-native";
import React from "react";

type PrimaryTextProp = {
  children: string;
};

const PrimaryText = ({ children }: PrimaryTextProp) => {
  return (
    <Text style={{ fontSize: 18, fontWeight: "500", color: "#45474E" }}>
      {children}
    </Text>
  );
};

export default PrimaryText;
