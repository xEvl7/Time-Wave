import { Pressable, StyleSheet, Text, View, Image,ScrollView } from "react-native";
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
import firestore from "@react-native-firebase/firestore"
import RightDrop from "../components/RightDrop";

//type UserProps={
 type level = number;
 type points= number;
//};
let level = 3;
let points = 120;

export default function TimeBankRewardsPage({
  navigation,
}: NativeStackScreenProps<RootStackParamList >) {
 


  return (
    <View style={styles.BackgroundStyle}>
      {/* <BackgroundImageBox  style={{ height: "20%" }}
        source={require("../assets/background/login.png")}
      ></BackgroundImageBox> */}
      <ContentContainer>
          <View>
            <Text style={{fontSize:30,fontWeight:'bold',color:'#FFFFFF',textShadowColor:'black',textShadowRadius:1}}>Level {level} </Text>
            <Text style={{fontSize:17,fontWeight:'bold',color:'#FFFFFF',textShadowColor:'black',textShadowRadius:1}}>
             {points} Points
            </Text>
            <Pressable style={{position:'absolute',top:16,right:0}} 
              onPress={() => navigation.navigate("ActiveRewardsPage")}>
              <Image 
                style={{borderRadius: 10, padding: 20,}} 
                source={require("../assets/my-rewards.png")}></Image>
            </Pressable>
          </View>
        </ContentContainer>
        <View style={styles.PressBackground}>
          <Pressable style={{flexDirection:"row"}} onPress={() => navigation.navigate("MyRewardsDetailsPage")}>
            <Image style={{marginLeft:29,marginTop:7,}}source={require("../assets/my-rewards-diamond.png")}></Image>
            <Text style={{marginTop:2,marginLeft:5,fontSize:15}}> My Rewards Details </Text>
            <Image style={{marginLeft:140,}}source={require("../assets/arrow-right.png")}></Image>
          </Pressable>
        </View>
        <ContentContainer>
          <View style={{marginTop:10,flexDirection: "row",}}>
            <Text style={{fontSize:20,fontWeight:'bold'}}>
              Community
            </Text>
            <Pressable onPress={() => navigation.navigate("CommunityPage")}>
              <Text style={{marginLeft:180,marginTop:5,fontSize:15,fontWeight:'bold',color:'#59ADFF'}}>
                See All
              </Text>
            </Pressable>
          </View>
          <ScrollView horizontal={true} style={{marginTop:5}}>
            <Image 
              style={{borderRadius: 10, padding:50,}}
              source={require("../assets/my-rewards.png")}></Image>
            <Image source={require("../assets/my-rewards.png")}></Image>
            <Image source={require("../assets/my-rewards.png")}></Image>
            <Image source={require("../assets/my-rewards.png")}></Image>
            <Image source={require("../assets/my-rewards.png")}></Image>
            <Image source={require("../assets/my-rewards.png")}></Image>
            <Image source={require("../assets/my-rewards.png")}></Image>
          </ScrollView>
          
      </ContentContainer>      
    </View>
  );
}

const styles = StyleSheet.create({
  alternativesContainer: {
    //flex: 1,
    flexDirection: "row",
    position: 'absolute',
    top: 0, left: 0, right: 0,
    //alignItems: "center", 
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
    justifyContent: "space-around",
    marginTop: 5,
  },
  MyRewardsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  HeadingContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    //alignItems: 'center',
  },
  BubbleContainer: {
    borderWidth:1,
    borderColor: 'black',
    borderRadius: 10,
    padding: 20,
  },
  BackgroundStyle: {
    height: "20%",
    width: "100%",
    backgroundColor:"#FF8D13" ,
    //alignItems: "center",
    //justifyContent: "center",
  },
  PressBackground:{
    marginTop:5 ,
    height: "32%",
    width: "100%",
    backgroundColor:"#FFFFFF" ,
    //alignItems: "center",
    justifyContent: "space-around",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  }
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
// });
