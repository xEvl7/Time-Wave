import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
  ImageSourcePropType,
  GestureResponderEvent,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";

import ContentContainer from "../components/ContentContainer";
import HeaderText from "../components/text_components/HeaderText";
import TextButton from "../components/TextButton";
import PrimaryText from "../components/text_components/PrimaryText";
import SecondaryText from "../components/text_components/SecondaryText";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import { useAppSelector } from "../hooks";
import { selectUserName } from "../features/userSlice";
import { NavigationProp } from "@react-navigation/native";
import {
  FirebaseFirestoreTypes,
  firebase,
} from "@react-native-firebase/firestore";
import ButtonText from "../components/text_components/ButtonText";
import { Line } from "react-native-svg";
// import EditActivity from "./screens/EditActivity";

const ActivityInfo = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "ActivityInfo">) => {
  const {item} = route.params;
  // const date = timestamp; 
 
  const convertTime = (timestamp: item.Date): string=> {
    if(item.Date){
      const date = timestamp.toDate();
      return date.toLocaleDateString("en-GB",{
        day:"numeric",
        month:"short",
        year:"numeric"
      });
    }else {
      console.log('Field is missing or undefined');
    }
    

  };

  return (
    <>
    <View>
      
      <ScrollView>
        {/* Image Part */}
        <View>
        {/*  horizontal share button */}
          <Image  
            style={styles.iconImage}
            source={{
              uri: item.logo
            }}           
            />   
          {/* <Pressable><Image></Image></Pressable> */}
        </View>
        {/* Name and description part */}
        <ContentContainer>
          <View style={styles.nameContainer}>
            <Text style={styles.activityName}>{item.Name}</Text>
          </View>
          
          <View style={styles.LDcontainer}>
          <View style={styles.LDItem}>
            <Text style={styles.LDtitle}>Location</Text>
            <Text style={styles.textTitle}>{item.Location}</Text>
          </View>
          <View style={styles.line1}></View>
          {/* <View></View>  line*/}
          <View style={styles.LDItem}>
            <Text style={styles.LDtitle}>Date</Text>
            <Text style={styles.textTitle}>{convertTime(item.Date)}</Text>
          </View>
          <View style={styles.line2}></View>
          {/* line */}
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.textTitle}>Description</Text>
            <Text style={styles.textDetails}>{item.Description}</Text>
            <Text style={styles.textTitle}>Terms & Condition</Text>
            <Text style={styles.textDetails}>{item.TandC}</Text>
            <Text style={styles.textTitle}>Contact Info</Text>
            <Text style={styles.textDetails}>{item.contactInfo}</Text>
          </View>
          
        </ContentContainer>
      </ScrollView>
      <TextButton onPress={() => navigation.navigate("EditActivity",item)}> Edit Activity</TextButton>
    </View>

    
  </>
  );
};

export default ActivityInfo;

const styles = StyleSheet.create({
  iconImage:{
    minHeight: 200,
    flexDirection: "row",
    flex:1,
    backgroundColor:"light-grey",
  },
  nameContainer:{
    alignSelf:"center",
    marginBottom:5,
  },
  activityName:{
    alignContent:"center",
    fontSize: 28,
    fontWeight: "300",
  },
  LDcontainer:{
    marginTop: 4,
    flexDirection:"row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom:8,
    //backgroundColor:"#F1CFA3",
    height: 112,
  },
  LDtitle:{
    fontSize:18,
  },
  LDItem:{
    marginLeft: 18,
    width: "20%",
    height: "100%",
    marginTop:10,
    //marginBottom: 15,
    //backgroundColor: "#F1CFA3",
    flex:1,
  },
  LDdetails:{
    fontWeight:"bold",
    fontSize:18,
  },
  textTitle:{
    marginTop:18,
    fontSize:18,
    fontWeight:"bold",
  },
  textDetails:{
    marginLeft:2,
    marginTop:3.5,
    fontSize:16,
    color:"grey",
  },
  line1:{
    alignSelf:"center",
    height:"97%",
    width:1.4,
    backgroundColor:"#ababab",
  },
  line2:{
    marginTop:10,
    alignSelf:"center",
    width:"100%",
    height:1.4,
    backgroundColor:"#ababab",
  },
  detailsContainer:{
    marginTop:8,
  },

})