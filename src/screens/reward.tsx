import {
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
} from "react-native";
import TextButton from "../components/TextButton";
import ContentContainer from "../components/ContentContainer";
import { fetchRewardData } from "../features/rewardSlice";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import { useAppDispatch, useAppSelector } from "../hooks";
import React, { useState, useEffect, useMemo } from "react";
import { DateTime } from "luxon";
import {
  fetchUserData,
  storePointsUsedDataToFirebase,
  updateUserPoints,
} from "../features/userSlice";
import { shareReward } from "../utils/shareUtils";
import CustomAlert from "../components/CustomAlert";

export default function Reward({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "Reward">) {
  const defaultImg =
    "https://firebasestorage.googleapis.com/v0/b/time-wave-88653.appspot.com/o/sewing%20machine.png?alt=media&token=f42e4f7e-ed65-441a-b05b-66f743a70554";

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertButtons, setAlertButtons] = useState<
    {
      text: string;
      onPress?: () => void;
      style?: "cancel" | "default" | "destructive";
    }[]
  >([]);

  const showCustomAlert = (title: string, message: string, buttons: any) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertButtons(buttons);
    setTimeout(() => setAlertVisible(true), 0);
  };

  // 获取 Redux store 的数据
  const dispatch = useAppDispatch();
  const emailAddress = useAppSelector((state) => state.user.data?.emailAddress);
  const rewardData = useAppSelector((state) => state.reward.data);
  let points = useAppSelector((state) => state.user.data?.points);

  const [newPoint, setNewPoint] = useState(points || "");
  const [error, setError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);

  const { item } = route.params;

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // 🎯 使用 useMemo 计算时间，只有 rewardData 变化时才会更新
  const startluxonDateTime = useMemo(() => {
    if (!rewardData?.validityStartDate) return null;
    return DateTime.fromISO(rewardData.validityStartDate).setZone(userTimeZone);
  }, [rewardData]);

  const endluxonDateTime = useMemo(() => {
    if (!rewardData?.validityEndDate) return null;
    return DateTime.fromISO(rewardData.validityEndDate).setZone(userTimeZone);
  }, [rewardData]);

  useEffect(() => {
    if (item.RID) {
      setIsLoading(true);
      dispatch(fetchRewardData(item.RID))
        .unwrap()
        .finally(() => setIsLoading(false));
    }
  }, [dispatch, item.RID]);

  useEffect(() => {
    if (!rewardData || !startluxonDateTime || !endluxonDateTime) return;

    const now = DateTime.now();

    if (now < startluxonDateTime) {
      setIsInvalid(true);
      console.log("Reward not yet available.");
    } else if (now > endluxonDateTime) {
      setIsInvalid(true);
      console.log("Reward expired.");
    } else {
      setIsInvalid(false);
      console.log("Reward available.");
    }
  }, [rewardData, startluxonDateTime, endluxonDateTime]);

  const isFeedbackFilled = useAppSelector(
    (state) => state.user.data?.isFeedbackFilled
  );

  const checkIsFeedbackFilled = () => {
    console.log("Checking isFeedbackFilled... :", isFeedbackFilled);
    showCustomAlert(
      "Redeem Reward",
      isFeedbackFilled
        ? "Congratulations! \nYou can now redeem your reward."
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
    if (price !== undefined && points !== undefined) {
      if (points >= price) {
        showCustomAlert(
          "Get This Reward!",
          `Redeem with ${price} points? \n\n Your current points: ${points}`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Confirm",
              onPress: () => updateDataAfterRedemption(),
            },
          ]
        );
      } else {
        showCustomAlert(
          "Insufficient Points",
          "You don't have enough points to redeem this reward.",
          [{ text: "OK" }]
        );
      }
    }
  };

  const updateDataAfterRedemption = async () => {
    try {
      // 更新积分
      if (points != undefined && rewardData?.price != undefined) {
        points -= rewardData?.price;
        setNewPoint(points); // 更新状态
      }

      if (
        emailAddress != undefined &&
        rewardData?.price != undefined &&
        points != undefined
      ) {
        // 获取当前时间戳
        const currentTime = new Date().toISOString();

        // 创建存储数据
        const pointsUsedData = {
          date: currentTime,
          points: rewardData?.price,
        };

        await Promise.all([
          dispatch(storePointsUsedDataToFirebase(pointsUsedData)).unwrap(),
          dispatch(updateUserPoints({ emailAddress, points })).unwrap(),
        ]);

        await dispatch(fetchUserData(emailAddress)).unwrap();

        showCustomAlert(
          "Redeemed Successfully!",
          `You have used ${rewardData?.price} points.\n\nRemaining Balance: ${points} points.`,
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      showCustomAlert(
        "Error",
        error instanceof Error ? error.message : "Failed to redeem points",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.box}>
        <TouchableOpacity
          onPress={() =>
            shareReward(
              "Check out this amazing reward!",
              rewardData?.image ?? ""
            )
          }
          style={styles.shareButton}
        >
          <Image
            style={{ height: 30, width: 30 }}
            source={require("../assets/share.png")}
          />
        </TouchableOpacity>

        <Image
          source={{
            uri: rewardData?.image ?? defaultImg,
          }}
          style={styles.rewardImage}
        />

        <Image
          style={styles.supplierLogo}
          source={{
            uri: rewardData?.supplierLogo ?? defaultImg,
          }}
        />
      </View>

      <ContentContainer>
        <View style={styles.titleContainer}>
          <Text style={styles.boldtext}>{rewardData?.name}</Text>
        </View>

        <View style={styles.alternativesContainer}>
          <View style={styles.pointContainer}>
            <Text style={styles.boldtext}>Prices</Text>
            <Text style={{ fontSize: 20 }}>{rewardData?.price} points</Text>
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
          onPress={
            isInvalid
              ? () =>
                  showCustomAlert(
                    "Reward Invalid!",
                    "This reward is invalid or expired.",
                    [{ text: "OK" }]
                  )
              : () => checkIsFeedbackFilled()
          }
        >
          Redeem
        </TextButton>

        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          buttons={alertButtons}
          onClose={() => setAlertVisible(false)}
        />
      </View>
    </View>
  );
}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  scrollcontainer: {
    padding: 5,
  },
  scrollViewContainer: {
    position: "absolute",
    top: 145,
    bottom: 100,
    left: 5,
    right: 5,
  },
  boxs: {
    width: "90%",
    marginVertical: 10,
    justifyContent: "space-evenly",
    alignItems: "flex-start",
  },
  titleContainer: {
    marginLeft: 10,
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
    width: "50%",
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
    marginHorizontal: "5%",
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
    width: screenWidth, // 让图片宽度等于屏幕宽度
    aspectRatio: 16 / 7, // 例如 16:5 的长宽比，按你的图片调整
    resizeMode: "contain",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  supplierLogo: {
    width: 50,
    height: 50,
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
