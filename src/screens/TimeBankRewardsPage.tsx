import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
} from "react-native";
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
import firestore from "@react-native-firebase/firestore";
import RightDrop from "../components/RightDrop";

//type UserProps={
type level = number;
type points = number;
//};
let level = 3;
let points = 120;
let NumberOfItems = 4;
let pointprice = 100;

export default function TimeBankRewardsPage({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "TimeBankRewardsPage">) {
  return (
    <View>
      <View style={styles.BackgroundStyle}>
        <ContentContainer>
          <View>
            <Text
              style={{
                fontSize: 30,
                fontWeight: "bold",
                color: "#FFFFFF",
                textShadowColor: "black",
                textShadowRadius: 1,
              }}
            >
              Level {level}{" "}
            </Text>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "bold",
                color: "#FFFFFF",
                textShadowColor: "black",
                textShadowRadius: 1,
                marginBottom: 1,
              }}
            >
              {points} Points
            </Text>
            <Pressable
              style={{ position: "absolute", top: 16, right: 0 }}
              onPress={() => navigation.navigate("ActiveRewardsPage")}
            >
              {/* <Image 
                style={{borderRadius: 10, padding: 20,}} 
                source={require("../assets/my-rewards.png")}></Image> */}
            </Pressable>
          </View>
        </ContentContainer>
      </View>

      <View style={styles.PressBackground}>
        <Pressable
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => navigation.navigate("RewardsPage")}
        >
          {/* <Image
            style={{ marginLeft: 29 }}
            source={require("../assets/my-rewards-diamond.png")}
          ></Image> */}
          <Text style={{ marginLeft: 5, fontSize: 19 }}>
            {" "}
            My Rewards Details{" "}
          </Text>
          {/* <Image
            style={{ marginLeft: "23%" }}
            source={require("../assets/arrow-right.png")}
          ></Image> */}
        </Pressable>
      </View>

      <View
        style={{
          flexDirection: "row",
          marginTop: "5%",
          marginLeft: "5%",
          justifyContent: "space-between",
          width: "80%",
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Community</Text>
        <View style={{ alignSelf: "flex-end" }}>
          <Pressable onPress={() => navigation.navigate("CommunityPage")}>
            <Text
              style={{
                marginTop: 3,
                fontSize: 15,
                fontWeight: "bold",
                color: "#59ADFF",
              }}
            >
              See All
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={{ marginTop: "5%" }}>
        <ScrollView horizontal={true} contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.gridItem}>
            <Pressable
              onPress={() => navigation.navigate("RewardsDetailsPage")}
            >
              <View style={styles.imageBox}>
                {/* <Image
                  source={require("../assets/test1.png")}
                  style={styles.image}
                /> */}
              </View>
              <View style={styles.text}>
                <Text style={styles.description}>Singer Sewing Machine</Text>
                <Text style={styles.subDescription}>Official Mavcap</Text>
                <View style={styles.pointContainer}>
                  <Text style={styles.point}>{pointprice}</Text>
                  <Text style={styles.pointDesc}> points</Text>
                </View>
              </View>
            </Pressable>
          </View>
          <View style={styles.gridItem}>
            <View style={styles.imageBox}>
              {/* <Image
                source={require("../assets/test2.png")}
                style={styles.image}
              /> */}
            </View>
            <View style={styles.text}>
              <Text style={styles.description}>Spacewood Table Set</Text>
              <Text style={styles.subDescription}>
                Social Innovation Movement
              </Text>
              <View style={styles.pointContainer}>
                <Text style={styles.point}>{pointprice}</Text>
                <Text style={styles.pointDesc}> points</Text>
              </View>
            </View>
          </View>
          <View style={styles.gridItem}>
            <View style={styles.imageBox}>
              {/* <Image
                source={require("../assets/test1.png")}
                style={styles.image}
              /> */}
            </View>
            <View style={styles.text}>
              <Text style={styles.description}>Singer Sewing Machine</Text>
              <Text style={styles.subDescription}>Official Mavcap</Text>
              <View style={styles.pointContainer}>
                <Text style={styles.point}>{pointprice}</Text>
                <Text style={styles.pointDesc}> points</Text>
              </View>
            </View>
          </View>
          <View style={styles.gridItem}>
            <View style={styles.imageBox}>
              {/* <Image
                source={require("../assets/test1.png")}
                style={styles.image}
              /> */}
            </View>
            <View style={styles.text}>
              <Text style={styles.description}>Singer Sewing Machine</Text>
              <Text style={styles.subDescription}>
                Social Innovative Movement
              </Text>
              <View style={styles.pointContainer}>
                <Text style={styles.point}>{pointprice}</Text>
                <Text style={styles.pointDesc}> points</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginTop: "5%",
          marginLeft: "5%",
          justifyContent: "space-between",
          width: "80%",
        }}
      >
        <View>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Medical Services
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Pressable onPress={() => navigation.navigate("MedicalServicesPage")}>
            <Text
              style={{
                textAlign: "right",
                marginTop: 5,
                fontSize: 15,
                fontWeight: "bold",
                color: "#59ADFF",
              }}
            >
              See All
            </Text>
          </Pressable>
        </View>
      </View>
      <View style={{ marginTop: 5 }}>
        <ScrollView horizontal={true} contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.gridItem}>
            <View style={styles.imageBox}>
              {/* <Image
                source={require("../assets/test3.png")}
                style={styles.image}
              /> */}
            </View>
            <View style={styles.text}>
              <Text style={styles.description}>Medical Checkup</Text>
              <Text style={styles.subDescription}>Official Mavcap</Text>
              <View style={styles.pointContainer}>
                <Text style={styles.point}>{pointprice}</Text>
                <Text style={styles.pointDesc}> points</Text>
              </View>
            </View>
          </View>
          <View style={styles.gridItem}>
            <View style={styles.imageBox}>
              {/* <Image
                source={require("../assets/test4.png")}
                style={styles.image}
              /> */}
            </View>
            <View style={styles.text}>
              <Text style={styles.description}>Health Check</Text>
              <Text style={styles.subDescription}>
                Social Innovative Movement
              </Text>
              <View style={styles.pointContainer}>
                <Text style={styles.point}>{pointprice}</Text>
                <Text style={styles.pointDesc}> points</Text>
              </View>
            </View>
          </View>
          <View style={styles.gridItem}>
            <View style={styles.imageBox}>
              {/* <Image
                source={require("../assets/test2.png")}
                style={styles.image}
              /> */}
            </View>
            <View style={styles.text}>
              <Text style={styles.description}>Singer Sewing Machine</Text>
              <Text style={styles.subDescription}>Official Mavcap</Text>
              <View style={styles.pointContainer}>
                <Text style={styles.point}>{pointprice}</Text>
                <Text style={styles.pointDesc}> points</Text>
              </View>
            </View>
          </View>
          <View style={styles.gridItem}>
            <View style={styles.imageBox}>
              {/* <Image
                source={require("../assets/test1.png")}
                style={styles.image}
              /> */}
            </View>
            <View style={styles.text}>
              <Text style={styles.description}>Singer Sewing Machine</Text>
              <Text style={styles.subDescription}>Official Mavcap</Text>
              <View style={styles.pointContainer}>
                <Text style={styles.point}>{pointprice}</Text>
                <Text style={styles.pointDesc}> points</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
      {/* <View style={{marginTop:10,}}>
            <ScrollView horizontal={true} 
            contentContainerStyle={{ flexGrow: 1 }} >    
              <Text style={{fontSize:30,marginTop:80}}> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Text>
              
            </ScrollView>
          </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  BubbleContainer: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 20,
  },
  BackgroundStyle: {
    height: 150,
    width: "100%",
    backgroundColor: "#FF8D13",
    //alignItems: "center",
    //justifyContent: "center",
  },
  PressBackground: {
    position: "absolute",
    top: 120,
    left: 0,
    right: 0,
    height: 40,
    width: "100%",
    backgroundColor: "#FFFFFF",
    //alignItems: "center",
    justifyContent: "space-around",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    marginLeft: 25,
    width: 250, // 两个格子并排，留出一些间隙
    height: 250,
    marginBottom: 10,
    backgroundColor: "#F1CFA3",
    borderRadius: 20,
    borderColor: "#BDBDBD",
    borderWidth: 1,
  },
  imageBox: {
    alignSelf: "center",
    resizeMode: "cover",
    height: "60%",
    //position: 'absolute',
    //top: 0,
    //left: 0,
  },
  image: {
    alignSelf: "center",
    resizeMode: "cover",
    marginTop: 10,
    //position: 'absolute',
    //top: 0,
    //left: 0,
  },
  text: {
    backgroundColor: "#FFFFFF",
    height: "40%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  description: {
    fontSize: 16,
    textAlign: "left",
    marginTop: 1,
    marginLeft: 10,
    fontWeight: "bold",
  },
  subDescription: {
    fontSize: 13,
    textAlign: "left",
    marginLeft: 10,
  },
  point: {
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "left",
    marginLeft: 10,
    color: "#FF8D13",
  },
  pointDesc: {
    fontSize: 15,
    textAlign: "left",
  },
  pointContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
});

// const usersRef = ref(db, 'users');
// get(usersRef).then((snapshot) => {
//   if (snapshot.exists()) {
//     const userData = snapshot.val();
//     // 在这里处理从 Firebase 中提取的数据
//     // 将数据与 control 结合使用
//   } else {
//     console.log('No data available');
//   }
// }).catch((error) => {
//   console.error('Error getting data:', error);
// })
