import {TouchableOpacity, Alert,Pressable, StyleSheet, Text, View, Image } from "react-native";
//import auth from "@react-native-firebase/auth";

import TextButton from "../components/TextButton";
import HeaderText from "../components/text_components/HeaderText";
import BackgroundImageBox from "../components/BackgroundImageBox";
import ContentContainer from "../components/ContentContainer";
//import ValidatedTextInput from "../components/ValidatedTextInput";
import { useForm } from "react-hook-form";
//import { fetchUserData } from "../features/userSlice";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
//import { useAppDispatch, useAppSelector } from "../hooks";
import {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  ViewStyle,
} from "react-native";
import React from "react";

const testpoint=100;

const showTip = () => {
  Alert.alert(

    'Redeemed with 100 points!',
  'Use this reward by 3 Oct 2023  Remaining Balance: 13 points',
  
  )
}

const showAlert = () =>{
  Alert.alert(
      'Get This Reward!',
      'Redeem with 100 points?',
      [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Confirm', onPress: () => showTip()},
      ],
      {cancelable: false}
  )
}

export default function Reward({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Reward">) {
  
  
    // @todo Indicate sign in process is running in UI

    
  return (
    <View>
    <View style={[styles.share]}>  
      
      <Image style={{ height: 50,width: 50,marginTop: 5, marginBottom: 5 ,marginRight: 5 ,resizeMode: 'contain'}} source={require("../assets/share.png")}></Image>
    </View>
    
    <View style={[styles.box]}>
      <Image  source={require("../assets/background/sewing.png")}></Image>

      
    </View>
      
      <ContentContainer>
        <HeaderText>Singer Sewing Machine</HeaderText>
       
        <View style={styles.alternativesContainer}>
        <View style={styles.pointContainer}>
        <Text style={styles.boldtext}>Points</Text>
        
        <Text style={{ fontSize: 20 }}>100  points</Text>
        </View>
        
        <View style={styles.validityContainer}>
        <Text style={styles.boldtext}>Validity</Text>
    
        <Text style={{ fontSize: 20}}>8 Aug 2023 to 3 Oct 2023</Text>
        </View>
        </View>


          
          <View style={styles.textContainer}>
          <Text style={styles.boldtext}>Highlight</Text>
          <Text style={{ marginTop: 10, marginBottom: 10 }}>"Although, either structural comparison, based on sequence analysis or hardware maintenance boosts the growth of The Benefit of Explicative Capacity" </Text>
          </View>
          <View style={styles.textContainer}>
          <Text style={styles.boldtext}>Terms & Conditions</Text>
          

          <Text style={{ marginTop: 5, marginBottom: 10 }}>"Without a doubt, Barton Ashworth was right in saying that, the portion of the continuing support can be regarded as slowly insignificant. </Text>
            
            
          </View>
          <View style={styles.textContainer}>
            
            <Text style={styles.boldtext}>Contact Info</Text>
  
            <Text style={{ marginTop: 5, marginBottom: 10 }}>Official Mavecap </Text>
              
              
            </View>


        


        <View> 

        
            <TextButton style={{ marginTop: 20 ,marginBottom: 10, backgroundColor: "#FF8D13"}}  textStyle={styles.mainButtonText} onPress={showAlert}
            >
            Redeem
            </TextButton>
          </View>


      </ContentContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  boldtext:{fontWeight: "bold",fontSize: 25},
  alternativesContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    marginTop: 10,
  },
  pointContainer: {
    justifyContent: "space-evenly",
    width: "30%",
  },
  validityContainer: {
    justifyContent: "space-evenly",
    width: "70%",
  },
  thirdPartyAuthContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  textContainer: {
    minWidth: "78%",
    justifyContent: "space-evenly",

  },
  redeemContainer: {
    minWidth: "78%",
    
    
  },
  button: {
    backgroundColor: '#4ba37b',
    width: 100,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 50
},

  box: {
    flexDirection: "row",
    height: "18%",
    width: "100%",
    backgroundColor: "#FF8D13",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    alignItems: "center",
    justifyContent: "center",
  },


  share: {
    flexDirection: "row",
    height: "10%",
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
});

