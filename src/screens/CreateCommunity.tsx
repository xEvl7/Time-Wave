import { Platform, StyleSheet, Text, View, Image } from "react-native";
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

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import * as ImagePicker from "expo-image-picker";
import { ImagePickerResult } from "expo-image-picker";

import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";

type CreateCommunityRouteProp = RouteProp<
  RootStackParamList,
  "CreateCommunity"
>;

const CreateCommunity = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "CreateCommunity">) => {
  const route = useRoute<CreateCommunityRouteProp>();
  const { selectedAdmins } = route.params ?? { selectedAdmins: [] };

  const { control, handleSubmit } = useForm<CommunityProps>();
  const dispatch = useAppDispatch();
  const ownUserId = useAppSelector((state) => state.user.data?.uid);

  const [image, setImage] = useState<string | null>(null);
  const [availableAdmins, setAvailableAdmins] = useState<any[]>([]);

  const handleCreateCommunity = async (data: CommunityProps) => {
    if (!ownUserId) {
      console.error("Current user ID is required.");
      return;
    }

    // Include the current user and selected admins in the community
    data = {
      ...data,
      admins: [ownUserId, ...selectedAdmins.map((admin) => admin.uid)],
    };

    if (image) {
      try {
        const uploadedImageUrl = await uploadImage(image);
        data = { ...data, logo: uploadedImageUrl };
      } catch (error) {
        console.error("Error uploading image:", error);
        // Optionally, handle the error or show a message to the user
      }
    }

    // Generate a new document reference to get a unique ID
    const communityRef = firestore().collection("Communities").doc();
    // const newCommunityId = communityRef.id;

    data = { ...data };

    // Save the community document with the generated ID
    await communityRef.set(data);

    // Find and update users
    const usersSnapshot = await firestore().collection("Users").get();
    const batch = firestore().batch();

    // Update selected admins' documents
    selectedAdmins
      .filter((admin) => admin.uid !== ownUserId) // Filter out the current user
      .forEach((admin) => {
        const userDoc = usersSnapshot.docs.find(
          (doc) => doc.data().uid === admin.uid
        );
        if (userDoc) {
          batch.update(userDoc.ref, {
            adminOf: firestore.FieldValue.arrayUnion(communityRef.id),
          });
        }
      });

    // Update the current user's document
    const ownUserDoc = usersSnapshot.docs.find(
      (doc) => doc.data().uid === ownUserId
    );
    if (ownUserDoc) {
      batch.update(ownUserDoc.ref, {
        adminOf: firestore.FieldValue.arrayUnion(communityRef.id),
      });
    }

    await batch.commit();

    // Navigate to CommunityInfo screen with the new community ID
    console.log("CommunityInfo", { ...data, id: communityRef.id });
    navigation.navigate("CommunityInfo", { ...data, id: communityRef.id });
  };

  const uploadImage = async (uri: string) => {
    const filename = uri.substring(uri.lastIndexOf("/") + 1);
    const reference = storage().ref(`communityLogo/${filename}`);
    const task = reference.putFile(uri);

    try {
      await task;
      const url = await reference.getDownloadURL();
      return url;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw error;
    }
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }

      // Load available admins from Firestore
      const usersSnapshot = await firestore().collection("Users").get();
      const currentUserDoc = usersSnapshot.docs.find(
        (doc) => doc.data().uid === ownUserId
      );
      const currentUserAdminOf = currentUserDoc
        ? currentUserDoc.data().adminOf || []
        : [];

      const eligibleAdmins = usersSnapshot.docs
        .filter((doc) => {
          const userData = doc.data();
          return (
            userData.uid !== ownUserId &&
            !userData.adminOf?.some((id: string) =>
              currentUserAdminOf.includes(id)
            )
          );
        })
        .map((doc) => ({
          uid: doc.data().uid,
          name: doc.data().name,
        }));

      setAvailableAdmins(eligibleAdmins);
    })();
  }, [ownUserId]);

  const pickImage = async () => {
    let result: ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Ensure result is properly typed
    if (!result.canceled && result.assets && result.assets[0].uri) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      extraScrollHeight={20}
    >
      <ContentContainer style={{ paddingTop: 10 }}>
        <View style={styles.logoContainer}>
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 300, height: 200 }}
            />
          )}
          <Text style={{ color: "#BCB9B9", fontSize: 18 }} onPress={pickImage}>
            + Add a cover photo
          </Text>
        </View>
        {/* <TextButton onPress={pickImage}>
          Pick an image from camera roll
        </TextButton> */}
        <View style={{ paddingTop: 10 }}>
          <PrimaryText>Community Name</PrimaryText>
          <ValidatedTextInput
            name={"name"}
            control={control}
            placeholder="Name"
            rules={{ required: "Community name is required." }}
          />
        </View>
        <View style={{ flex: 1, paddingTop: 10, paddingBottom: 10 }}>
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
          onNavigate={() => navigation.navigate("SelectAdmin")}
          title="Admins"
        >
          {selectedAdmins.length > 0
            ? selectedAdmins.map((admin) => admin.name).join(", ")
            : "Select from the list"}
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
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAF8F8",
    flex: 1,
    borderColor: "#E3E0E0",
    borderWidth: 1,
    // marginBottom: 20,
    borderRadius: 10,
    // padding: 20,
  },
});
