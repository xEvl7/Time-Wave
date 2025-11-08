import { Pressable, StyleSheet, Text, View, Image, Alert } from "react-native";
import auth from "@react-native-firebase/auth";

import TextButton from "../components/TextButton";
import HeaderText from "../components/text_components/HeaderText";
import BackgroundImageBox from "../components/BackgroundImageBox";
import ContentContainer from "../components/ContentContainer";
import ValidatedTextInput from "../components/ValidatedTextInput";

import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchUserData } from "../features/userSlice";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { GoogleSignin } from "@react-native-google-signin/google-signin";

type FormData = {
  emailAddress: string;
  password: string;
};

export default function Login({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "LogIn">) {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      emailAddress: "test@gmail.com",
      password: "123456789",
    },
  });

  // const userData = useAppSelector((state) => state.user.data);
  const dispatch = useAppDispatch();

  const MAX_ATTEMPTS = 5;
  let attempts = 0;
  let lastAttemptTime = 0;

  const handleLogin = async (data: FormData) => {
    console.log("Signing in user ...");
    const now = Date.now();

    // Throttling: allow only 5 attempts per minute
    if (attempts >= MAX_ATTEMPTS && now - lastAttemptTime < 60_000) {
      Alert.alert(
        "Too Many Attempts",
        "Please wait a minute before trying again."
      );
      return;
    }

    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        data.emailAddress,
        data.password
      );

      // Require email verification (commented out for testing purposes)
      // if (userCredential.user && !userCredential.user.emailVerified) {
      //   await auth().signOut();
      //   Alert.alert(
      //     "Email Not Verified",
      //     "Please verify your email before logging in. We’ve sent you a link."
      //   );
      //   await userCredential.user.sendEmailVerification();
      //   return;
      // }

      // Reset attempts if login successful
      attempts = 0;
      lastAttemptTime = 0;

      console.log(userCredential.user.email, "has successfully signed in.");

      // Fetch Firestore user data
      if (userCredential.user.email) {
        await dispatch(fetchUserData(userCredential.user.email)).unwrap();
      }
    } catch (error: any) {
      console.error("Login error:", error);

      attempts++;
      lastAttemptTime = now;

      // Neutral message → prevents user enumeration
      Alert.alert("Login Failed", "Invalid credentials or unverified account.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // 1. Check Google Play Services
      await GoogleSignin.hasPlayServices();

      // 2. Sign in and get the ID token
      const { idToken } = await GoogleSignin.signIn();
      if (!idToken) throw new Error("Google Sign-In failed: No idToken");

      // 3. Get Firebase credential
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // 4. Sign in with Firebase
      const userCredential = await auth().signInWithCredential(
        googleCredential
      );

      console.log("Google login success:", userCredential.user.email);

      // 5. Fetch user’s Firestore document
      await dispatch(fetchUserData(userCredential.user.uid)).unwrap();
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      extraScrollHeight={-300}
    >
      <BackgroundImageBox
        style={{ height: "38%" }}
        source={require("../assets/background/login.png")}
      ></BackgroundImageBox>
      <ContentContainer>
        <HeaderText>Sign In Now</HeaderText>
        <ValidatedTextInput
          name={"emailAddress"}
          placeholder={"Email"}
          control={control}
          rules={{
            required: "Email Address is required.",
            pattern: {
              value: /^[\w-\.]+@([\w-]+\.)com$/,
              message: "Invalid Email Address.",
            },
          }}
        />
        <ValidatedTextInput
          name={"password"}
          placeholder={"Password"}
          control={control}
          rules={{
            required: "Password is required.",
          }}
          secureTextEntry
        />
        <TextButton onPress={handleSubmit(handleLogin)}>Login</TextButton>
        <View style={styles.alternativesContainer}>
          <Pressable onPress={() => navigation.navigate("ForgotPassword")}>
            <Text style={{ fontSize: 12, color: "#FF8D13" }}>
              Forgot Password
            </Text>
          </Pressable>
          <Text style={{ marginTop: 30, marginBottom: 20 }}>
            Or log in with:
          </Text>
          <View style={styles.thirdPartyAuthContainer}>
            <Pressable onPress={handleGoogleLogin}>
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
          <View style={styles.registerContainer}>
            <Text>New member?</Text>
            <Pressable onPress={() => navigation.navigate("SignUp")}>
              <Text style={{ color: "#FF8D13" }}>
                Click here to register now
              </Text>
            </Pressable>
          </View>
        </View>
      </ContentContainer>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  alternativesContainer: {
    alignItems: "center",
    // marginTop: 20,
  },
  thirdPartyAuthContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  registerContainer: {
    flexDirection: "row",
    minWidth: "78%",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
});
