import {
  TouchableOpacity, 
  Alert,
  Pressable, 
  ScrollView,
  StyleSheet, 
  Text, 
  View, 
  Image,
  RefreshControl 
} from "react-native";

import firestore from "@react-native-firebase/firestore";
import TextButton from "../components/TextButton";
import HeaderText from "../components/text_components/HeaderText";
import BackgroundImageBox from "../components/BackgroundImageBox";
import ContentContainer from "../components/ContentContainer";

import { fetchRewardData } from "../features/rewardSlice";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import { useAppDispatch, useAppSelector } from "../hooks";
import React, { useState, useEffect } from "react";

let testpoint = 200;

export default function Reward({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Reward">) {

  const rewardData = useAppSelector((state) => state.reward.data);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const RID = 'R2';
    dispatch(fetchRewardData(RID));
  }, [dispatch]);

  let img = rewardData?.image;

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const showTip = () => {
    testpoint -= 100;
    Alert.alert(
      'Redeemed with 100 points!',
      'Use this reward by ' + now.toLocaleDateString() + ' Remaining Balance: ' + testpoint + ' points',
    );
  };

  const showAlert = () => {
    var price = rewardData?.price;
    if (price != undefined) {
      if (testpoint >= price) {
        Alert.alert(
          'Get This Reward!',
          'Redeem with ' + rewardData?.price + ' points?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Confirm', onPress: () => showTip() },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          "You don't have enough points",
          "Don't worry! The more time you contribute, the more timebank points you will earn.",
        );
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.share}>
        <Image 
          style={{ height: 50, width: 50, marginTop: 5, marginBottom: 5, marginRight: 5, resizeMode: 'contain' }} 
          source={require("../assets/share.png")} 
        />
      </View> 

      <View style={styles.box}>
        <Image style={{ width: 40, height: 40 }} source={require("../assets/jpg.png")} />
        <Image source={{ uri: img }} style={{ width: 100, height: 100 }} />
      </View>
      
      <ContentContainer>
      <Text style={styles.boldtext}> {rewardData?.name} </Text>

        <View style={styles.alternativesContainer}>
          <View style={styles.pointContainer}>
            <Text style={styles.boldtext}> Prices</Text>
            <Text style={{ fontSize: 20 }}>{rewardData?.price} points </Text>
          </View>
          <View style={styles.verticleLine} />{/* vertical line */}
          <View style={styles.validityContainer}>
            <Text style={styles.boldtext}>Validity</Text>
            <Text style={{ fontSize: 20 }}>{rewardData?.validityStartDate} to</Text>
            <Text style={{ fontSize: 20 }}>{rewardData?.validityEndDate} </Text>
          </View>
        </View>
        
        <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth }} />{/* line */}

        <View style={styles.scrollViewContainer}>
          <ScrollView 
            contentContainerStyle={styles.scrollcontainer} 
            >
            <View style={styles.boxs}>
              <Text style={styles.boldtext}>Highlight</Text>
              <Text style={{ marginTop: 5, marginBottom: 10 }}>{rewardData?.highlight}</Text>
            </View>
            
            <View style={styles.boxs}>
              <Text style={styles.boldtext}>Terms & Conditions</Text>
              <Text style={{ marginTop: 5, marginBottom: 10 }}>{rewardData?.termsConditions}</Text>
            </View>

            <View style={styles.boxs}>
              <Text style={styles.boldtext}>Contact Info</Text>
              <Text style={{ marginTop: 5, marginBottom: 10 }}>{rewardData?.contactInfo}</Text>
            </View>
          </ScrollView>
        </View>
        
      </ContentContainer>

      <View
        style={{
          position: 'absolute',
          top: 620,
          left: 5,
          right: 5,
          borderBottomColor: 'black',
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />{/* line */}

      <View style={styles.redeemContainer}>
        <TextButton 
          style={{ position: 'absolute', bottom: 20, left: 5, right: 5, backgroundColor: "#FF8D13", elevation: 1 }}  
          textStyle={styles.mainButtonText} 
          onPress={showAlert}
        >
          Redeem
        </TextButton>
      </View>
    </View>
  );
}

const now = new Date(); // get the current date

const styles = StyleSheet.create({
  scrollcontainer: {
    padding: 5,
  },
  scrollViewContainer: {
    position: 'absolute',
    top: 145, // Adjust as needed
    bottom: 100, // Adjust as needed to fit your design
    left: 5,
    right: 5,
  },
  boxs: {
    width: '90%',
    marginVertical: 10,
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
  },
  boldtext: { fontWeight: "bold", fontSize: 25 },
  alternativesContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    marginTop: 10,
  },
  pointContainer: {
    justifyContent: "space-evenly",
    width: "35%",
    marginBottom: 10,
  },
  validityContainer: {
    justifyContent: "space-evenly",
    width: "65%",
    marginBottom: 10,
    marginLeft: 20,
  },
  textContainer: {
    minWidth: "78%",
    flex: 1,
  },
  redeemContainer: {
    minWidth: "78%",
    height: "10%",
    position: 'absolute',
    bottom: 20,
    right: 0,
    left: 0,
  },
  box: {
    flexDirection: "row",
    height: "16%",
    width: "100%",
    backgroundColor: "#FF8D13",
    alignItems: "center",
    justifyContent: "center",
  },
  share: {
    flexDirection: "row",
    height: "7%",
    width: "100%",
    backgroundColor: "#FF8D13",
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