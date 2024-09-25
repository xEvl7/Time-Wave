import { StyleSheet, Image, View, Text, TouchableOpacity } from "react-native";
import React , { useState } from 'react';
import PrimaryText from "../components/text_components/PrimaryText";
import ContentContainer from "../components/ContentContainer";
import { useAppSelector } from "../hooks";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";

import * as ImagePicker from "expo-image-picker";
import { ImagePickerResult } from "expo-image-picker";

import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";


import auth from "@react-native-firebase/auth";

const NewProfile = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "NewProfile">) => {
  const name = useAppSelector((state) => state.user.data?.name);
  const email = useAppSelector((state) => state.user.data?.emailAddress);
  const phone = useAppSelector((state) => state.user.data?.phoneNumber);
  const ic = useAppSelector((state) => state.user.data?.identityCardNumber);
  //const resetpassword = await auth().sendPasswordResetEmail(email: string);

  const [image, setImage] = useState<string | null>(null);

  const uploadImage = async (uri: string) => {
    const filename = uri.substring(uri.lastIndexOf("/") + 1);
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



  const pickImage = async () => {
    let result: ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    // Ensure result is properly typed
    if (!result.canceled && result.assets && result.assets[0].uri) {
      setImage(result.assets[0].uri);
    }

    if (image) {
      try {
        const uploadedImageUrl = await uploadImage(image);
      } catch (error) {
        console.error("Error uploading image:", error);
        // Optionally, handle the error or show a message to the user
      }
    }
  };

  return (
    <ContentContainer style={{ flex: 1 }}>
      <View style={styles.editcontainer}>
      <TouchableOpacity onPress={() => navigation.navigate("EditProfile")}>
      <Text style={{ color: '#FF8D13' }}>Edit</Text>
    </TouchableOpacity>
      </View>


      <View style={styles.centercontainer}>
      
      <TouchableOpacity onPress={pickImage}>
      <Image
      source={image ? { uri: image } : require("../assets/profile-picture.png")}
      style={styles.circleImage}
      />
      </TouchableOpacity>
      </View>
      <View style={styles.alternativesContainer}>
      <View style={styles.pointContainer}>
        <Text style={styles.boldtext}>Name:</Text>
        </View>
        <View style={styles.validityContainer}>
        <Text style={{ fontSize: 14}}>{name}</Text>
        </View>
        </View>
        <View style={styles.alternativesContainer}>
      <View style={styles.pointContainer}>
        <Text style={styles.boldtext}>IC:</Text>
        </View>
        <View style={styles.validityContainer}>
        <Text style={{ fontSize: 14}}>{ic}</Text>
        </View>
        </View>
        <View style={styles.alternativesContainer}>
      <View style={styles.pointContainer}>
        <Text style={styles.boldtext}>Phone No:</Text>
        </View>
        <View style={styles.validityContainer}>
        <Text style={{ fontSize: 14}}>{phone}</Text>
        </View>
        </View>
        <View style={styles.alternativesContainer}>
      <View style={styles.pointContainer}>
        <Text style={styles.boldtext}>Email:</Text>
        </View>
        <View style={styles.validityContainer}>
        <Text style={{ fontSize: 14}}>{email}</Text>
        </View>
        </View>
        <Text></Text>
        <Text></Text>
        <Text></Text>
      <View style={styles.alternativesContainer}>
      <View style={styles.pointContainer}>
      <Text>Change Password
      
      </Text>
      </View>

      <View style={styles.nextcontainer}>
      <TouchableOpacity onPress={() => navigation.navigate("ChangeYourPassword")}>
      <Image source={require("../assets/next_icon_orange.png")} />
      </TouchableOpacity>

      </View>
      </View>



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

export default NewProfile;

const styles = StyleSheet.create({
  boldtext:{fontWeight: "bold",fontSize: 16},
  fieldContainer: {},
  centercontainer: {
    
    marginBottom:10,
    marginLeft:20,
  
    alignItems: 'center', // 图像在垂直方向上右对齐
  },
  pointContainer: {
    justifyContent: "space-evenly",
    width: "35%",
    marginBottom:10,
  },
  validityContainer: {
    justifyContent: "space-evenly",
    width: "65%",
    marginBottom:10,
    marginLeft:20,
  },
  nextcontainer: {
    justifyContent: "space-evenly",
    width: "65%",
    marginBottom:10,
    marginLeft:20,
  
    alignItems: 'flex-end', // 图像在垂直方向上右对齐
  },
  editcontainer: {
    justifyContent: "space-evenly",
    width: "100%",
    marginBottom:10,
    marginLeft:20,
  
    alignItems: 'flex-end', // 图像在垂直方向上右对齐
  },
  verticleLine: {
    height: '100%',
    width: 1,
    backgroundColor: '#909090',
  },
  alternativesContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    marginTop: 10,
  },//container
  image: {
    width: 100, // 设置图片宽度
    height: 100, // 设置图片高度
  },
  circleImage: {
    width: 100, // 設置圖片的寬度
    height: 100, // 設置圖片的高度，確保寬高相等
    borderRadius: 100, // 設置圓角半徑為寬度的一半，使圖片顯示為圓形
    borderWidth: 2, // 可選：添加邊框寬度
    borderColor: '#E3E0E0', // 可選：邊框顏色
  },
});
