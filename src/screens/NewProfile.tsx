import { StyleSheet, Alert, Image, View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import ContentContainer from "../components/ContentContainer";
import { useAppSelector } from "../hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerResult } from "expo-image-picker";
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import auth from '@react-native-firebase/auth';

const NewProfile = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "NewProfile">) => {
  const name = useAppSelector((state) => state.user.data?.name);
  const email = useAppSelector((state) => state.user.data?.emailAddress);
  const phone = useAppSelector((state) => state.user.data?.phoneNumber);
  const ic = useAppSelector((state) => state.user.data?.identityCardNumber);
  const [image, setImage] = useState<string | null>(null); // 用户上传的图片
  const [logo, setLogo] = useState<string | null>(null); // Firebase 中的 logo URL
  const [loading, setLoading] = useState<boolean>(true);

  // 监听 Firebase 数据的变化
  useEffect(() => {
    const currentUserEmail = auth().currentUser?.email;
    if (currentUserEmail) {
      const usersRef = firestore().collection("Users");

      // 订阅 Firestore 数据变化
      const unsubscribe = usersRef.where("emailAddress", "==", currentUserEmail)
        .onSnapshot((querySnapshot) => {
          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              const userData = doc.data();
              setLogo(userData.logo); // 实时更新 logo
              setLoading(false); // 关闭加载状态
            });
          }
        });

      return () => unsubscribe(); // 组件卸载时取消订阅
    }
  }, []);

  // 上传图片到 Firebase Storage
  const uploadImage = async (uri: string) => {
    const timestamp = new Date().getTime();
    const filename = `image_${timestamp}.jpg`;
    const reference = storage().ref(`user/${filename}`);
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

  // 选择图片
  const pickImage = async () => {
    let result: ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      setImage(result.assets[0].uri); // 更新用户选择的图片
    }
  };

  // 保存图片并更新 Firebase 数据
  const savePicture = async () => {
    if (!image) {
      Alert.alert('No Image Selected', 'Please select an image before saving.');
      return;
    }

    Alert.alert(
      'Save picture',
      'Confirm?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Upload cancelled'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              const uploadedImageUrl = await uploadImage(image); // 上传图片
              console.log("Image uploaded to:", uploadedImageUrl);

              const usersRef = firestore().collection("Users");
              const currentUserEmail = auth().currentUser?.email;

              if (currentUserEmail) {
                const querySnapshot = await usersRef.where("emailAddress", "==", currentUserEmail).get();
                if (!querySnapshot.empty) {
                  querySnapshot.forEach(async (doc) => {
                    await usersRef.doc(doc.id).update({
                      logo: uploadedImageUrl, // 更新 logo URL
                      name: name,
                      phoneNumber: phone,
                      identityCardNumber: ic,
                    });
                  });
                  console.log("User logo updated successfully!");
                }
              }
            } catch (error) {
              console.error("Error uploading image or updating user data:", error);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return <Text>Loading...</Text>; // 显示加载状态
  }

  return (
    <ContentContainer style={{ flex: 1 }}>
      <View style={styles.editcontainer}>
        <TouchableOpacity onPress={() => navigation.navigate("EditProfile")}>
          <Text style={{ color: "#FF8D13" }}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.centercontainer}>
        <TouchableOpacity onPress={async () => {
          await pickImage();
        }}>
          <Image
            source={image ? { uri: image } : (logo ? { uri: logo } : require("../assets/profile-picture.png"))}
            style={styles.circleImage}
          />
        </TouchableOpacity>
      </View>

      {/* 用户信息展示部分 */}
      <View style={styles.alternativesContainer}>
        <View style={styles.pointContainer}>
          <Text style={styles.boldtext}>Name:</Text>
        </View>
        <View style={styles.validityContainer}>
          <Text style={{ fontSize: 14 }}>{name}</Text>
        </View>
      </View>

      <View style={styles.alternativesContainer}>
        <View style={styles.pointContainer}>
          <Text style={styles.boldtext}>IC:</Text>
        </View>
        <View style={styles.validityContainer}>
          <Text style={{ fontSize: 14 }}>{ic}</Text>
        </View>
      </View>

      <View style={styles.alternativesContainer}>
        <View style={styles.pointContainer}>
          <Text style={styles.boldtext}>Phone No:</Text>
        </View>
        <View style={styles.validityContainer}>
          <Text style={{ fontSize: 14 }}>{phone}</Text>
        </View>
      </View>

      <View style={styles.alternativesContainer}>
        <View style={styles.pointContainer}>
          <Text style={styles.boldtext}>Email:</Text>
        </View>
        <View style={styles.validityContainer}>
          <Text style={{ fontSize: 14 }}>{email}</Text>
        </View>
      </View>

      <View style={styles.alternativesContainer}>
        <View style={styles.pointContainer}>
          <Text>Change Password</Text>
        </View>
        <View style={styles.nextcontainer}>
          <TouchableOpacity onPress={() => navigation.navigate("ChangeYourPassword")}>
            <Image source={require("../assets/next_icon_orange.png")} />
          </TouchableOpacity>
        </View>
      </View>

      {image && (
        <TouchableOpacity onPress={savePicture} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Picture</Text>
        </TouchableOpacity>
      )}
    </ContentContainer>
  );
};

export default NewProfile;

const styles = StyleSheet.create({
  boldtext: { fontWeight: "bold", fontSize: 16 },
  centercontainer: {
    marginBottom: 10,
    marginLeft: 20,
    alignItems: "center",
  },
  pointContainer: {
    justifyContent: "space-evenly",
    width: "35%",
    marginBottom: 10,
  },
  validityContainer: {
    justifyContent: "space-evenly",
    width: "65%",
    marginBottom: 10,
    marginLeft: 20,
  },
  nextcontainer: {
    justifyContent: "space-evenly",
    width: "65%",
    marginBottom: 10,
    marginLeft: 20,
    alignItems: "flex-end",
  },
  editcontainer: {
    justifyContent: "space-evenly",
    width: "100%",
    marginBottom: 10,
    marginLeft: 20,
    alignItems: "flex-end",
  },
  alternativesContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    marginTop: 10,
  },
  circleImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#E3E0E0",
  },
  saveButton: {
    backgroundColor: "#FF8D13",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
