import { StyleSheet, View, Text, Pressable, ScrollView } from "react-native";
import React from "react";
import { Control, useForm } from "react-hook-form";

import HeaderText from "../components/text_components/HeaderText";
import ValidatedTextInput from "../components/ValidatedTextInput";
import TextButton from "../components/TextButton";
import BackgroundImageBox from "../components/BackgroundImageBox";
import ContentContainer from "../components/ContentContainer";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import { useAppDispatch } from "../hooks";
import { updateUserData } from "../features/userSlice";

type InputFieldsProps = {
  control: Control<any>;
  password: string;
};

const InputFields = ({ control, password }: InputFieldsProps) => {
  return (
    <>
      <ValidatedTextInput
        control={control}
        name="name"
        placeholder="Full Name"
        rules={{
          required: "Full name is required.",
        }}
      />
      <ValidatedTextInput
        control={control}
        name="identityCardNumber"
        placeholder="Identity Card Number"
        rules={{
          required: "Identity card number is required.",
          pattern: {
            value: /^\d{12}$/,
            message: "Identity card number must contain 12 digits.",
          },
        }}
      />
      <ValidatedTextInput
        control={control}
        name="phoneNumber"
        placeholder="Phone Number"
        rules={{
          required: "Phone number is required.",
          pattern: {
            value: /^01\d{8,9}$/,
            message: "Phone number should be in the 01XXXXXXXX format.",
          },
        }}
      />
      <ValidatedTextInput
        control={control}
        name="emailAddress"
        placeholder="Email Address"
        rules={{
          required: "Email address is required.",
          pattern: {
            value: /^[\w-\.]+@([\w-]+\.)com$/,
            message: "Invalid Email Address.",
          },
        }}
      />
      <ValidatedTextInput
        control={control}
        name="password"
        placeholder="Password"
        rules={{
          required: "Password is required.",
          minLength: {
            value: 8,
            message: "Password must contain at least 8 characters.",
          },
        }}
        secureTextEntry={true}
      />
      <ValidatedTextInput
        control={control}
        name="confirmPassword"
        placeholder="Confirm Password"
        rules={{
          validate: (value) =>
            value === password
              ? true
              : "Those passwords did not match. Try Again.",
        }}
        secureTextEntry={true}
      />
    </>
  );
};

type SignUpFormData = {
  name: string;
  identityCardNumber: string;
  emailAddress: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
};

const SignUp = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "SignUp">) => {
  const { handleSubmit, control, watch } = useForm<SignUpFormData>({
    defaultValues: {
      name: "Bobby",
      identityCardNumber: "060712110533",
      emailAddress: "test@gmail.com",
      phoneNumber: "0123456789",
      password: "123456789",
      confirmPassword: "123456789",
    },
  });

  const dispatch = useAppDispatch();

  const password = watch("password");

  const handleSignUp = async (data: SignUpFormData) => {
    const userCollection = firestore().collection("Users");

    console.log(
      "Checking whether user's identity card number has been used by existing users ..."
    );

    // Every citizen can only sign up for an account
    try {
      const querySnapshot = await userCollection
        .where("identityCardNumber", "==", data.identityCardNumber)
        .get();

      if (!querySnapshot.empty) {
        console.log("Identity card number already used by existing user.");
        return;
      }
    } catch (error) {
      console.error(error);
    }

    console.log("Preparing to sign new user up ...");

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        data.emailAddress,
        data.password
      );

      console.log(userCredential.user.email, "Signed up successfully.");

      console.log("Adding user document to firestore ...");

      try {
        const userData = {
          uid: userCredential.user.uid,
          name: data.name,
          identityCardNumber: data.identityCardNumber,
          phoneNumber: data.phoneNumber,
          emailAddress: data.emailAddress,
        };
        await userCollection.add(userData);

        console.log("User's document has been added successfully.");

        dispatch(updateUserData(userData));
      } catch (error) {
        console.error(error);
        return;
      }
    } catch (error) {
      console.error(error);
      return;
    }
  };

  return (
    <ScrollView>
      <BackgroundImageBox
        style={{ height: "20%" }}
        source={require("../assets/background/register.png")}
      ></BackgroundImageBox>
      <ContentContainer>
        <HeaderText>Register Now</HeaderText>
        <InputFields control={control} password={password} />
        <TextButton onPress={handleSubmit(handleSignUp)}>Sign up</TextButton>
        <View style={styles.DisclaimerPrivacyLabel}>
          <Text>By continuing, I agree to the</Text>
          <Pressable onPress={() => navigation.navigate("DisclaimerPrivacy")}>
            <Text style={{ color: "#FF8D13" }}>
              Disclaimer & Privacy Policy
            </Text>
          </Pressable>
        </View>
      </ContentContainer>
    </ScrollView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  DisclaimerPrivacyLabel: {
    marginTop: 10,
    marginBottom: 90,
    alignItems: "center",
  },
  ErrorText: {
    color: "red",
  },
});
