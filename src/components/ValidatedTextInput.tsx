import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import React from "react";
import {
  Control,
  Controller,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";

import BaseTextInput from "./BaseTextInput";

type ValidatedTextInputProps = {
  name: string;
  control: Control<any>;
  placeholder: string;
  secureTextEntry?: boolean;
  rules?:
  | Omit<
    RegisterOptions<FieldValues, any>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >
  | undefined;
  style?: StyleProp<TextStyle>;
} & Record<string, any>;

const ValidatedTextInput = ({
  name,
  control,
  placeholder,
  secureTextEntry = false,
  rules = { required: "This is required." },
  style,
  ...prop
}: ValidatedTextInputProps) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          return (
            <>
              <BaseTextInput
                placeholder={placeholder}
                style={error ? styles.error : style}
                onChangeText={onChange}
                value={value}
                secureTextEntry={secureTextEntry}
                {...prop}
              />
              {error && (
                <Text style={styles.text}>
                  {error.message || "Unknown error"}
                </Text>
              )}
            </>
          );
        }}
      />
    </>
  );
};

export default ValidatedTextInput;

const styles = StyleSheet.create({
  error: {
    borderColor: "red",
  },
  text: {
    color: "red",
  },
});
