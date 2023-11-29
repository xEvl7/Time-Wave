import {
  TouchableOpacity, 
  Alert,
  Pressable, 
  ScrollView ,
  StyleSheet, 
  Text, 
  View, 
  Image } from "react-native";


import firestore from "@react-native-firebase/firestore";

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
import {
ImageSourcePropType,
ImageStyle,
StyleProp,
ViewStyle,
} from "react-native";
import React from "react";

let testpoint=200;

/*
interface Rewardsdetails {
  name:string;
  prices: number;
}
*/
var db = firestore();



var docRef = db.collection("Rewards");




 
const showwhat = () =>{


  docRef.where("RID","==","R3").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {

        const Details = doc.data();

        console.log(Details.name);

    
console.log(Details.price);
//const reww = firestore().collection('Rewards').doc('Fan').collection('name');

return Details;
});

})
  /*
    firestore().collection('Rewards').doc('R3').set({
      category: "Category C",
      supplierLogo: "URL to the image of the reward", //using Firebase Storage to store the actual image files and storing references (URLs) to these images in Cloud Firestore
      supplierName: "Mr Jungle",
      contactInfo: 'Mr Jungle',
      highlight: "Incredible Straight",
      image: "URL to the image of the reward", //using Firebase Storage to store the actual image files and storing references (URLs) to these images in Cloud Firestore
      name: "Wood Stick(very straight)",
      price: 10,
      qtyAvailable: 1,
      status: "active", //if this reward is discontinued but not delete from database then set to Discontinued (no longer available)
      termsConditions: "Everyone can get it!!Be a Knight.Just do it. ",
      validityStartDate: "1 Jan 2023",
      validityEndDate: "30 Nov 2023",

    category: "Category A"
    supplierLogo: "URL to the image of the reward", //using Firebase Storage to store the actual image files and storing references (URLs) to these images in Cloud Firestore
    supplierName: "Supplier 1",
    contactInfo: 'Official Mavecap',
    highlight: "Although, either structural comparison, based on sequence analysis or hardware maintenance boosts the growth of The Benefit of Explicative Capacity",
    image: "URL to the image of the reward", //using Firebase Storage to store the actual image files and storing references (URLs) to these images in Cloud Firestore
    name: "Singer Sewing Machine",
    price: 100,
    qtyAvailable: 5,
    status: "active", //if this reward is discontinued but not delete from database then set to Discontinued (no longer available)
    termsConditions: "Without a doubt, Barton Ashworth was right in saying that, the portion of the continuing support can be regarded as slowly insignificant.",
    validityStartDate: 1 Nov 2023,
    validityEndDate: 30 Nov 2023,
*/

 
    console.log('Working now!!!');




}
  






const showTip = () => {
  testpoint -=100;
  Alert.alert(

    'Redeemed with 100 points!',
  'Use this reward by '+ now.toLocaleDateString()+ '          Remaining Balance:'+ testpoint+ 'points',
  
  )
  
}//show message to confirm redeemed reward

const showAlert = () =>{
  
  if (testpoint >= sew.itemprice )
  {

    Alert.alert(
    'Get This Reward!',
    'Redeem with '+ 'huh?' +' points?',
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
}//if point enough to redeem reward,show this message for last comfirm redeem

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
        
        <HeaderText>{sew.itemname}</HeaderText>
       
        <View style={styles.alternativesContainer}>
        <View style={styles.pointContainer}>
        <Text style={styles.boldtext}>Points</Text>
        
        <Text style={{ fontSize: 20 }}>{sew.itemprice} points</Text>
        </View>
        <View
          style={styles.verticleLine
          }
          />{/*vertical line*/}
        <View style={styles.validityContainer}>
        <Text style={styles.boldtext}>Validity</Text>
    
        <Text style={{ fontSize: 20}}>{sew.validity}</Text>
        </View>
        </View>
        <View
          style={{
          borderBottomColor: 'black',
          borderBottomWidth: StyleSheet.hairlineWidth,
          }}
          />{/*line*/}

        

          
          
          <View style={styles.textContainer}>
          
          <Text style={styles.boldtext}>Highlight</Text>
          <Text style={{ marginTop: 10, marginBottom: 10 }}>{sew.highlight} </Text>
          </View>
          <View style={styles.textContainer}>
          <Text style={styles.boldtext}>Terms & Conditions</Text>
          
          <Text style={{ marginTop: 5, marginBottom: 10 }}>{sew.term}</Text>
            
            
          </View>
          <View style={styles.textContainer}>
            
            <Text style={styles.boldtext}>Contact  Info</Text>
  
            <Text style={{ marginTop: 5, marginBottom: 10 }}>{sew.contact} </Text>
              
              
            </View>
            

        


        <View> 

        <View
          style={{
          borderBottomColor: 'black',
          borderBottomWidth: StyleSheet.hairlineWidth,
          }}
          />{/*line*/}
            <TextButton style={{ marginTop: 20 ,marginBottom: 10, backgroundColor: "#FF8D13"}}  textStyle={styles.mainButtonText} onPress={showwhat}
            >
            Redeem
            </TextButton>
          </View>
          


      </ContentContainer>
    </View>
  );
}

class Item {
  itemname: string;
  itemprice: number;
  validity: string;
  highlight: string;
  term: string;
  contact: string;

  constructor(itemname: string,itemprice: number, validity: string,highlight: string,term: string,contact: string){
      this.itemname = itemname
      this.itemprice = itemprice
      this.validity = validity
      this.highlight =highlight
      this.term = term
      this.contact =contact
  }
}//class of item

const sew =new Item('Singer Sewing Machine',
100,
'8 Aug 2023 to 3 Oct 2023',
"Although, either structural comparison, based on sequence analysis or hardware maintenance boosts the growth of The Benefit of Explicative Capacity" ,
"Without a doubt, Barton Ashworth was right in saying that, the portion of the continuing support can be regarded as slowly insignificant.",
'Official Mavecap');//sewing machine details



const now = new Date();//get the current date

const styles = StyleSheet.create({
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
},//dteails of button

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
  verticleLine: {
    height: '100%',
    width: 1,
    backgroundColor: '#909090',
  },
});

