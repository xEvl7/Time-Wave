import { StyleSheet, View, Text, TextInput } from "react-native";
import React, { useState } from 'react';
import PrimaryText from "../components/text_components/PrimaryText";
import ContentContainer from "../components/ContentContainer";
import { useAppSelector } from "../hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import TextButton from "../components/TextButton";
import auth from '@react-native-firebase/auth';

const ChangeYourPassword = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "ChangeYourPassword">) => {
  const name = useAppSelector((state) => state.user.data?.name);
  const email = useAppSelector((state) => state.user.data?.emailAddress);

  const [password, setPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [message, setMessage] = useState('');

  const reauthenticate = (password: string) => {
    const user = auth().currentUser;
    const credential = auth.EmailAuthProvider.credential(user?.email!, password);
    return user?.reauthenticateWithCredential(credential);
    
  };

  const test =() => {
    reauthenticate(password);
    console.log('this is correct pasword')
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }

    try {
      await reauthenticate(password);
      const user = auth().currentUser;
      await user?.updatePassword(newPassword);
      setMessage('Password updated successfully');
    } catch (error) {
      setMessage(`Error: Password updated unsuccessfully`);
    }
  };

  return (
    <ContentContainer style={{ flex: 1 }}>
      <View style={styles.pointContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your current password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <View style={styles.pointContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your new password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
      </View>
      <View style={styles.pointContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm your new password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>
      {message ? <Text>{message}</Text> : null}
      <TextButton onPress={handleChangePassword}>Save</TextButton>
      <TextButton onPress={test}>test</TextButton>
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
