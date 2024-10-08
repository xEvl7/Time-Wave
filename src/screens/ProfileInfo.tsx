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
  
  const ProfileInfo = ({
    navigation,
    route,
  }: NativeStackScreenProps<RootStackParamList, "ProfileInfo">) => {
    const {item} = route.params;
    // const date = timestamp; 
   

  
    return (
      <>
      {/* <View> */}        
          {/* Image Part */} 
          <View style={styles.orangeTab}></View>
          <View style={styles.iconContainer}>    
            <View style={styles.iconCircle}>
              <Image  
                style={styles.iconImage}
                source={{
                  uri: item.logo
                }}           
                /> 
            </View>              
            {/* <Pressable><Image></Image></Pressable> */}          
          </View>
          {/* Name and description part */}
          <ContentContainer>
            <View style={styles.nameContainer}>
                <Text style={styles.LDtitle}>Name:</Text>
                <Text style={styles.activityName}>{item.name}</Text>
            </View>           
            
            <View style={styles.line2}></View>
  
            <View style={styles.detailsContainer}>
              <Text style={styles.textTitle}>Description</Text>
              <Text style={styles.textDetails}></Text>
                {/* {item.name} */}
              <Text style={styles.textTitle}>Contact Info</Text>
              <Text style={styles.textDetails}></Text>
                {/* {item.contactInfo} */}
            </View>
            
          </ContentContainer>
        {/* </ScrollView> */}
      {/* </View> */}
  
      
    </>
    );
  };
  
  export default ProfileInfo;
  
  const styles = StyleSheet.create({
    orangeTab:{
      height:"7%",
      backgroundColor:"#FF8D13",
      justifyContent: 'center',
      paddingHorizontal: 16,
    },
    iconContainer:{
      alignItems:"center",
      marginTop:-50,
    },
    iconCircle:{      
      Height:200,
      Width:200,
      borderRadius:100,
      backgroundColor:"white",
      alignItems: 'center',
      borderWidth: 3,
      borderColor: 'grey',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 2,
      elevation: 5,
    },
    iconImage:{
      width:190,
      height:190,
      borderRadius:95,
    },
    nameContainer:{
      alignItems:"center",
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