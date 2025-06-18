import {
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  View,
  Image,
  Dimensions,
} from "react-native";
import TextButton from "../../components/TextButton";
import ContentContainer from "../../components/ContentContainer";
import { fetchRewardData, updateRewardStock } from "../../features/rewardSlice";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Screen.types";
import { useAppDispatch, useAppSelector } from "../../hooks";
import React, { useState, useEffect, useMemo, useLayoutEffect } from "react";
import { DateTime } from "luxon";
import { fetchUserData, updateUserPoints } from "../../features/userSlice";
import { shareReward } from "../../utils/shareUtils";
import CustomAlert from "../../components/CustomAlert";
import HeaderText from "../../components/text_components/HeaderText";
import ParagraphText from "../../components/text_components/ParagraphText";
import SecondaryText from "../../components/text_components/SecondaryText";
import {
  redeemRandomVoucherCode,
  updateRewardsObtained,
} from "../../utils/firebaseUtils";
import PrimaryText from "../../components/text_components/PrimaryText";
import * as Clipboard from "expo-clipboard";

export default function RewardDetails({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "RewardDetails">) {
  const {
    item,
    type = "unredeemed",
    redeemedCode,
    expiredDate,
    redeemedDate,
    usedDate,
  } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => shareReward(item.RID ?? "")}>
          <Image
            style={styles.shareIcon}
            source={require("../../assets/share.png")}
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

  const dispatch = useAppDispatch();
  const emailAddress = useAppSelector((state) => state.user.data?.emailAddress);
  const rewardData = useAppSelector((state) => state.reward.data);
  let points = useAppSelector((state) => state.user.data?.points);

  const [newPoint, setNewPoint] = useState(points || "");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // const startluxonDateTime = useMemo(() => {
  //   if (!rewardData?.validityStartDate) return null;
  //   return DateTime.fromISO(rewardData.validityStartDate).setZone(userTimeZone);
  // }, [rewardData]);

  // const endluxonDateTime = useMemo(() => {
  //   if (!rewardData?.validityEndDate) return null;
  //   return DateTime.fromISO(rewardData.validityEndDate).setZone(userTimeZone);
  // }, [rewardData]);

  const startluxonDateTime = useMemo(() => {
    if (!rewardData?.validityStartDate) return null;
    return DateTime.fromISO(rewardData.validityStartDate).setZone(userTimeZone);
    // return rewardData?.validityStartDate;
  }, [rewardData?.validityStartDate]);

  const endluxonDateTime = useMemo(() => {
    if (!rewardData?.validityEndDate) return null;
    return DateTime.fromISO(rewardData.validityEndDate).setZone(userTimeZone);
    // return rewardData?.validityEndDate;
  }, [rewardData?.validityEndDate]);

  const expiredluxonDateTime = useMemo(() => {
    if (!expiredDate) return null;
    return DateTime.fromISO(expiredDate).setZone(userTimeZone);
    // return expiredDate;
  }, [expiredDate]);

  const usedluxonDateTime = useMemo(() => {
    if (!usedDate) return null;
    return DateTime.fromISO(usedDate).setZone(userTimeZone);
    // return usedDate;
  }, [usedDate]);

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
      proceedRedemption();
      return;
    }

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

  const userVolunteerOf =
    useAppSelector((state) => state.user.data?.volunteerOf) || [];
  const userAdminOf = useAppSelector((state) => state.user.data?.adminOf) || [];
  const forCommunities = rewardData?.forcommunities || "all"; // 允许的社区

  const proceedRedemption = () => {
    const price = rewardData?.price;
    const qtyAvailable = rewardData?.qtyAvailable; // 获取库存数量

    // 如果 reward 是 "all"，所有人都可以兑换
    if (forCommunities !== "all") {
      // 用户所属的社区
      const userCommunities = [...userAdminOf, ...userVolunteerOf];

      // 检查用户是否至少属于其中一个符合的社区
      const isEligible = userCommunities.some((community) =>
        forCommunities.includes(community)
      );

      if (!isEligible) {
        showCustomAlert(
          "Not Eligible",
          "You are not a member of the required community to redeem this reward.",
          [{ text: "OK" }]
        );
        return;
      }
    }

    if (qtyAvailable === 0) {
      showCustomAlert("Out of Stock", "This reward is no longer available.", [
        { text: "OK" },
      ]);
      return;
    }

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
      if (points != undefined && rewardData?.price != undefined) {
        points -= rewardData?.price;
        setNewPoint(points);
      }

      if (
        emailAddress != undefined &&
        rewardData?.price != undefined &&
        points != undefined &&
        rewardData?.qtyAvailable != undefined
      ) {
        const newQtyAvailable = rewardData.qtyAvailable - 1;

        if (newQtyAvailable < 0) {
          showCustomAlert("Error", "Stock is already 0!", [{ text: "OK" }]);
          return;
        }
        const currentTime = new Date().toISOString();
        // const pointsUsedData = {
        //   date: currentTime,
        //   points: rewardData?.price,
        // };

        await Promise.all([
          // dispatch(storePointsUsedDataToFirebase(pointsUsedData)).unwrap(),
          dispatch(updateUserPoints({ emailAddress, points })).unwrap(),
          dispatch(
            updateRewardStock({
              rewardId: item.RID,
              qtyAvailable: newQtyAvailable,
            })
          ).unwrap(), // 更新库存
        ]);

        await dispatch(fetchUserData(emailAddress)).unwrap();
        await dispatch(fetchRewardData(item.RID)).unwrap(); // 重新获取奖励数据，确保库存更新

        const redeemedCode = await redeemRandomVoucherCode(
          item.RID,
          rewardData?.price,
          emailAddress
        );
        if (redeemedCode) {
          showCustomAlert(
            "Redeemed Successfully!",
            `You have used ${rewardData?.price} points.\n\nRemaining Balance: ${points} points.`,
            [{ text: "OK" }]
          );
        } else {
          showCustomAlert("Redeemed Failed!", "No available stock.", [
            { text: "OK" },
          ]);
        }
      }
    } catch (error) {
      showCustomAlert(
        "Error",
        error instanceof Error ? error.message : "Failed to redeem points",
        [{ text: "OK" }]
      );
    }
  };

  // Add this state at the top with other state declarations
  const [isCodeDisplayed, setIsCodeDisplayed] = useState(false);

  // Add these functions to handle the button logic
  const showRewardCode = () => {
    // if (redeemedCode) {
    //   setIsCodeDisplayed(true); // Switch to displaying the code and copy button
    // }
    if (redeemedCode) {
      // ask user confirmation
      showCustomAlert("Confirm use now?", `Cannot be used again after this.`, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => useNow(),
        },
      ]);
    } else {
      showCustomAlert("Unexpected error", "Please contact administrator", [
        { text: "OK" },
      ]);
    }
  };

  const useNow = async () => {
    if (redeemedCode) {
      // setIsCodeDisplayed(true); // Switch to displaying the code and copy button
      showCustomAlert(
        "Reward link will send to your email:",
        `${emailAddress}`,
        [{ text: "OK" }]
      );
      // update the reward obtained status to "used"
      await updateRewardsObtained(redeemedCode, emailAddress);

      // @todo here you can add the logic to send the link to the email
    } else {
      showCustomAlert("Unexpected error", "Please contact administrator", [
        { text: "OK" },
      ]);
    }
  };

  const copyRewardCode = () => {
    if (redeemedCode) {
      Clipboard.setStringAsync(redeemedCode);
      showCustomAlert("Copied!", "Reward code copied to clipboard.", [
        { text: "OK" },
      ]);
    }
  };

  const goToRewardLink = () => {
    if (redeemedCode) {
      // here go to the link
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={styles.headerContainer}>
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

        {(type === "active" || type === "used" || type === "expired") && (
          <View style={styles.statusLabelWrapper}>
            <View
              style={[
                styles.statusLabelContainer,
                type === "active"
                  ? styles.activeBg
                  : type === "used"
                  ? styles.usedBg
                  : styles.expiredBg,
              ]}
            >
              <PrimaryText
                style={[
                  styles.baseLabelText,
                  type === "active"
                    ? styles.activeText
                    : type === "used"
                    ? styles.usedText
                    : styles.expiredText,
                ]}
              >
                {type === "used"
                  ? "Used"
                  : type === "expired"
                  ? "Expired"
                  : "Active"}
              </PrimaryText>
            </View>
          </View>
        )}

        <View style={styles.alternativesContainer}>
          <View style={styles.pointsContainer}>
            <SecondaryText>
              {type === "unredeemed" ? "Points" : "Redeemed With"}
            </SecondaryText>
            <PrimaryText style={{ color: "#FF8D13" }}>{String(rewardData?.price)} points</PrimaryText>
          </View>

          <View style={styles.verticalLine} />

          <View style={styles.validityContainer}>
            <SecondaryText>
              {type === "unredeemed"
                ? "Validity"
                : type === "used"
                ? "Used On"
                : "Expired On"}
            </SecondaryText>
            <PrimaryText>
              {type === "unredeemed"
                ? `${
                    typeof startluxonDateTime?.toFormat === "function"
                      ? startluxonDateTime.toFormat("d MMM yyyy")
                      : "Unknown"
                  } to ${
                    typeof endluxonDateTime?.toFormat === "function"
                      ? endluxonDateTime.toFormat("d MMM yyyy")
                      : "Unknown"
                  }`
                : type === "used"
                ? typeof usedluxonDateTime?.toFormat === "function"
                  ? usedluxonDateTime.toFormat("d MMM yyyy, hh:mm:ss a")
                  : usedluxonDateTime
                  ? String(usedluxonDateTime)
                  : "Unknown"
                : typeof expiredluxonDateTime?.toFormat === "function"
                ? expiredluxonDateTime.toFormat("d MMM yyyy, hh:mm:ss a")
                : expiredluxonDateTime
                ? String(expiredluxonDateTime)
                : "Unknown"}
            </PrimaryText>
          </View>
        </View>

        <View style={[styles.hairlineBase, styles.horizontalLine]} />

        {type === "unredeemed" && (
          <View style={styles.sectionContainer}>
            <PrimaryText>Highlight</PrimaryText>
            <ParagraphText>{String(rewardData?.highlight ?? "")}</ParagraphText>
          </View>
        )}
        {type !== "unredeemed" && (
          <View style={styles.sectionContainer}>
            <PrimaryText>How To Use</PrimaryText>
            <ParagraphText>{String(rewardData?.howToUse ?? "")}</ParagraphText>
          </View>
        )}

        <View style={styles.sectionContainer}>
          <PrimaryText>Terms & Conditions</PrimaryText>
          <ParagraphText>
            {String(rewardData?.termsConditions ?? "")}
          </ParagraphText>
        </View>

        <View style={styles.sectionContainer}>
          <PrimaryText>Contact Info</PrimaryText>
          <ParagraphText>{String(rewardData?.contactInfo ?? "")}</ParagraphText>
        </View>

        <View style={styles.redeemContainer}>
          <View style={[styles.hairlineBase, styles.horizontalLine]} />
          {type === "unredeemed" && (
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
          )}
          {type === "active" && (
            <View style={styles.redeemButton}>
              {isCodeDisplayed ? (
                <>
                  {/* <View style={styles.redeemedCodeBorder}>
                    <PrimaryText style={{ textAlign: "center" }}>
                      {` ${redeemedCode ?? ""}`}
                    </PrimaryText>
                  </View>
                  <TextButton onPress={copyRewardCode}>
                    Copy Reward Code
                  </TextButton> */}
                </>
              ) : (
                <TextButton onPress={showRewardCode}>Use Now</TextButton>
              )}
            </View>
          )}
        </View>

        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          buttons={alertButtons}
          onClose={() => setAlertVisible(false)}
        />
      </ContentContainer>
    </ScrollView>
  );
}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#FF8D13",
    position: "relative",
  },
  rewardImage: {
    width: screenWidth,
    aspectRatio: 16 / 7,
    resizeMode: "contain",
    zIndex: 1,
    borderRadius: 1, // 让图片边角更圆润
  },
  supplierLogo: {
    width: 50,
    height: 50,
    position: "absolute",
    bottom: 10,
    left: 15,
    zIndex: 2,
    borderRadius: 10, // 让图片边角更圆润
  },
  shareIcon: { height: 24, width: 24 },
  titleContainer: {
    // padding: 5,
    paddingBottom: 10,
    alignItems: "center",
  },
  alternativesContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  pointsContainer: {
    // marginHorizontal: 5,
  },
  verticalLine: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: "#909090",
    marginHorizontal: 13,
  },
  validityContainer: {},
  scrollContainer: {
    marginHorizontal: 5,
  },
  scrollViewContainer: {
    paddingBottom: 50,
  },
  hairlineBase: {
    backgroundColor: "#909090",
  },
  horizontalLine: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 10,
  },
  sectionContainer: {
    marginVertical: 10,
  },
  redeemContainer: {
    backgroundColor: "#fff",
  },
  redeemButton: {
    marginHorizontal: "10%",
  },
  redeemedCodeBorder: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
  },
  statusLabelWrapper: {
    alignItems: "center",
  },
  statusLabelContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  // 分离文字样式
  baseLabelText: {
    fontWeight: "bold",
    fontSize: 15,
  },
  activeText: {
    // color: "#2E7D32",
    color: "#FFFFFF",
  },
  usedText: {
    color: "#616161",
  },
  expiredText: {
    color: "#C62828",
  },

  // 分离背景样式
  activeBg: {
    // backgroundColor: "#DFF5E1",
    backgroundColor: "#FF8D13",
  },
  usedBg: {
    backgroundColor: "#E0E0E0",
  },
  expiredBg: {
    backgroundColor: "#FFEBEE",
  },
});
