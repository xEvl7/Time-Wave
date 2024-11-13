import {
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Share,
} from "react-native";

import TextButton from "../components/TextButton";
import ContentContainer from "../components/ContentContainer";

import { fetchRewardData } from "../features/rewardSlice";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import { useAppDispatch, useAppSelector } from "../hooks";
import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";

let testpoint = 200;

export default function Reward({
  navigation,
  route
}: NativeStackScreenProps<RootStackParamList, "Reward">) {

  const rewardData = useAppSelector((state) => state.reward.data);
  const dispatch = useAppDispatch();
  const { item } = route.params; // 获取传来的 item 参数
  const validityStartDate = rewardData?.validityStartDate;
  const validityEndDate = rewardData?.validityEndDate;

  // 使用 Firebase Timestamp 创建 JavaScript Date 对象
  const starttimestamp = new Date(
    validityStartDate?.seconds * 1000 + validityStartDate?.nanoseconds / 1e6
  );
  const endtimestamp = new Date(
    validityEndDate?.seconds * 1000 + validityEndDate?.nanoseconds / 1e6
  );

  // 将 JavaScript Date 对象转换为 Luxon DateTime 对象
  const startluxonDateTime = DateTime.fromJSDate(starttimestamp).setZone("Asia/Singapore");
  const endluxonDateTime = DateTime.fromJSDate(endtimestamp).setZone("Asia/Singapore");

  const [isInvalid, setIsInvalid] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const shareReward = async () => {
    try {
      const result = await Share.share({
        message: 'Check out this amazing reward!',
        url: 'https://firebasestorage.googleapis.com/v0/b/time-wave-88653.appspot.com/o/sewing%20machine.png?alt=media&token=f42e4f7e-ed65-441a-b05b-66f743a70554',
        title: 'Reward Share'
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type: ' + result.activityType);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Unknown error occurred');
      }
    }
  };

  useEffect(() => {
    const RID = item.RID;
    dispatch(fetchRewardData(RID));
  }, [dispatch]);

  useEffect(() => {
    if (rewardData) {
      const now = DateTime.now();
      console.log('Current Time:', now);
      console.log('Validity Start Time:', startluxonDateTime);
      console.log('Validity End Time:', endluxonDateTime);

      // 检查奖励是否无效
      if (now < startluxonDateTime) {
        setIsInvalid(true); // 奖励尚未生效
        console.log('Too early');
      } else if (now > endluxonDateTime) {
        setIsInvalid(true); // 奖励已过期
        console.log('Too late');
      } else {
        setIsInvalid(false); // 奖励有效
        console.log('Now valid');
      }
    }
  }, [rewardData]);

  const showTip = () => {
    testpoint -= 100;
    Alert.alert(
      'Redeemed with 100 points!',
      'Use this reward by ' + DateTime.now().toFormat("d MMM yyyy") + 
      ' Remaining Balance: ' + testpoint + ' points'
    );
  };

  const showAlert = () => {
    const price = rewardData?.price;
    if (price !== undefined) {
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
          "Don't worry! The more time you contribute, the more timebank points you will earn."
        );
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.box}>
        <TouchableOpacity onPress={shareReward} style={styles.shareButton}>
          <Image
          style={{ height: 30, width: 30 }} // 调整大小以适应
          source={require("../assets/share.png")}
          />
        </TouchableOpacity>
  
        <Image source={{ uri: rewardData?.image }} style={styles.rewardImage} />

        <Image style={styles.supplierLogo} source={{ uri: rewardData?.supplierLogo }} />
      </View>


      <ContentContainer>
        <Text style={styles.boldtext}> {rewardData?.name} </Text>

        <View style={styles.alternativesContainer}>
          <View style={styles.pointContainer}>
            <Text style={styles.boldtext}> Prices</Text>
            <Text style={{ fontSize: 20 }}>{rewardData?.price} points </Text>
          </View>
          <View style={styles.verticleLine} />
          <View style={styles.validityContainer}>
            <Text style={styles.boldtext}>Validity</Text>
            <Text style={{ fontSize: 20 }}>
              {startluxonDateTime?.toFormat("d MMM yyyy")} to
            </Text>
            <Text style={{ fontSize: 20 }}>
              {endluxonDateTime?.toFormat("d MMM yyyy")}
            </Text>
          </View>
        </View>

        <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth }} />

        <View style={styles.scrollViewContainer}>
          <ScrollView contentContainerStyle={styles.scrollcontainer}>
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
      />

      <View style={styles.redeemContainer}>
        <TextButton
          style={{ position: 'absolute', bottom: 20, left: 5, right: 5, backgroundColor: "#FF8D13", elevation: 1 }}
          textStyle={styles.mainButtonText}
          onPress={isInvalid ? () => Alert.alert('This reward is invalid or expired.') : showAlert}
        >
          Redeem
        </TextButton>
      </View>
    </View>
  );
}

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
    height: "22%",
    width: "100%",
    backgroundColor: "#FF8D13",
    alignItems: "center",
    justifyContent: "center",
    position: 'relative', // 使得子元素能够绝对定位
  },
  shareButton: {
    position: 'absolute', // 绝对定位
    top: 10, // 距离顶部的距离
    right: 10, // 距离右边的距离
  },
  rewardImage: {
    width: 100,
    height: 100,
    // 其他样式...
  },
  supplierLogo: {
    width: 40,
    height: 40,
    position: 'absolute', // 绝对定位
    bottom: 10, // 距离底部的距离
    left: 10, // 距离左边的距离
  },
  mainButtonText: {
    color: "#06090C",
  },
  verticleLine: {
    height: '100%',
    width: StyleSheet.hairlineWidth,
    backgroundColor: '#909090',
  },
});
