import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import auth from "@react-native-firebase/auth";

import TextButton from "../components/TextButton";
import HeaderText from "../components/text_components/HeaderText";
import BackgroundImageBox from "../components/BackgroundImageBox";
import ContentContainer from "../components/ContentContainer";
import ValidatedTextInput from "../components/ValidatedTextInput";
import { useForm } from "react-hook-form";
import { fetchUserData } from "../features/userSlice";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import { useAppDispatch, useAppSelector } from "../hooks";

// type FormData = {
//   emailAddress: string;
//   password: string;
// };

let numberofItems=6;
const generateGridItems = (numberOfItems) => {
  const gridItems = [];
  for (let i = 0; i < numberOfItems; i++) {
    gridItems.push(
      <View style={styles.gridItem} key={i}>
        <Image
          source={require("../assets/my-rewards.png")}
          style={styles.image}
        />
        <Text style={styles.text}>Grid Item {i + 1}</Text>
      </View>
    );
  }
  return gridItems;
}
const Grid = ({ numberOfItems }) => {
  const gridItems = generateGridItems(numberOfItems);

  return (
    <View style={styles.gridContainer}>
      {gridItems}
    </View>
  );
}


export default function Login({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Community">) {
  return (
    <View>
      <View style={styles.gridContainer}>
        {gridItems}
      </View>
      <ContentContainer>
        <HeaderText>Level</HeaderText>
        
        {/* <ValidatedTextInput
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
        <TextButton
          style={{ marginTop: 2 }}
          onPress={handleSubmit(handleLogin)}
        >
          Login
        </TextButton>
        <View style={styles.alternativesContainer}>
          <Pressable onPress={() => navigation.navigate("ForgotPassword")}>
            <Text style={{ fontSize: 12 }}>Forgot Password</Text>
          </Pressable>
          <Text style={{ marginTop: 30, marginBottom: 20 }}>Log in with:</Text>
          <View style={styles.thirdPartyAuthContainer}>
            <Pressable>
              <Image source={require("../assets/logo/google-logo.png")}></Image>
            </Pressable>
            <Pressable>
              <Image source={require("../assets/logo/apple-logo.png")}></Image>
            </Pressable>
            <Pressable>
              <Image
                source={require("../assets/logo/facebook-logo.png")}
              ></Image>
            </Pressable>
          </View>
          <View style={styles.registerContainer}>
            <Text>New member?</Text>
            <Pressable onPress={() => navigation.navigate("SignUp")}>
              <Text style={{ color: "#7BB8A3" }}>
                Click here to register now
              </Text> */}
            {/* </Pressable>
          </View>
        </View> */}
      </ContentContainer>
      <ContentContainer>
      <TextButton onPress={() => navigation.navigate("MyRewardsDetails")}>
          My Rewards Details
        </TextButton>
      </ContentContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    height: 150,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -25}, {translateY: -8}],
  },
});
