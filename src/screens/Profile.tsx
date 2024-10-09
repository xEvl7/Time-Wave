import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  View,
  Text,
  Pressable,
  FlatList,
  TouchableOpacity,
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
import firestore from "@react-native-firebase/firestore";

const Profile = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Profile">) => {
  const { name, emailAddress } =
    useAppSelector((state) => state.user.data) || {};
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [logo, setLogo] = useState<string | null>(null); // 新增的状态来保存用户的头像 URL

  const contributionData = useAppSelector(
    (state: RootState) => state.user.contributionData
  );
  const selectedYear = "2023";
  const selectedMonth = "Dec";
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
      }
      setIsLoading(false);
    };
    fetchData();
  }, [dispatch, emailAddress]);

  const navigationItems = [
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
      title: "My Account",
      subtitle: "Level " + currentLevel,
      screen: "Account",
    },
    { title: "Admin Panel", subtitle: "", screen: "AdminControl" },
    { title: "Settings", subtitle: "", screen: "Setting" ,
      subButtom: [
        { title: "Notification"},
      ],
    },
    {
      title: "About Us",
      subtitle: "",
      subItems: [
        { title: "App Info", onNavigate: () => navigation.navigate("AppInfo") },
        {
          title: "Benefits",
          onNavigate: () => navigation.navigate("Benefits"),
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={() => navigation.navigate("NewProfile")}>
          <Image
            source={logo ? { uri: logo } : require("../assets/profile-picture.png")} // 更新头像显示
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <View style={styles.profileDetails}>
          <Field label="Name" value={name} />
          <Field label="Email Address" value={emailAddress} />
        </View>
      </View>
      <FlatList
        data={navigationItems}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <RightDrop
            onNavigate={() => navigation.navigate(item.screen)}
            title={item.title}
            children={item.subtitle}
            subItems={item.subItems}
            subButtom={item.subButtom}
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
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 14,
    color: "gray",
  },
  fieldValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  flatListContainer: {
    paddingBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "lightgray",
    marginVertical: 10,
  },
  logoutButton: {
    alignItems: "center",
    marginVertical: 20,
  },
  logoutButtonText: {
    color: "#FF8D13",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Profile;
