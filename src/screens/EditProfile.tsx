import { StyleSheet, Image, View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from 'react';
import PrimaryText from "../components/text_components/PrimaryText";
import ContentContainer from "../components/ContentContainer";
import { useAppSelector, useAppDispatch } from "../hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import firestore from "@react-native-firebase/firestore";
import { fetchUserData } from "../features/userSlice";
import TextButton from "../components/TextButton";
import auth from '@react-native-firebase/auth';

const EditProfile = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "EditProfile">) => {

  const userData = useAppSelector((state) => state.user.data);
  const dispatch = useAppDispatch();

  const name = useAppSelector((state) => state.user.data?.name);
  const email = useAppSelector((state) => state.user.data?.emailAddress);
  const phone = useAppSelector((state) => state.user.data?.phoneNumber);
  const ic = useAppSelector((state) => state.user.data?.identityCardNumber);

  const [newEmail, setNewEmail] = useState(email || '');
  const [newPhone, setNewPhone] = useState(phone || '');
  const [currentPassword, setCurrentPassword] = useState('');

  const reauthenticate = (password: string) => {
    const user = auth().currentUser;
    const credential = auth.EmailAuthProvider.credential(user?.email!, password);
    return user?.reauthenticateWithCredential(credential);
    
  };



  const handleEdit = async () => {
    if (!email) {
      console.error("Current email is undefined");
      return;
    }

    try {
      const userSnapshot = await firestore().collection('Users').where("emailAddress", "==", email).get();
      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0].ref;

        await userDoc.update({
          emailAddress: newEmail,
          phoneNumber: newPhone,
        });

        console.log("User data updated successfully");
        await dispatch(fetchUserData(newEmail)).unwrap();
      } else {
        console.error("User not found");
      }
    } catch (error) {
      console.error("Error updating user data: ", error);
    }
  };

  return (
    <ContentContainer style={{ flex: 1 }}>
      <View style={styles.editcontainer}>
        <TouchableOpacity onPress={handleEdit}>
          <Text style={{ color: '#FF8D13' }}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.centercontainer}>
      <Image
      source={image ? { uri: image } : require("../assets/profile-picture.png")}
      style={styles.circleImage}
      />
      </View>
      
      <View style={styles.alternativesContainer}>
        <View style={styles.pointContainer}>
          <Text style={styles.boldtext}>Full Name:</Text>
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
          <Text style={styles.boldtext}>Email:</Text>
        </View>
        <View style={styles.validityContainer}>
          <Text style={{ fontSize: 14 }}>{email}</Text>
        </View>
      </View>
      
      <View style={styles.alternativesContainer}>
        <View style={styles.pointContainer}>
          <Text style={styles.boldtext}>Phone No:</Text>
        </View>
        <View style={styles.validityContainer}>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={newPhone}
            onChangeText={setNewPhone}
          />
        </View>
      </View>
      
      
      
      <Text></Text>
      <Text></Text>
      <Text></Text>
      
      <View style={styles.alternativesContainer}>
        <View style={styles.passContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your current password to verify"
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
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

export default EditProfile;

const styles = StyleSheet.create({
  fieldContainer: {},
  centercontainer: {
    marginBottom: 10,
    marginLeft: 20,
    alignItems: 'center', // 图像在垂直方向上右对齐
  },
  editcontainer: {
    justifyContent: "space-evenly",
    width: "100%",
    marginBottom: 10,
    marginLeft: 20,
    alignItems: 'flex-end', // 图像在垂直方向上右对齐
  },
  pointContainer: {
    justifyContent: "space-evenly",
    width: "35%",
    marginBottom: 10,
  },
  boldtext: { fontWeight: "bold", fontSize: 16 },
  passContainer: {
    justifyContent: "space-evenly",
    width: "100%",
    marginBottom: 10,
    marginLeft: 20,
    height: 40,
  },
  validityContainer: {
    justifyContent: "space-evenly",
    width: "65%",
    marginBottom: 10,
    marginLeft: 20,
  },
  nextcontainer: {
    justifyContent: "space-evenly",
    width: "15%",
    marginBottom: 10,
    marginLeft: 20,
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
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginRight: 10,
  },
});
