import { StyleProp, StyleSheet, TextInput, TextStyle } from "react-native";
import React from "react";

type BaseTextInputProps = {
  style?: StyleProp<TextStyle>;
  placeholder: string;
  onChangeText: (text: string) => void;
  value: string;
  secureTextEntry?: boolean;
};

const BaseTextInput = ({
  style,
  placeholder,
  onChangeText,
  value,
  secureTextEntry = false,
  ...prop
}: BaseTextInputProps) => {
  return (
    <TextInput
      style={[styles.textInput, style]}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      onChangeText={onChangeText}
      value={value}
      {...prop}
    ></TextInput>
  );
};

export default BaseTextInput;

const styles = StyleSheet.create({
  textInput: {
    borderColor: "#757575",
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 10,
    minHeight: 45,
    paddingLeft: 10,
  },
});
