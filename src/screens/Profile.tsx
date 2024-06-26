import React from "react";
import { StyleSheet, Image, View, Text, Pressable } from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";

import { useAppSelector, useAppDispatch } from "../hooks";
import { USER_DATA } from "../constants";
import auth from "@react-native-firebase/auth";
import * as SecureStore from "expo-secure-store";

import { logOut } from "../features/userSlice";

import PrimaryText from "../components/text_components/PrimaryText";
import ContentContainer from "../components/ContentContainer";
import RightDrop from "../components/RightDrop";
import SecondaryText from "../components/text_components/SecondaryText";

const Profile = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Profile">) => {

  const { name, emailAddress } = useAppSelector((state) => state.user.data) || {};
  const dispatch = useAppDispatch();

  const HandleLogout = async () => {
    console.log("logout button activated");
    try {
      await SecureStore.deleteItemAsync(USER_DATA);
      await auth().signOut();
      console.log("reset Root");
      dispatch(logOut());

      console.log("has successfully signed out.");
    } catch (error) {
      console.error(error);
      console.log("error signing out");
      return;
    }
  };

  return (
    <ContentContainer>
      <View style={styles.centered}>
        <Image source={require("../assets/profile-picture.png")} />
        <Field label="Name">{name}</Field>
        <Field label="Email Address">{emailAddress}</Field>
      </View>
      <View style={styles.divider}></View>
      <RightDrop
        onNavigate={() => navigation.navigate("CreateCommunity")}
        title="Community"
      >
        Create a new community
      </RightDrop>

      <View style={styles.divider}></View>
      <RightDrop
        onNavigate={() => navigation.navigate("RewardsPage")}
        title="My Account"
      >
        Level 2
      </RightDrop>
      <View style={styles.divider}></View>
      <RightDrop
        onNavigate={() => navigation.navigate("Settings")}
        title="General"
      >
        Settings
      </RightDrop>
      <View style={styles.divider}></View>
      <RightDrop
        onNavigate={() => navigation.navigate("AdminControl")}
        title="Admin"
      >
        Control
      </RightDrop>
      <View style={styles.divider}></View>
      <RightDrop
        onNavigate={() => navigation.navigate("AppInfo")}
        title="About Us"
      >
        App Info
      </RightDrop>
      <RightDrop
        onNavigate={() => navigation.navigate("Benefits")}
        title=""
      >
        Banefits of the App
      </RightDrop>
      <View style={styles.divider}></View>

      <Pressable onPress={HandleLogout}>
        <Text style={{ color: "#7BB8A3" }}>
          Click here to Logout
        </Text>
      </Pressable>
    </ContentContainer>
  );
};

type FieldProps = {
  label: string;
  children: string | undefined;
};

const Field = ({ label, children }: FieldProps) => {
  return (
    <View style={styles.fieldContainer}>
      <View style={styles.labelContainer}>
        <SecondaryText>{label}</SecondaryText>
      </View>
      <View style={styles.childrenContainer}>
        <PrimaryText>{children || ""}</PrimaryText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    alignItems: "center",
  },
  fieldContainer: {
    marginBottom: 10,
  },
  labelContainer: {
    alignItems: "center",
  },
  childrenContainer: {
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "lightgray",
    marginVertical: 10,
  }
});


export default Profile;