import { StyleSheet, Text, View, Alert } from "react-native";
import React from "react";
import { useForm } from "react-hook-form";

import BackgroundImageBox from "../components/BackgroundImageBox";
import HeaderText from "../components/text_components/HeaderText";
import ContentContainer from "../components/ContentContainer";
import ValidatedTextInput from "../components/ValidatedTextInput";
import TextButton from "../components/TextButton";

import auth from "@react-native-firebase/auth";

const ForgotPassword = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: { email: string }) => {
    try {
      await auth().sendPasswordResetEmail(data.email);
    } catch (error: any) {
      // Log the error for debugging (optional)
      console.error("Password reset error:", error);
      // DO NOT show the real error to the user
    } finally {
      // Always show the same generic message
      Alert.alert(
        "Password Reset",
        "If this email is registered, you will receive a reset link shortly."
      );
    }
  };

  return (
    <View style={styles.container}>
      <BackgroundImageBox
        source={require("../assets/background/speech-bubble.png")}
        imageStyle={{ width: 159, height: 125, resizeMode: "contain" }}
        style={{ height: 180 }}
      />
      <ContentContainer>
        <HeaderText style={{ marginVertical: 10 }}>Forgot Password</HeaderText>
        <ValidatedTextInput
          control={control}
          name="email"
          placeholder="Email Address"
          rules={{
            required: "Email is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Invalid email format",
            },
          }}
        />
        <TextButton onPress={handleSubmit(onSubmit)}>
          Send Reset Link
        </TextButton>
      </ContentContainer>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
