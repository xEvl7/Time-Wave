import { StyleSheet, Image, View, Text } from "react-native";
import React from "react";
import PrimaryText from "../components/text_components/PrimaryText";
import ContentContainer from "../components/ContentContainer";
import { useAppSelector } from "../hooks";
import RightDrop from "../components/RightDrop";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import { USER_DATA } from "../constants"; 
import { useAppDispatch } from "../hooks";
import auth from "@react-native-firebase/auth";
import * as SecureStore from "expo-secure-store";
import { logOut } from "../features/userSlice";


const Profile = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Profile">) => {
  const name = useAppSelector((state) => state.user.data?.name);
  const email = useAppSelector((state) => state.user.data?.emailAddress);  
  const dispatch = useAppDispatch();

  

  const HandleLogout = async () =>{
    console.log("logout button activated");
    console.log(`state out?: `,userData);
    try {          
      await SecureStore.deleteItemAsync(USER_DATA);
      await auth().signOut();  
      console.log("reset Root");
      console.log("parent of profile is ", parent);
      dispatch(logOut());      

      console.log("has successfully signed out.");
    } catch (error) {
      console.error(error);
      console.log("error signing out");
      return;
    } 
  };

  
  return (
    <ContentContainer style={{ flex: 1 }}>
      <Image source={require("../assets/profile-picture.png")} />
      <Field label="Name">{name}</Field>
      <Field label="Email Address">{email}</Field>
      <RightDrop
        onNavigate={() => navigation.navigate("CreateCommunity")}
        title="Community"
      >
        Create a new community
      </RightDrop>

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
    <View>
      <Text>{label}</Text>
      <PrimaryText>{children || ""}</PrimaryText>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  fieldContainer: {},
});
