import { Platform, StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import ContentContainer from "../components/ContentContainer";
import PrimaryText from "../components/text_components/PrimaryText";
import ValidatedTextInput from "../components/ValidatedTextInput";
import TextButton from "../components/TextButton";

import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerResult } from "expo-image-picker";

import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";

const CreateActivity = ({
  navigation,route,
}: NativeStackScreenProps<RootStackParamList, "CreateActivity">) => {
  type ActivityProps = {
    id: string;
    logo?: string;
    name: string;
    description: string;
  };

  const { control, handleSubmit } = useForm<ActivityProps>();
  const dispatch = useAppDispatch();
  const ownUserId = useAppSelector((state) => state.user.data?.uid);

  const [image, setImage] = useState<string | null>(null);
  const [availableAdmins, setAvailableAdmins] = useState<any[]>([]);

  const handleCreateActivity = async (data: ActivityProps) => {
    if (!ownUserId) {
      console.error("Current user ID is required.");
      return;
    }

    if (image) {
      try {
        const uploadedImageUrl = await uploadImage(image);
        data = { ...data, logo: uploadedImageUrl };
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    const activityRef = firestore().collection("Activities").doc();
    data = { ...data };

    await activityRef.set(data);

    const usersSnapshot = await firestore().collection("Users").get();
    const batch = firestore().batch();

    const ownUserDoc = usersSnapshot.docs.find(
      (doc) => doc.data().uid === ownUserId
    );
    if (ownUserDoc) {
      batch.update(ownUserDoc.ref, {
        adminOf: firestore.FieldValue.arrayUnion(activityRef.id),
      });
    }

    await batch.commit();

    // navigation.navigate("ActivityInfo", { ...data, id: activityRef.id });
  };

  const uploadImage = async (uri: string) => {
    const filename = uri.substring(uri.lastIndexOf("/") + 1);
    const reference = storage().ref(`activityLogo/${filename}`);
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
        <View style={{ paddingTop: 10 }}>
          <PrimaryText>Activity Name</PrimaryText>
          <ValidatedTextInput
            name={"name"}
            control={control}
            placeholder="Name"
            rules={{ required: "Activity name is required." }}
          />
        </View>
        <View style={{ flex: 1, paddingTop: 10, paddingBottom: 10 }}>
          <PrimaryText>Activity Description</PrimaryText>
          <ValidatedTextInput
            name={"description"}
            control={control}
            style={styles.textArea}
            placeholder="Description"
            rules={{ required: "Activity description is required." }}
            maxLength={300}
            multiline={true}
          />
        </View>
        <TextButton onPress={handleSubmit(handleCreateActivity)}>
          Create
        </TextButton>
      </ContentContainer>
    </KeyboardAwareScrollView>
  );
};

export default CreateActivity;

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
    borderRadius: 10,
  },
});
