import { StyleSheet, Text, Pressable, View } from "react-native";
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
      <View style={styles.container}>
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
      </View>
    </>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  resendButton: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 15,
    color: "#FF8D13"
  },
});
