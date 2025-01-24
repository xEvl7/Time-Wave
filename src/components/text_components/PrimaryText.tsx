import React from "react";
import { Text } from "react-native";
import { StyleSheet } from "react-native";

type PrimaryTextProp = {
  children: string;
};

const PrimaryText = ({ children }: PrimaryTextProp) => {
  return <Text style={styles.primary}>{children}</Text>;
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
