import { StyleSheet, View, Text, TextInput } from "react-native";
import React, { useState } from 'react';
import PrimaryText from "../components/text_components/PrimaryText";
import ContentContainer from "../components/ContentContainer";
import { useAppSelector } from "../hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import TextButton from "../components/TextButton";
//import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

const ChangeYourPassword = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "ChangeYourPassword">) => {
  const name = useAppSelector((state) => state.user.data?.name);
  const email = useAppSelector((state) => state.user.data?.emailAddress);

  const [password, setPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');


  const tryhandlePressBack = async () => {
    console.log('Password updated successfully')
  }

 // const handlePressBack = async () => {
 //   if (newPassword === confirmPassword) {
 //     const auth = getAuth();
 //     const user = auth.currentUser;
      
 //     if (user) {
 //       const credential = EmailAuthProvider.credential(user.email!, password);
        
//        try {
          // Reauthenticate user with current password
 //         await reauthenticateWithCredential(user, credential);
          // Update to new password
  //        await updatePassword(user, newPassword);
  //        console.log("Password updated successfully");
 //       } catch (error) {
  //        console.error("Error updating password: ", error);
 //       }
 //     } else {
 //       console.error("No user is currently signed in");
 //     }
 //   } else {
//      console.error("New password and confirm password do not match");
//   }
 // };

  return (
    <ContentContainer style={{ flex: 1 }}>
      <View style={styles.pointContainer}>
        <TextInput
          style={styles.input}
          placeholder={'Enter your current password'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <View style={styles.pointContainer}>
        <TextInput
          style={styles.input}
          placeholder={'Enter your new password'}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
      </View>
      <View style={styles.pointContainer}>
        <TextInput
          style={styles.input}
          placeholder={'Confirm your new password'}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>
      <TextButton onPress={tryhandlePressBack}>Save</TextButton> 
    </ContentContainer>
  );
};//onPress={handlePressBack}     for 'save'

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

export default ChangeYourPassword;

const styles = StyleSheet.create({
  fieldContainer: {},
  centercontainer: {
    marginBottom: 10,
    marginLeft: 20,
    alignItems: 'center',
  },
  pointContainer: {
    justifyContent: "space-evenly",
    width: "100%",
    marginBottom: 10,
    height: 40,
  },
  boldtext: { fontWeight: "bold", fontSize: 16 },
  passContainer: {
    justifyContent: "space-evenly",
    width: "85%",
    marginBottom: 10,
    marginLeft: 20,
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
    alignItems: 'flex-end',
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
  },
  image: {
    width: 100,
    height: 100,
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