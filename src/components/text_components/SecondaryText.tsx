import React, { ReactNode } from "react";
import { Text } from "react-native";
import { StyleSheet } from "react-native";

type SecondaryTextProp = {
  children: ReactNode;
};

const SecondaryText = ({ children }: SecondaryTextProp) => {
  return <Text style={styles.secondary}>{children}</Text>;
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
