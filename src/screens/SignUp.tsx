import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import React from "react";
import { Control, useForm } from "react-hook-form";

import HeaderText from "../components/text_components/HeaderText";
import ValidatedTextInput from "../components/ValidatedTextInput";
import TextButton from "../components/TextButton";
import BackgroundImageBox from "../components/BackgroundImageBox";
import ContentContainer from "../components/ContentContainer";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import { useAppDispatch } from "../hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
      {/* <ValidatedTextInput
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
      /> */}
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
  // identityCardNumber: string;
  emailAddress: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
};

const SignUp = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "SignUp">) => {
  const { handleSubmit, control, watch, setError } = useForm<SignUpFormData>({
    defaultValues: {
      name: "YF",
      // identityCardNumber: "010666016666",
      emailAddress: "yf828w@gmail.com",
      phoneNumber: "01166666666",
      password: "123456789",
      confirmPassword: "123456789",
    },
  });

  const dispatch = useAppDispatch();

  const password = watch("password");

  const [emailExists, setEmailExists] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSignUp = async (data: SignUpFormData) => {
    setLoading(true);
    const userCollection = firestore().collection("Users");

    try {
      // Check phone number uniqueness
      const phoneSnapshot = await userCollection
        .where("phoneNumber", "==", data.phoneNumber)
        .get();

      if (!phoneSnapshot.empty) {
        setError("phoneNumber", {
          type: "manual",
          message: "This phone number is already registered.",
        });
        setLoading(false);
        return;
      }

      console.log("Creating new Firebase Auth user...");

      const userCredential = await auth().createUserWithEmailAndPassword(
        data.emailAddress,
        data.password
      );

      // Send verification email （commented out for testing purposes）
      // await userCredential.user.sendEmailVerification();
      // console.log("Verification email sent to:", data.emailAddress);

      const userData = {
        uid: userCredential.user.uid,
        name: data.name,
        phoneNumber: data.phoneNumber,
        emailAddress: data.emailAddress,
        points: 0,
        logo: null,
        isFeedbackFilled: false,
        adminOf: [],
        volunteerOf: [],
      };

      // Save in Firestore
      await firestore()
        .collection("Users")
        .doc(userCredential.user.uid)
        .set(userData);
      dispatch(updateUserData(userData));

      await AsyncStorage.setItem("hasSeenAppInfo", "false");

      console.log("User registered successfully:", userData);

      // Neutral success message
      Alert.alert(
        "Check Your Email",
        "We've sent you a verification link. Please verify your email before logging in."
      );

      navigation.navigate("LogIn");
    } catch (error: any) {
      console.error("SignUp Error:", error);

      // Neutral error handling
      if (error.code === "auth/email-already-in-use") {
        setError("emailAddress", {
          type: "manual",
          message: "This email cannot be used. Try another one or log in.",
        });
      } else if (error.code === "auth/invalid-email") {
        setError("emailAddress", {
          type: "manual",
          message: "Invalid email format.",
        });
      } else if (error.code === "auth/weak-password") {
        setError("password", {
          type: "manual",
          message: "Password is too weak (min 8 characters).",
        });
      } else {
        Alert.alert("SignUp Failed", "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      // 1. 获取 Google 帐号
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();

      if (!idToken) throw new Error("Google Sign-In failed: No idToken");

      // 2. 用 Google 凭证登录 Firebase
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(
        googleCredential
      );

      // 3. 在 Firestore 建立用户文档
      const userData = {
        uid: userCredential.user.uid,
        name: userCredential.user.displayName || "",
        emailAddress: userCredential.user.email || "",
        phoneNumber: userCredential.user.phoneNumber || "",
        points: 0,
        logo: userCredential.user.photoURL || null,
        isFeedbackFilled: false,
        adminOf: [],
        volunteerOf: [],
      };

      await firestore()
        .collection("Users")
        .doc(userCredential.user.uid)
        .set(userData, { merge: true });

      dispatch(updateUserData(userData));
      await AsyncStorage.setItem("hasSeenAppInfo", "false");

      console.log("Google SignUp Success:", userData);
      setLoading(false);
    } catch (error) {
      console.error("Google SignUp Error:", error);
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <BackgroundImageBox
        style={{ height: "20%" }}
        source={require("../assets/background/register.png")}
      ></BackgroundImageBox>
      <ContentContainer>
        <HeaderText>Register Now</HeaderText>
        {emailExists && (
          <Pressable
            onPress={() => navigation.navigate("LogIn")}
            style={{
              marginVertical: 10,
              padding: 10,
              backgroundColor: "#FFF3E0",
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#FF8D13",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#FF8D13",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Email is already in use. {"\n"}Click here go to Login.
            </Text>
          </Pressable>
        )}
        <InputFields control={control} password={password} />

        <TextButton onPress={handleSubmit(handleSignUp)} disabled={loading}>
          {loading ? "Signing up..." : "Sign up"}
        </TextButton>

        {/* <Pressable
          onPress={handleGoogleSignUp}
          style={{
            marginTop: 15,
            padding: 12,
            borderRadius: 8,
            backgroundColor: "#DB4437", // Google 红色
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            {loading ? "Loading..." : "Sign up with Google"}
          </Text>
        </Pressable> */}
        <View style={styles.alternativesContainer}>
          <Text style={{ marginTop: 10, marginBottom: 10 }}>
            Or sign up with:
          </Text>
          <View style={styles.thirdPartyAuthContainer}>
            <Pressable onPress={handleGoogleSignUp}>
              <Image source={require("../assets/logo/google-logo.png")}></Image>
            </Pressable>
            {/* <Pressable>
            <Image source={require("../assets/logo/apple-logo.png")}></Image>
          </Pressable> */}
            <Pressable>
              <Image
                source={require("../assets/logo/facebook-logo.png")}
              ></Image>
            </Pressable>
          </View>
        </View>

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
  alternativesContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  thirdPartyAuthContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
});
