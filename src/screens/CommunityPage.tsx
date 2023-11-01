import { Pressable, StyleSheet, FlatList, Text, View, Image ,ScrollView} from "react-native";
import auth from "@react-native-firebase/auth";

import TextButton from "../components/TextButton";
import HeaderText from "../components/text_components/HeaderText";
import BackgroundImageBox from "../components/BackgroundImageBox";
import ContentContainer from "../components/ContentContainer";
import ValidatedTextInput from "../components/ValidatedTextInput";
import { useForm } from "react-hook-form";
import { fetchUserData } from "../features/userSlice";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// type FormData = {
//   emailAddress: string;
//   password: string;
// };

export default function ActiveRewardsPage({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "My Rewards">) {
  const firebaseConfig = {
    apiKey: "AIzaSyD7u8fTERnA_Co1MnpVeJ6t8ZumV0T59-Y",
    authDomain: "time-wave-88653.firebaseapp.com",
    projectId: "time-wave-88653",
    storageBucket: "time-wave-88653.appspot.com",
    messagingSenderId: "666062417383",
    appId: "1:666062417383:web:8d8a8c4d4c0a3d55052142",
    measurementId: "G-L7TTXFZ6DM",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  const handleData = async (data: FormData) => {
    // const querySnapshot = await getDocs(collection(db, "users"));
    // querySnapshot.forEach((doc) => {
    //   console.log(`${doc.id} => ${doc.data()}`);
    // });
  };
  
  

  return (
    <View>
      <BackgroundImageBox
        style={{ height: "38%" }}
        //source={require("../assets/background/login.png")}
      ></BackgroundImageBox>
      <ContentContainer>
        <HeaderText>Active Rewards</HeaderText>
        
        <View style={{ flex: 1, padding: 10 }}>
      {/* 标题区域 */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
          Your Title
        </Text>
        <Pressable onPress={() => navigation.navigate('OtherPage')}>
          <Text style={{ marginLeft: 10, color: 'blue' }}>
            Go to Other Page
          </Text>
        </Pressable>
      </View>

      {/* 水平滑动板块 */}
      <ScrollView
        horizontal={true}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ flex: 1 }}
      >
        {/* 板块内部的元素 */}
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: 200, height: 200, backgroundColor: 'red', marginRight: 10 }} />
          <View style={{ width: 200, height: 200, backgroundColor: 'green', marginRight: 10 }} />
          <View style={{ width: 200, height: 200, backgroundColor: 'blue' }} />
        </View>
      </ScrollView>
    </View>

        {/* <ValidatedTextInput
          name={"emailAddress"}
          placeholder={"Email"}
          control={control}
          rules={{
            required: "Email Address is required.",
            pattern: {
              value: /^[\w-\.]+@([\w-]+\.)com$/,
              message: "Invalid Email Address.",
            },
          }}
        />
        <ValidatedTextInput
          name={"password"}
          placeholder={"Password"}
          control={control}
          rules={{
            required: "Password is required.",
          }}
          secureTextEntry
        />
        <TextButton
          style={{ marginTop: 2 }}
          onPress={handleSubmit(handleLogin)}
        >
          Login
        </TextButton>
        <View style={styles.alternativesContainer}>
          <Pressable onPress={() => navigation.navigate("ForgotPassword")}>
            <Text style={{ fontSize: 12 }}>Forgot Password</Text>
          </Pressable>
          <Text style={{ marginTop: 30, marginBottom: 20 }}>Log in with:</Text>
          <View style={styles.thirdPartyAuthContainer}>
            <Pressable>
              <Image source={require("../assets/logo/google-logo.png")}></Image>
            </Pressable>
            <Pressable>
              <Image source={require("../assets/logo/apple-logo.png")}></Image>
            </Pressable>
            <Pressable>
              <Image
                source={require("../assets/logo/facebook-logo.png")}
              ></Image>
            </Pressable>
          </View>
          <View style={styles.registerContainer}>
            <Text>New member?</Text>
            <Pressable onPress={() => navigation.navigate("SignUp")}>
              <Text style={{ color: "#7BB8A3" }}>
                Click here to register now
              </Text> */}
            {/* </Pressable>
          </View>
        </View> */}
      </ContentContainer>
      // Render Points Used Fragment
            <View>
              {/* Content for Points Used */}
              <FlatList
                contentContainerStyle={{ paddingBottom: 100 }}
                data={usedPointsData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View>
                    <Pressable onPress={() => navigation.navigate("PastRewardsDetailsPage")}>
                      <View style={styles.gridItem}>                        
                          <View style={styles.usedImageBox}>
                            <Image
                              source={require("../assets/test3.png")}
                              style={styles.image}
                            />
                          </View>
                          <View style={styles.text}>                  
                            <Text style={styles.subDescription}>Official Mavcap</Text>
                            <Text style={styles.description}>Medical Checkup</Text>
                            <View style={styles.pointContainer}>
                              <Text style={styles.pointDesc}> Expires on {expireDate}</Text>
                              <Text style={styles.Used}>Used</Text>
                            </View>  
                          </View>                  
                      </View>
                    </Pressable>        
                  </View>
                )}
              />
            </View>
      <ContentContainer>
      <TextButton onPress={() => navigation.navigate("MyRewardsDetails")}>
          Use now
        </TextButton>
      </ContentContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  alternativesContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  thirdPartyAuthContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  registerContainer: {
    flexDirection: "row",
    minWidth: "78%",
    justifyContent: "space-evenly",
    marginTop: 40,
  },
  MyRewardsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  HeadingContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
});
