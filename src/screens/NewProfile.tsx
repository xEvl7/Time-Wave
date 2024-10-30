import { StyleSheet, View, Text, TouchableOpacity,Image } from "react-native";
import React, { useState, useEffect } from "react";
import ContentContainer from "../components/ContentContainer";
import { useAppSelector } from "../hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import firestore from "@react-native-firebase/firestore";
import auth from '@react-native-firebase/auth';

const NewProfile = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "NewProfile">) => {
  const name = useAppSelector((state) => state.user.data?.name);
  const email = useAppSelector((state) => state.user.data?.emailAddress);
  const phone = useAppSelector((state) => state.user.data?.phoneNumber);
  const ic = useAppSelector((state) => state.user.data?.identityCardNumber);
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
        <Image
          source={logo ? { uri: logo } : require("../assets/profile-picture.png")}
          style={styles.circleImage}
        />
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
});
