import { Pressable, StyleSheet, Text, View, Image,ScrollView} from "react-native";
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
let DescriptionText="To put it simply, any further consideration is getting more complicated against the backdrop of The Penetration of Autonomous Accomplishment ";
let TermsAndConditionsText="Resulting from review or analysis of threats and opportunities, we can presume that components of the interpretation of the comprehensive set of policy statements particularly the potential role models or the effective time management the share of corporate responsibilities in terms of its dependence on The Strategy of Excellent Feature ";

export default function PastRewardsDetailsPage({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "PastRewardsDetailsPage">) {
  
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
              source={require("../assets/used.png")}
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
                <View style={{backgroundColor:'lightgrey',width:1,height:'90%',marginTop:5}}>                  
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
            
            <View style={{backgroundColor:'lightgrey',marginTop:10,height:1}}></View>
            
              <View>
                <Text style={{fontWeight:'bold',marginBottom:8,marginTop:10}}>Description</Text>
                <Text>{DescriptionText}</Text>
              </View>
              <View>
                <Text style={{fontWeight:'bold',marginBottom:8,marginTop:12}}>Terms & Conditions</Text>
                <Text>{TermsAndConditionsText}</Text>
              </View>            

            <View style={{backgroundColor:'lightgrey',marginTop:10,height:1}}></View>

            <TextButton onPress={() => navigation.navigate("ActiveRewardsDetails_UseNowPage")}>
                Copy Reward Code
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
  mainButton: {
    backgroundColor: "#E3EAE7",
    height: "60%",
    minWidth: "20%",
    paddingHorizontal: 20,
    marginTop: 0,
  },
  mainButtonText: {
    color: "#06090C",
  },

});
