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
import firestore from "@react-native-firebase/firestore";
import { fetchUserData } from "../features/userSlice";

export default function Reward({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "Reward">) {
  const rewardData = useAppSelector((state) => state.reward.data);
  const dispatch = useAppDispatch();
  const email = useAppSelector((state) => state.user.data?.emailAddress);
  let point = useAppSelector((state) => state.user.data?.points);
  const { item } = route.params; // 获取传来的 item 参数
  const validityStartDate = rewardData?.validityStartDate;
  const validityEndDate = rewardData?.validityEndDate;
  const [newPoint, setNewPoint] = useState(point || "");
  const [error, setError] = useState<string | null>(null); // 保存错误信息
  const [isLoading, setIsLoading] = useState(false); // 添加加载状态

  const updateUserPoints = async () => {
    if (!email) {
      setError("Email is undefined");
      return;
    }

    try {
      setIsLoading(true); // 開始加載
      setError(null); // 清除之前的錯誤信息

      const userSnapshot = await firestore()
        .collection("Users")
        .where("emailAddress", "==", email)
        .get();

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0].ref;
        await userDoc.update({
          points: Number(point),
        });

        console.log("User data updated successfully", point);

        // 更新 Redux 中的用戶資料
        const userData = await dispatch(fetchUserData(email)).unwrap();
      } else {
        setError("User not found");
      }
    } catch (error: any) {
      setError(error.message);
      console.error("Error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const storePointsUsedDataToFirebase = async () => {
    try {
      // 获取当前时间戳
      const currentTime = firestore.Timestamp.fromDate(new Date());

      // 创建存储数据
      const pointsUsedData = {
        points: rewardData?.price,
        date: currentTime, // 当前时间戳
      };

      // 查找该用户文档
      const userSnapshot = await firestore()
        .collection("Users")
        .where("emailAddress", "==", email)
        .get();

      // 如果查询到用户
      if (!userSnapshot.empty) {
        // 获取用户文档的引用
        const userDocRef = userSnapshot.docs[0].ref;

        // 将数据添加到 "PointsUsed" 子集合
        await userDocRef.collection("PointsUsed").add(pointsUsedData);

        console.log("Points used data stored successfully.");
      } else {
        console.log("User not found");
      }
    } catch (error) {
      console.error("Error storing points used data:", error);
    }
  };

  const starttimestamp = new Date(
    validityStartDate?.seconds * 1000 + validityStartDate?.nanoseconds / 1e6
  );
  const endtimestamp = new Date(
    validityEndDate?.seconds * 1000 + validityEndDate?.nanoseconds / 1e6
  );

  const startluxonDateTime =
    DateTime.fromJSDate(starttimestamp).setZone("Asia/Singapore");
  const endluxonDateTime =
    DateTime.fromJSDate(endtimestamp).setZone("Asia/Singapore");

  const [isInvalid, setIsInvalid] = useState(false);

  const shareReward = async () => {
    try {
      const result = await Share.share({
        message: "Check out this amazing reward!",
        url: "https://firebasestorage.googleapis.com/v0/b/time-wave-88653.appspot.com/o/sewing%20machine.png?alt=media&token=f42e4f7e-ed65-441a-b05b-66f743a70554",
        title: "Reward Share",
      });

      if (result.action === Share.sharedAction) {
        console.log(
          result.activityType ? result.activityType : "Shared successfully"
        );
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  };

  useEffect(() => {
    if (item?.RID) {
      dispatch(fetchRewardData(item.RID));
    }
  }, [dispatch, item?.RID]); // 仅当 `item.RID` 变化时重新拉取

  useEffect(() => {
    if (rewardData) {
      const now = DateTime.now();

      if (now < startluxonDateTime) {
        setIsInvalid(true);
        console.log("Too early");
      } else if (now > endluxonDateTime) {
        setIsInvalid(true);
        console.log("Too late");
      } else {
        setIsInvalid(false);
        console.log("Now valid");
      }
    }
  }, [rewardData]);

  const showAlert2 = () => {
    Alert.alert(
      "Redeemed Successfully!",
      `You have used ${rewardData?.price} points. Remaining Balance: ${point} points.`
    );
  };
  const showTip = async () => {
    try {
      // 更新积分
      point -= rewardData?.price;

      await setNewPoint(point); // 更新状态

      // 更新 Firebase
      await storePointsUsedDataToFirebase();

      // 调用更新用户积分的函数
      await updateUserPoints();

      // 更新 Redux 中的积分
      await dispatch(fetchUserData(email)); // 重新加载用户数据

      // 显示成功提示
      showAlert2();
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to redeem points"
      );
    }
  };

  useEffect(() => {
    if (!email) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        await dispatch(fetchUserData(email));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [dispatch, email]);

  const isFeedbackFilled = useAppSelector(
    (state) => state.user.data?.isFeedbackFilled
  );

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  useEffect(() => {
    // 检查是否从表单页面返回，并接收到 formSubmitted 状态
    if (route.params?.formSubmitted) {
      setIsFormSubmitted(route.params.formSubmitted);
    }
  }, [route.params]);

  const showAlert = () => {
    console.log("isFeedbackFilled", isFeedbackFilled);
    Alert.alert(
      "Redeem Reward",
      isFeedbackFilled
        ? "Congratulations! You can now redeem your reward."
        : "Please fill out the form to redeem this reward.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: isFeedbackFilled ? "Proceed" : "Go to Form",
          onPress: () => {
            if (isFeedbackFilled) {
              console.log("Proceeding with reward redemption...");
              proceedRedemption();
            } else {
              navigation.navigate("GoogleFormScreen");
            }
          },
        },
      ]
    );
  };

  const proceedRedemption = () => {
    const price = rewardData?.price;
    if (price !== undefined) {
      if (point >= price) {
        Alert.alert(
          "Get This Reward!",
          `Redeem with ${price} points?`,
          [
            { text: "Cancel", style: "cancel" },
            { text: "Confirm", onPress: () => showTip() },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          "Insufficient Points",
          "You don't have enough points to redeem this reward."
        );
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.box}>
        <TouchableOpacity onPress={shareReward} style={styles.shareButton}>
          <Image
            style={{ height: 30, width: 30 }}
            source={require("../assets/share.png")}
          />
        </TouchableOpacity>

        <Image source={{ uri: rewardData?.image }} style={styles.rewardImage} />

        <Image
          style={styles.supplierLogo}
          source={{ uri: rewardData?.supplierLogo }}
        />
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

        <View style={styles.scrollViewContainer}>
          <ScrollView contentContainerStyle={styles.scrollcontainer}>
            <View style={styles.boxs}>
              <Text style={styles.boldtext}>Highlight</Text>
              <Text style={{ marginTop: 5, marginBottom: 10 }}>
                {rewardData?.highlight}
              </Text>
            </View>
            <View style={styles.boxs}>
              <Text style={styles.boldtext}>Terms & Conditions</Text>
              <Text style={{ marginTop: 5, marginBottom: 10 }}>
                {rewardData?.termsConditions}
              </Text>
            </View>
            <View style={styles.boxs}>
              <Text style={styles.boldtext}>Contact Info</Text>
              <Text style={{ marginTop: 5, marginBottom: 10 }}>
                {rewardData?.contactInfo}
              </Text>
            </View>
          </ScrollView>
        </View>
      </ContentContainer>

      <View style={styles.redeemContainer}>
        <TextButton
          style={{
            position: "absolute",
            bottom: 20,
            left: 5,
            right: 5,
            backgroundColor: "#FF8D13",
            elevation: 1,
          }}
          textStyle={styles.mainButtonText}
          onPress={
            isInvalid
              ? () => Alert.alert("This reward is invalid or expired.")
              : showAlert
          }
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
    position: "absolute",
    top: 145, // Adjust as needed
    bottom: 100, // Adjust as needed to fit your design
    left: 5,
    right: 5,
  },
  boxs: {
    width: "90%",
    marginVertical: 10,
    justifyContent: "space-evenly",
    alignItems: "flex-start",
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
    position: "absolute",
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
    position: "relative", // 使得子元素能够绝对定位
  },
  shareButton: {
    position: "absolute", // 绝对定位
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
    position: "absolute", // 绝对定位
    bottom: 10, // 距离底部的距离
    left: 10, // 距离左边的距离
  },
  mainButtonText: {
    color: "#06090C",
  },
  verticleLine: {
    height: "100%",
    width: StyleSheet.hairlineWidth,
    backgroundColor: "#909090",
  },
});
