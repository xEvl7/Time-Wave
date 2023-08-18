import { StyleSheet, Text, Pressable } from "react-native";
import React from "react";
import { useForm } from "react-hook-form";

import BackgroundImageBox from "../components/BackgroundImageBox";
import HeaderText from "../components/text_components/HeaderText";
import ContentContainer from "../components/ContentContainer";
import ValidatedTextInput from "../components/ValidatedTextInput";
import TextButton from "../components/TextButton";

const ForgotPassword = () => {
  const { control } = useForm();
  return (
    <>
      <BackgroundImageBox source={null} />
      <ContentContainer>
        <HeaderText>
          OTP will be send to your registered phone number
        </HeaderText>
        <ValidatedTextInput
          control={control}
          name={"phoneNumber"}
          placeholder={"Phone Number"}
        />
        <ValidatedTextInput
          control={control}
          name={"otp"}
          placeholder={"OTP Code"}
        />
        <TextButton>Send OTP</TextButton>
        <Pressable>
          <Text style={styles.resendButton}>Resend OTP</Text>
        </Pressable>
      </ContentContainer>
    </>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  resendButton: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 15,
  },
});
