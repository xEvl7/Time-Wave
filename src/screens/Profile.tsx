import { StyleSheet, Image, View, Text } from "react-native";
import React from "react";
import PrimaryText from "../components/text_components/PrimaryText";
import ContentContainer from "../components/ContentContainer";
import { useAppSelector } from "../hooks";
import RightDrop from "../components/RightDrop";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";

const Profile = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Profile">) => {
  const name = useAppSelector((state) => state.user.data?.name);
  const email = useAppSelector((state) => state.user.data?.emailAddress);

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
