import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";

type ButtonTextProp = {
  children: string;
};

const ButtonText = ({ children }: ButtonTextProp) => {
  return <Text style={styles.button}>{children}</Text>;
};

const styles = StyleSheet.create({
  button: {
    fontFamily: "Roboto-Bold",
    // fontWeight: "bold",
    fontSize: 14,
    color: "#FF8D13",
  },
});

export default ButtonText;
