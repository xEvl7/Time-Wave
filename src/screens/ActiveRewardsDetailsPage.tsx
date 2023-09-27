import { Pressable, StyleSheet, Text, View, Image } from "react-native";
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

let points = 120;

export default function ActiveRewardsDetailsPage({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "ActiveRewardsDetailsPage">) {
  
  return (
    <View>      
        <View style={styles.BackgroundStyle}>
          <View>
            <Image       
            source={require("../assets/test3.png")}
            style={styles.image}/></View>
          <ContentContainer>
            <Text style={styles.Header}>
              Medical Check Up
            </Text>          
            <View>
            <Image
              source={require("../assets/active-icon.png")}
              style={{marginLeft:'40%',marginTop:10}}
            />
            </View>
            <View style={{alignContent:'center'}}>      
              <View style={styles.TabStyle}> 
                <View>                  
                    <Text style={styles.TabNavigateTextMajor}>Redeemed with           
                    </Text>                     
                    <Text style={{fontSize:17,fontWeight:'bold',marginTop:20,marginLeft:5}}>
                    {points} Points
                    </Text>                              
                </View>
                <View>                  
                  <Text style={styles.TabNavigateTextMinor}>Expired on         
                  </Text>          
                  <Text style={{fontSize:20,fontWeight:'bold',marginTop:20}}>
                    3 OCT 2023
                  </Text>
                  <Text style={{fontSize:20,fontWeight:'bold'}}>                    
                    11:59 PM
                  </Text>
                </View>
              </View>
            </View>

            <TextButton style={styles.mainButton} textStyle={styles.mainButtonText}>
             Use Now
            </TextButton>
               
          </ContentContainer>
      </View>
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
  BackgroundStyle: {
    height: 150,
    width: "100%",
    backgroundColor:"#FF8D13" ,
    //alignItems: "center",
    //justifyContent: "center",
  },
  Header:{
    alignSelf:'center',
    fontSize:30,
  },
  image: {
    alignSelf : "center" ,
    marginTop:10,
    marginBottom:30,
    //position: 'absolute',
    //top: 0,
    //left: 0,
  },
  TabStyle:{
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  TabPressMajor:{
    backgroundColor:"black",
    height:2,
    width:"90%",
    marginTop:10,
  },
  TabNavigateTextMajor:{
    fontSize:18,
  },
  TabNavigateTextMinor:{
    fontSize:18,
  },
  

});
