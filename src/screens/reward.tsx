import {
  TouchableOpacity, 
  Alert,
  Pressable, 
  ScrollView ,
  StyleSheet, 
  Text, 
  View, 
  Image,
  RefreshControl } from "react-native";


import firestore from "@react-native-firebase/firestore";

import auth from "@react-native-firebase/auth";
import TextButton from "../components/TextButton";
import HeaderText from "../components/text_components/HeaderText";
import BackgroundImageBox from "../components/BackgroundImageBox";
import ContentContainer from "../components/ContentContainer";
import ValidatedTextInput from "../components/ValidatedTextInput";
import { useForm } from "react-hook-form";
import { fetchRewardData } from "../features/rewardSlice";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
ImageSourcePropType,
ImageStyle,
StyleProp,
ViewStyle,
} from "react-native";


import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import React, { useState, useEffect } from "react";
import { REWARD_DATA } from "../constants";
import { isGetAccessor } from "typescript";

let testpoint=200;



export default function Reward({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Reward">) {
  
const rewardData = useAppSelector((state) => state.reward.data);
const dispatch = useAppDispatch();
    // @todo Indicate sign in process is running in UI

    // 实现每进来一次都会重新从firebase获取数据
  useEffect(() => {
    const RID= 'R';
    dispatch(fetchRewardData(RID));
  }, [dispatch]);
  
let img= rewardData?.image;

const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // 模拟网络请求
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

    const showTip = () => {
      
      testpoint -=100;
      Alert.alert(
    
        'Redeemed with 100 points!',
      'Use this reward by '+ now.toLocaleDateString()+ '          Remaining Balance:'+ testpoint+ 'points',
      
      )
      
    };//show message to confirm redeemed reward
    
const showAlert = () =>{
 
      

      var price = rewardData?.price;
      if (price != undefined){
      if (testpoint >= price )
      {
    
        Alert.alert(
        'Get This Reward!',
        'Redeem with '+ rewardData?.price +' points?',
        [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Confirm', onPress: () => showTip()},
        ],
        {cancelable: false}
        )
        
     
      }
      else
      {
        Alert.alert(
    
          "You don't have enough points",
        "Don't worry! The more time you contribute, the more timebank points you will earn.",
        
        )
      }
    }
    };//if point enough to redeem reward,show this message for last comfirm redeem
        
  return (
    
    <View>
      
    <View style={[styles.share]}>  
    
      <Image style={{ height: 50,width: 50,marginTop: 5, marginBottom: 5 ,marginRight: 5 ,resizeMode: 'contain'}} source={require("../assets/share.png")}></Image>
  
    </View> 
  
    <View style={[styles.box]}>
    <Image style={{width: 40, height: 40}} source={require("../assets/jpg.png")}></Image>
    
    <Image  source={{uri:img}} style={{ width: 100, height: 100 }} ></Image>

     
    </View>
    
    
      
    <ContentContainer>
      
        <HeaderText> {rewardData?.name} </HeaderText>
       
        <View style={styles.alternativesContainer}>
        <View style={styles.pointContainer}>
        <Text style={styles.boldtext}> Prices</Text>
        
        <Text style={{ fontSize: 20 }}>{rewardData?.price} points </Text>
        </View>
        <View
          style={styles.verticleLine
          }
          />{/*vertical line*/}
        <View style={styles.validityContainer}>
        <Text style={styles.boldtext}>Validity</Text>
    
        <Text style={{ fontSize: 20}}>{rewardData?.validityStartDate} to</Text>
        <Text style={{ fontSize: 20}}>{rewardData?.validityEndDate} </Text>
        
        
        </View>
        </View>
        <View
          style={{
          borderBottomColor: 'black',
          borderBottomWidth: StyleSheet.hairlineWidth,
          }}
          />{/*line*/}

        

          
            

          <View style={styles.textContainer}>
          <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.boxs}>

          <Text style={styles.boldtext}>Highlight</Text>
          <Text style={{ marginTop: 5, marginBottom: 10 }}>{rewardData?.highlight} </Text>
          </View>
          <View style={styles.boxs}>
          <Text style={styles.boldtext}>Terms & Conditions</Text>
          
          <Text style={{ marginTop: 5, marginBottom: 10 }}>{rewardData?.termsConditions}</Text>
          </View>  
           
          <View style={styles.boxs}>
            
          <Text style={styles.boldtext}>Contact  Info</Text>
  
          <Text style={{ marginTop: 5, marginBottom: 10 }}>{rewardData?.contactInfo} </Text>
          </View>    
          </ScrollView>
            </View>
            
         
      </ContentContainer>
      <View
          style={{
            position: 'absolute',
              top:620,
              
              left:5,
              right:5,
          borderBottomColor: 'black',
          borderBottomWidth: StyleSheet.hairlineWidth,
          }}
          />{/*line*/}
      
      
      <View style={styles.redeemContainer}>
       <TextButton style={{
              position: 'absolute',
              bottom:20,
              left:5,
              right:5, 
              backgroundColor: "#FF8D13",elevation: 1}}  
              textStyle={styles.mainButtonText} 
            onPress={showAlert}
            >
            Redeem
            </TextButton>
            </View>
            
    </View>

  );
}



const now = new Date();//get the current date

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
  },
  boxs: {
    width: '90%',
    height: 100,
    marginVertical: 10,
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
  },
  boldtext:{fontWeight: "bold",fontSize: 25},
  alternativesContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    marginTop: 10,
  },//container
  pointContainer: {
    justifyContent: "space-evenly",
    width: "35%",
    marginBottom:10,
  },
  validityContainer: {
    justifyContent: "space-evenly",
    width: "65%",
    marginBottom:10,
    marginLeft:20,
  },
  thirdPartyAuthContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  textContainer: {
    minWidth: "78%",
    height: "200%",
    justifyContent: "space-evenly",

  },
  redeemContainer: {
    minWidth: "78%",
    height: "10%",
    position: 'absolute',
    
    top: 680,
    right:0,
    left: 0,
  },
  button: {
    backgroundColor: '#4ba37b',
    width: 100,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 10
},//dteails of button

  box: {
    flexDirection: "row",
    height: "16%",
    width: "100%",
    backgroundColor: "#FF8D13",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  jpg: {
    flexDirection: "row",
    height: "8%",
    width: "10%",
    backgroundColor: "#FF8D13",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  share: {
    flexDirection: "row",
    height: "30%",
    width: "100%",
    backgroundColor: "#FF8D13",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    alignItems: "flex-start",
    justifyContent: "flex-end",
  },

  mainButtonText: {
    color: "#06090C",
  },
  verticleLine: {
    height: '100%',
    width: 1,
    backgroundColor: '#909090',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});

