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

const ActivityInfo = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "ActivityInfo">) => {
  const {item} = route.params;
  
  return (
    <>
    <View>
      <ScrollView>
        {/* Image Part */}
        <View>
        {/*  horizontal share button */}
          <Image 
            source={{
              uri: item.logo
            }}
            // style={styles.iconImage}
            />   
          <Pressable><Image></Image></Pressable>
        </View>
        {/* Name and description part */}
        <ContentContainer>
          <View style={styles.activityName}>
            <Text style={styles.activityName}>{item.name}</Text>
          </View>
          <View>
            <Text>Location</Text>
            <Text>{item.location}</Text>
          </View>
          {/* <View></View>  line*/}
          <View>
            <Text>Date</Text>
            <Text>{item.date}</Text>
          </View>
          {/* line */}
          <View>
            <Text>Description</Text>
            <Text>{item.description}</Text>
            <Text>Terms & Condition</Text>
            <Text>{item.TandC}</Text>
            <Text>Contact Info</Text>
            <Text>{item.contactinfo}</Text>
          </View>
          
        </ContentContainer>
      </ScrollView>
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
    alignContent:"center",
  },
  activityName:{
    fontSize: 24,
    fontWeight: "300",
  },
  LDcontainer:{
    marginTop: 4,
    
  },
  LDtitle:{
    fontSize:18,
  },
  LDdetails:{
    fontWeight:"bold",
    fontSize:18,
  },
  textTitle:{
    fontSize:18,
    fontWeight:"bold",
  },
  textDetails:{
    fontSize:16,
    color:"grey",
  },

})