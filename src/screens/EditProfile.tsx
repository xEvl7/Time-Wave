import { StyleSheet, Image, View, Text, TouchableOpacity, TextInput, ActivityIndicator , Alert} from "react-native";
import React, { useEffect, useState } from 'react';
import ContentContainer from "../components/ContentContainer";
import { useAppSelector, useAppDispatch } from "../hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import firestore from "@react-native-firebase/firestore";
import { fetchUserData } from "../features/userSlice";
import auth from '@react-native-firebase/auth';

const EditProfile = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "EditProfile">) => {
  const dispatch = useAppDispatch();
  const { name, emailAddress: email, phoneNumber: phone, identityCardNumber: ic } = useAppSelector((state) => state.user.data) || {};
  
  const [image, setImage] = useState<string | null>(null); // 保存用户头像
  const [newName, setNewName] = useState(name || '');
  const [newPhone, setNewPhone] = useState(phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 添加加载状态
  const [error, setError] = useState<string | null>(null); // 保存错误信息

  // 密码重新验证函数
  const reauthenticate = async (password: string) => {
    const user = auth().currentUser;
    if (user && user.email) {
      const credential = auth.EmailAuthProvider.credential(user.email, password);
      return user.reauthenticateWithCredential(credential);
    }
    throw new Error("User is not authenticated");
  };

  // 更新用户信息
  const updateUserInfo = async () => {
    if (!email) {
      setError("Email is undefined");
      return;
    }
  
    try {
      setIsLoading(true);
      setError(null); // 清除之前的错误信息
  
      // 进行密码验证
      await reauthenticate(currentPassword);
  
      const userSnapshot = await firestore()
        .collection('Users')
        .where("emailAddress", "==", email)
        .get();
  
      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0].ref;
        await userDoc.update({
          name: newName,
          phoneNumber: newPhone,
        });
  
        console.log("User data updated successfully");
        await dispatch(fetchUserData(email)).unwrap();
  
        // 保存成功后导航到主页
        Alert.alert(
          'Update Successful',
          'User data updated successfully',
          [{ text: 'OK', onPress: () => navigation.navigate('Home') }] // 在用户确认成功后导航
        );
      } else {
        setError("User not found");
      }
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        setError("Wrong password,please try again");
      } else {
        setError(`Error updating user data: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  // 实时获取用户头像
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('Users')
      .where("emailAddress", "==", email)
      .onSnapshot((querySnapshot) => {
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            setImage(userData.logo); // 更新头像
          });
        }
      });

    return () => unsubscribe(); // 清理订阅
  }, [email]);

  return (
    <ContentContainer style={{ flex: 1 }}>
      <View style={styles.editContainer}>
        <TouchableOpacity onPress={updateUserInfo} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#FF8D13" />
          ) : (
            <Text style={styles.saveText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.centerContainer}>
        <Image
          source={image ? { uri: image } : require("../assets/profile-picture.png")}
          style={styles.circleImage}
        />
      </View>

      {/* 错误提示 */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* 姓名编辑区域 */}
      <ProfileField
        label="Full Name"
        value={newName}
        onChangeText={setNewName}
      />

      {/* 身份证展示 */}
      <ProfileField
        label="IC"
        value={ic}
        editable={false}
      />

      {/* 邮箱展示 */}
      <ProfileField
        label="Email"
        value={email}
        editable={false}
      />

      {/* 电话号码编辑区域 */}
      <ProfileField
        label="Phone No"
        value={newPhone}
        onChangeText={setNewPhone}
      />

      {/* 密码输入 */}
      <ProfileField
        label="Current Password"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry={true}
        placeholder="Enter your current password"
      />
    </ContentContainer>
  );
};

// 封装的 ProfileField 组件，减少重复代码
const ProfileField = ({ label, value, onChangeText, editable = true, secureTextEntry = false, placeholder = "" }) => (
  <View style={styles.alternativesContainer}>
    <View style={styles.pointContainer}>
      <Text style={styles.boldtext}>{label}:</Text>
    </View>
    <View style={styles.validityContainer}>
      {editable ? (
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
        />
      ) : (
        <Text style={styles.staticText}>{value}</Text>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  editContainer: {
    justifyContent: "flex-end",
    width: "100%",
    marginBottom: 10,
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  saveText: {
    color: '#FF8D13',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  centerContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  alternativesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  pointContainer: {
    width: "35%",
    justifyContent: "center",
  },
  validityContainer: {
    width: "65%",
  },
  boldtext: {
    fontWeight: "bold",
    fontSize: 16,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
  },
  staticText: {
    fontSize: 14,
  },
  circleImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

export default EditProfile;
