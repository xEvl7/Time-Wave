import { StyleSheet, Text, View } from "react-native";
import React from "react";

import ContentContainer from "../components/ContentContainer";
import PrimaryText from "../components/text_components/PrimaryText";
import ValidatedTextInput from "../components/ValidatedTextInput";
import { useForm } from "react-hook-form";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import RightDrop from "../components/RightDrop";
import TextButton from "../components/TextButton";
import { useAppDispatch, useAppSelector } from "../hooks";
import { CommunityProps, createCommunity } from "../features/communitySlice";

const CreateCommunity = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "CreateCommunity">) => {
  const { control, handleSubmit } = useForm<CommunityProps>();
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.data?.name);

  const handleCreateCommunity = async (data: CommunityProps) => {
    if (userId) data = { ...data, admins: [userId] };

    await dispatch(createCommunity(data));

    navigation.navigate("CommunityInfo", data);
  };

  return (
    <ContentContainer style={{ flex: 1 }}>
      <View style={styles.coverPhotoContainer}>
        <Text style={{ color: "#BCB9B9" }}>+ Add a cover photo</Text>
      </View>
      <View style={{ flex: 0.75, paddingTop: 10 }}>
        <PrimaryText>Community Name</PrimaryText>
        <ValidatedTextInput
          name={"name"}
          control={control}
          placeholder="Name"
          rules={{ required: "Community name is required." }}
        />
      </View>
      <View style={{ flex: 1 }}>
        <PrimaryText>Community Description</PrimaryText>
        <ValidatedTextInput
          name={"description"}
          control={control}
          style={styles.textArea}
          placeholder=""
          maxLength={300}
          multiline={true}
        />
      </View>
      <RightDrop
        onNavigate={() => navigation.navigate("SelectAdmin")}
        title="Admins"
      >
        Select from your friend list
      </RightDrop>
      <TextButton onPress={handleSubmit(handleCreateCommunity)}>
        Create
      </TextButton>
    </ContentContainer>
  );
};

export default CreateCommunity;

const styles = StyleSheet.create({
  textArea: {
    backgroundColor: "#FAF8F8",
    minHeight: 120,
    textAlignVertical: "top",
    paddingVertical: 10,
  },
  coverPhotoContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAF8F8",
    flex: 1,
    borderColor: "#E3E0E0",
    borderWidth: 1,
  },
});
