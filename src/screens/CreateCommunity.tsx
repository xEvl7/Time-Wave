import { Platform, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";

import ContentContainer from "../components/ContentContainer";
import PrimaryText from "../components/text_components/PrimaryText";
import ValidatedTextInput from "../components/ValidatedTextInput";
import RightDrop from "../components/RightDrop";
import TextButton from "../components/TextButton";

import { CommunityProps, createCommunity } from "../features/communitySlice";

import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../hooks";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import { RouteProp, useRoute } from "@react-navigation/native";

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import * as ImagePicker from 'expo-image-picker';

type CreateCommunityRouteProp = RouteProp<RootStackParamList, 'CreateCommunity'>;

const CreateCommunity = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "CreateCommunity">) => {

  const route = useRoute<CreateCommunityRouteProp>();
  const { selectedAdmins } = route.params ?? { selectedAdmins: [] };

  const { control, handleSubmit } = useForm<CommunityProps>();
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.data?.name);

  const handleCreateCommunity = async (data: CommunityProps) => {
    // if (userId) data = { ...data, admins: [userId] };
    if (userId) {
      data = { ...data, admins: [userId, ...selectedAdmins.map(admin => admin.name)] };
    }
    await dispatch(createCommunity(data));
    navigation.navigate("CommunityInfo", data);
  };

  const [image, setImage] = useState(null);

  // useEffect(() => {
  //   (async () => {
  //     if (Platform.OS !== 'web') {
  //       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //       if (status !== 'granted') {
  //         alert('Sorry, we need camera roll permissions to make this work!');
  //       }
  //     }
  //   })();
  // }, []);

  // const pickImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   console.log(result);

  //   // if (!result.canceled) {
  //   //   setImage(result.uri);
  //   //   uploadImage(result.uri);
  //   // }
  // };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      extraScrollHeight={20}
    >
      <ContentContainer style={{}}>
        <View style={styles.coverPhotoContainer}>
          {/* {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />} */}
          <Text style={{ color: '#BCB9B9', fontSize: 18 }}>+ Add a cover photo</Text>
        </View>
        {/* <TextButton onPress={pickImage}>Pick an image from camera roll</TextButton> */}
        <View style={{ paddingTop: 10 }}>
          <PrimaryText>Community Name</PrimaryText>
          <ValidatedTextInput
            name={"name"}
            control={control}
            placeholder="Name"
            rules={{ required: "Community name is required." }}
          />
        </View>
        <View style={{ flex: 0.5, paddingTop: 10, paddingBottom: 10 }}>
          <PrimaryText>Community Description</PrimaryText>
          <ValidatedTextInput
            name={"description"}
            control={control}
            style={styles.textArea}
            placeholder="Description"
            rules={{ required: "Community description is required." }}
            maxLength={300}
            multiline={true}
          />
        </View>
        <RightDrop
          onNavigate={() => navigation.navigate('SelectAdmin')}
          title="Admins"
        >
          {selectedAdmins.length > 0
            ? selectedAdmins.map((admin) => admin.name).join(', ')
            : 'Select from the list'}
        </RightDrop>
        <TextButton onPress={handleSubmit(handleCreateCommunity)}>
          Create
        </TextButton>
      </ContentContainer>
    </KeyboardAwareScrollView>
  );
};

export default CreateCommunity;

const styles = StyleSheet.create({
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
    paddingVertical: 10,
    flex: 1,
  },
  coverPhotoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF8F8',
    flex: 1,
    borderColor: '#E3E0E0',
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 10,
    padding: 20,
  },
});
