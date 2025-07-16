import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  View,
  Text,
  Pressable,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import { useAppSelector, useAppDispatch } from "../hooks";
import { USER_DATA } from "../constants";
import auth from "@react-native-firebase/auth";
import * as SecureStore from "expo-secure-store";
import {
  fetchUserContributionData,
  fetchUserData,
  logOut,
} from "../features/userSlice";
import RightDrop from "../components/RightDrop";
import { RootState } from "../store";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerResult } from "expo-image-picker";
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Profile">) => {
  const { name, emailAddress } =
    useAppSelector((state) => state.user.data) || {};
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [logo, setLogo] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const contributionData = useAppSelector(
    (state: RootState) => state.user.contributionData
  );
  const currentDate = new Date();
  const selectedYear = currentDate.getFullYear();
  const selectedMonth = currentDate.toLocaleString("en-US", { month: "short" });
  const totalContrHours =
    contributionData?.[selectedYear]?.[selectedMonth]?.totalContrHours || 0;
  const [contributedHours, setContributedHours] =
    useState<number>(totalContrHours);

  useEffect(() => {
    setContributedHours(totalContrHours);
  }, [totalContrHours]);

  // 从 Firestore 获取用户头像，并实时更新
  useEffect(() => {
    const unsubscribe = firestore()
      .collection("Users")
      .where("emailAddress", "==", emailAddress)
      .onSnapshot((querySnapshot) => {
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            setLogo(userData.logo); // 实时更新 logo
          });
        }
      });

    return () => unsubscribe(); // 清理订阅
  }, [emailAddress]);

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
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    let result: ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      setImage(result.assets[0].uri); // Update user-selected image
    } else {
      console.log("Image selection cancelled or no image selected.");
    }
  };

  const savePicture = async () => {
    if (!image) {
      Alert.alert("No Image Selected", "Please select an image before saving.");
      return;
    }

    Alert.alert("Save picture", "Confirm?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: async () => {
          try {
            const uploadedImageUrl = await uploadImage(image); // Upload image
            setLogo(uploadedImageUrl); // Update logo state

            const usersRef = firestore().collection("Users");
            const currentUserEmail = auth().currentUser?.email;

            if (currentUserEmail) {
              const querySnapshot = await usersRef
                .where("emailAddress", "==", currentUserEmail)
                .get();
              if (!querySnapshot.empty) {
                querySnapshot.forEach(async (doc) => {
                  await usersRef.doc(doc.id).update({
                    logo: uploadedImageUrl,
                    // 其他用户数据更新
                  });
                });
                Alert.alert("Success", "User logo updated successfully!");
                setImage(null); // 將 image 設置為 null，讓按鈕消失
              }
            }
          } catch (error) {
            console.error(
              "Error uploading image or updating user data:",
              error
            );
            Alert.alert("Error", "Failed to upload image. Please try again.");
          }
        },
      },
    ]);
  };

  const calculateLevel = (hours: number) => {
    if (hours <= 10) return 1;
    if (hours <= 20) return 2;
    if (hours <= 30) return 3;
    return 4;
  };

  const currentLevel = calculateLevel(contributedHours);

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync(USER_DATA);
      await auth().signOut();
      dispatch(logOut());
      await AsyncStorage.setItem("hasSeenAppInfo", "false");
      console.log("Successfully signed out.");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await dispatch(fetchUserData(emailAddress));
        await dispatch(fetchUserContributionData(emailAddress));
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false); // 确保在最终清理状态
      }
    };
    fetchData();
  }, [dispatch, emailAddress]);

  const navigationItems = [
    {
      title: "My Account",
      subtitle: "Level " + currentLevel,
      screen: "Account",
    },
    { title: "Admin Panel", subtitle: "", screen: "AdminControl" },
    {
      title: "Community",
      subtitle: "",
      subItems: [
        {
          title: "Create a new community",
          onNavigate: () => navigation.navigate("CreateCommunity"),
        },
      ],
    },
    {
      title: "Settings",
      subtitle: "",
      screen: "Setting",
      subItems: [
        {
          title: "Edit Profile",
          onNavigate: () => navigation.navigate("NewProfile"),
        },
      ],
      subButtom: [{ title: "Notification" }],
    },
    {
      title: "About Us",
      subtitle: "",
      subItems: [
        {
          title: "App Info",
          onNavigate: () => navigation.navigate("AppInfo2"),
        },
        {
          title: "Benefits",
          onNavigate: () => navigation.navigate("Benefits"),
        },
      ],
    },
  ];

  if (isLoading) {
    return <Text>Loading...</Text>; // 显示加载状态
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={
              logo ? { uri: logo } : require("../assets/profile-picture.png")
            } // Show profile picture
            style={styles.profileImage}
          />
        </TouchableOpacity>

        <View style={styles.profileDetails}>
          <Field label="Name" value={name} />
          <Field label="Email Address" value={emailAddress} />
        </View>
      </View>
      {image && (
        <TouchableOpacity onPress={savePicture} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Picture</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={navigationItems}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <RightDrop
            onNavigate={() => navigation.navigate(item.screen)}
            title={item.title}
            children={item.subtitle}
            subItems={item.subItems}
            subSwitch={item.subButtom}
          />
        )}
        contentContainerStyle={styles.flatListContainer}
      />
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Click here to Logout</Text>
      </Pressable>
    </View>
  );
};

type FieldProps = {
  label: string;
  value: string | undefined;
};

const Field = ({ label, value }: FieldProps) => {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value || ""}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
    paddingLeft: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileDetails: {
    flex: 1,
    paddingLeft: 20,
  },
  fieldContainer: {
    marginVertical: 15,
  },
  fieldLabel: {
    fontWeight: "bold",
    fontSize: 14,
  },
  fieldValue: {
    fontSize: 16,
  },
  flatListContainer: {
    paddingVertical: 20,
  },
  saveButton: {
    backgroundColor: "#2C8CFF",
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
  },
  logoutButton: {
    alignItems: "center",
    marginVertical: 20,
  },
  logoutButtonText: {
    color: "#FF8D13",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default Profile;
