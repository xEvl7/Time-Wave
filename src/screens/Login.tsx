import { Pressable, StyleSheet, Text, View, Image } from "react-native";
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

  const handleLogin = async (data: FormData) => {
    // @todo Indicate sign in process is running in UI

    console.log("Signing in user ...");

    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        data.emailAddress,
        data.password
      );

      console.log(userCredential.user.email, "has successfully signed in.");
    } catch (error) {
      console.error(error);
      return;
    }
    // @todo Display error if login failed

    console.log("Fetching user's data ...");

    try {
      await dispatch(fetchUserData(data.emailAddress)).unwrap();
    } catch (error) {
      console.error(error);
      return;
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
          <Text style={{ marginTop: 30, marginBottom: 20 }}>Log in with:</Text>
          <View style={styles.thirdPartyAuthContainer}>
            <Pressable>
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
