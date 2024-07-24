import { StyleSheet, Image, View, Text } from "react-native";
import React , { useState } from 'react';
import PrimaryText from "../components/text_components/PrimaryText";
import ContentContainer from "../components/ContentContainer";
import { useAppSelector } from "../hooks";
import RightDrop from "../components/RightDrop";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";

import HeaderText from "../components/text_components/HeaderText";
import ToggleButton from "../components/togglebutton";

const Setting = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Setting">) => {
  const name = useAppSelector((state) => state.user.data?.name);
  const email = useAppSelector((state) => state.user.data?.emailAddress);

  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [dataToShow, setDataToShow] = useState<string[]>([]);
  const handleSearch = (keyword: string) => {
    // 执行搜索逻辑，比如发起 API 请求等
    console.log('Searching for:', keyword);
    setSearchKeyword(keyword);
    switch (keyword.toLowerCase()) {
      case 'apple':
        setDataToShow(['red', 'medium']);
        break;
      case 'banana':
        setDataToShow(['yellow', 'medium']);
        break;
      case 'orange':
        setDataToShow(['orange', 'small']);
        break;
      default:
        setDataToShow([]);
        break;}
  };

  return (
    <View>
    <View style={[styles.share]}>  
    </View> 
    
    <View style={[styles.box]}>
      <Image style={{ height: 200,width: 200,marginTop: 5, resizeMode: 'contain'}} source={require("../assets/laptop.png")}></Image>

    </View>
      
      <ContentContainer>
        
        
       
        <View style={styles.alternativesContainer}>
        <View style={styles.pointContainer}>
        <Text style={styles.boldtext}>Settings</Text>
        
        
        </View>
        
        </View>
        

        

          
          
          <View style={styles.textContainer}>
          
          <Text style={styles.chirldtext}>Notification                           <ToggleButton/></Text>



          </View>
          <View style={styles.textContainer}>
          <Text style={styles.chirldtext}>Dark mode                             <ToggleButton/></Text>
          
         
            
            
          </View>
        
            

        



       


      </ContentContainer>
    </View>
  );
};

export default Setting;


const styles = StyleSheet.create({
  boldtext:{fontWeight: "bold",fontSize: 30},
  chirldtext:{fontSize: 20},

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
    minWidth: "100%",
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
    height: "40%",
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
