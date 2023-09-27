import { Pressable, StyleSheet, Text, View, Image ,ScrollView} from "react-native";
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

// type FormData = {
//   emailAddress: string;
//   password: string;
// };
let expireDate ='19 AUG 2024';

export default function ActiveRewardsPage({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "ActiveRewardsPage">) {
  return (
    <View>
     <View style={{alignContent:'center'}}>      
        <View style={styles.TabStyle}> 
          <View>
            <Pressable onPress={() => navigation.navigate("ActiveRewardsPage")}>
              <Text style={styles.TabNavigateTextMajor}>Active Rewards           
              </Text>                     
            </Pressable>
            <View style={styles.TabPressMajor}></View>            
          </View>
          <View>
            <Pressable onPress={() => navigation.navigate("PastRewardsPage")}>
              <Text style={styles.TabNavigateTextMinor}>Past Rewards           
              </Text>            
            </Pressable>          
          </View>
        </View>
      </View>

        



    <View style={{marginTop:5}}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} >
              
              <Pressable onPress={() => navigation.navigate("ActiveRewardsDetailsPage")}>
                <View style={styles.gridItem}>
                  
                    <View style={styles.imageBox}>
                      <Image
                        source={require("../assets/test3.png")}
                        style={styles.image}
                      />
                    </View>
                    <View style={styles.text}>                  
                      <Text style={styles.subDescription}>Official Mavcap</Text>
                      <Text style={styles.description}>Medical Checkup</Text>
                      <View style={styles.pointContainer}>
                        <Text style={styles.pointDesc}> Expires on {expireDate}</Text>
                      <Image
                          source={require("../assets/use-now.png")}
                          style={{marginLeft:'40%',marginTop:10}}
                        />
                      </View>  
                    </View>                  
                </View>
              </Pressable>                        
              

            </ScrollView>
          </View>

      <ContentContainer>
      </ContentContainer>
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
  MyRewardsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  HeadingContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  TabStyle:{
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  TabPressMajor:{
    backgroundColor:"#FF8D13",
    height:'5%',
    width:"100%",
    marginTop:8,
  },
  TabNavigateTextMajor:{
    fontWeight:'bold',
    fontSize:22,
    color:'#FF8D13',
  },
  TabNavigateTextMinor:{
    fontWeight:'bold',
    fontSize:22,
    color:'#BABABA',
  },
  gridItem: {
    //marginLeft:25,
    width: '100%', // 两个格子并排，留出一些间隙
    height: 170,
    marginBottom: 10,
    backgroundColor:"#FFFFFF",
    //borderRadius: 20, 
    flexDirection:"row",
    borderColor:'#BDBDBD',
    borderWidth: 1,
  },
  imageBox: {
    marginLeft: 10,
    alignSelf : "center" ,
    //resizeMode: 'cover',
    height:'70%',
    width:"40%",
    backgroundColor:'#F1CFA3',
    //position: 'absolute',
    //top: 0,
    //left: 0,

  },
  image: {
    alignSelf : "center" ,
    resizeMode: 'cover',
    marginTop:10,
    //position: 'absolute',
    //top: 0,
    //left: 0,
  },
  text: {
    backgroundColor:"#FFFFFF",
    height:'60%',
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20,    
  },
  description: {
    fontSize: 22,
    textAlign: 'left',
    marginTop: 1,
    marginLeft: 10,
    fontWeight:'bold',
  },
  subDescription: {
    fontSize: 13,
    textAlign: 'left',
    marginLeft: 10,
    marginTop:25,
  },
  point: {
    fontWeight:'bold',
    fontSize: 15,
    textAlign: 'left',
    marginLeft: 10,
    color:'#FF8D13',
  },
  pointDesc: {
    marginLeft:8,
    marginTop:20,
    fontSize: 15,
    textAlign: 'left',
  },
  pointContainer:{
    //flexDirection:'row',
    //marginTop:10,
  }
});
