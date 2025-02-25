import {
  TouchableOpacity,
  ScrollView,
  StyleSheet,
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
import React, { useState, useEffect, useMemo, useLayoutEffect } from "react";
import { DateTime } from "luxon";
import {
  fetchUserData,
  storePointsUsedDataToFirebase,
  updateUserPoints,
} from "../features/userSlice";
import { shareReward } from "../utils/shareUtils";
import CustomAlert from "../components/CustomAlert";
import HeaderText from "../components/text_components/HeaderText";
import ParagraphText from "../components/text_components/ParagraphText";
import SecondaryText from "../components/text_components/SecondaryText";

export default function Reward({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "Reward">) {
  const { item } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Reward Details", // 设置页面标题
      headerRight: () => (
        <TouchableOpacity
          // style={{ marginRight: 10 }} // 右侧间距
          onPress={() => shareReward(item.RID ?? "")}
        >
          <Image
            style={styles.shareIcon}
            source={require("../assets/share.png")}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, item]);

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

    if (isFeedbackFilled) {
      console.log("Proceeding with reward redemption...");
      proceedRedemption(); // 直接进行兑换，不显示弹窗
      return;
    }

    // 如果 isFeedbackFilled 为 false，则弹出提示框
    showCustomAlert(
      "Redeem Reward",
      "Please fill out the form to redeem this reward.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Go to Form",
          onPress: () => {
            navigation.navigate("GoogleFormScreen");
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
          `Redeem with ${price} points?\n\nYour current points: ${points}`,
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
      <View style={styles.headerContainer}>
        {/* <TouchableOpacity
          style={styles.shareButton}
          onPress={() =>
            shareReward(
              "Check out this amazing reward!",
              rewardData?.image ?? ""
            )
          }
        >
          <Image
            style={styles.shareIcon}
            source={require("../assets/share.png")}
          />
        </TouchableOpacity> */}

        <Image
          style={styles.rewardImage}
          source={{
            uri: rewardData?.image ?? defaultImg,
          }}
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
          <HeaderText>{String(rewardData?.name ?? "")}</HeaderText>
        </View>

        <View style={styles.alternativesContainer}>
          <View style={styles.pointsContainer}>
            <HeaderText>Points</HeaderText>
            <SecondaryText>{String(rewardData?.price)} points</SecondaryText>
          </View>
          <View style={styles.verticleLine} />
          <View style={styles.validityContainer}>
            <HeaderText>Validity</HeaderText>
            <SecondaryText>
              {typeof startluxonDateTime?.toFormat === "function"
                ? startluxonDateTime.toFormat("d MMM yyyy")
                : "Unknown"}{" "}
              to{" "}
              {typeof endluxonDateTime?.toFormat === "function"
                ? endluxonDateTime.toFormat("d MMM yyyy")
                : "Unknown"}
            </SecondaryText>
          </View>
        </View>

        <View style={styles.horizontalLine} />

        <View style={styles.scrollContainer}>
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <View style={styles.sectionContainer}>
              <HeaderText>Highlight</HeaderText>
              <ParagraphText>
                {String(rewardData?.highlight ?? "")}
              </ParagraphText>
            </View>
            <View style={styles.sectionContainer}>
              <HeaderText>Terms & Conditions</HeaderText>
              <ParagraphText>
                {String(rewardData?.termsConditions ?? "")}
              </ParagraphText>
            </View>
            <View style={styles.sectionContainer}>
              <HeaderText>Contact Info</HeaderText>
              <ParagraphText>
                {String(rewardData?.contactInfo ?? "")}
              </ParagraphText>
            </View>
          </ScrollView>
        </View>
      </ContentContainer>

      <View style={styles.redeemContainer}>
        <View style={styles.horizontalLine} />
        <View style={styles.redeemButton}>
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
        </View>

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
  headerContainer: {
    // flexDirection: "row",
    // height: "22%",
    // width: "100%",
    backgroundColor: "#FF8D13",
    // alignItems: "center",
    // justifyContent: "center",
    // position: "relative", // 使得子元素能够绝对定位
  },
  shareButton: {
    position: "absolute", // 绝对定位
    top: 10, // 距离顶部的距离
    right: 10, // 距离右边的距离
    // backgroundColor: "rgba(0, 0, 0, 0.5)", // 半透明黑色背景，避免白色图标看不清
    // padding: 8, // 让点击区域更大
    // borderRadius: 20, // 圆形背景
    zIndex: 10, // 确保在 Image 之上 (iOS)
    elevation: 5, // 确保在 Image 之上 (Android)
  },
  rewardImage: {
    width: screenWidth, // 让图片宽度等于屏幕宽度
    aspectRatio: 16 / 7, // 例如 16:5 的长宽比，按你的图片调整
    resizeMode: "contain",
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
  },
  supplierLogo: {
    width: 50,
    height: 50,
    position: "absolute", // 绝对定位
    bottom: 10, // 距离底部的距离
    left: 10, // 距离左边的距离
  },
  shareIcon: { height: 24, width: 24 },
  titleContainer: {
    padding: 5,
    alignItems: "center",
  },
  alternativesContainer: {
    flexDirection: "row",
    // width: "100%",
    // justifyContent: "space-evenly",
    // justifyContent: "space-between",
    // alignItems: "center", // 让子元素垂直居中
    marginTop: 10,
  },
  pointsContainer: {
    // justifyContent: "space-evenly",
    // width: "35%",
    // justifyContent: "center",
    // alignItems: "center",
    marginHorizontal: 5, // 调整间距
    // flex: 1, // 让它占据相同的空间
    // marginBottom: 10,
  },
  verticleLine: {
    // height: "100%",
    width: StyleSheet.hairlineWidth,
    backgroundColor: "#909090",
    marginHorizontal: 30, // 调整间距
  },
  validityContainer: {
    // justifyContent: "center",
    // alignItems: "center",
    // flex: 1, // 让它占据相同的空间
    // justifyContent: "space-evenly",
    // width: "50%",
    // marginBottom: 10,
    // marginLeft: 20,
  },
  scrollContainer: {
    position: "absolute",
    top: 125,
    bottom: 100,
    left: 5,
    right: 5,
  },
  scrollViewContainer: {
    // paddingHorizontal: 5,
  },
  horizontalLine: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#909090",
    marginVertical: 10,
    // marginHorizontal: "5%",
  },
  sectionContainer: {
    // width: "90%",
    marginVertical: 10,
    // justifyContent: "space-evenly",
    // alignItems: "flex-start",
  },
  redeemContainer: {
    // minWidth: "78%",
    // height: "10%",
    position: "absolute",
    bottom: 20,
    right: 0,
    left: 0,
    // marginHorizontal: "10%",
  },
  redeemButton: {
    marginHorizontal: "10%",
  },
});
