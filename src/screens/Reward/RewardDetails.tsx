import {
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  View,
  Image,
  Dimensions,
  Clipboard,
} from "react-native";
import TextButton from "../../components/TextButton";
import ContentContainer from "../../components/ContentContainer";
import { fetchRewardData } from "../../features/rewardSlice";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Screen.types";
import { useAppDispatch, useAppSelector } from "../../hooks";
import React, { useState, useEffect, useMemo, useLayoutEffect } from "react";
import { DateTime } from "luxon";
import {
  fetchUserData,
  storePointsUsedDataToFirebase,
  updateUserPoints,
} from "../../features/userSlice";
import { shareReward } from "../../utils/shareUtils";
import CustomAlert from "../../components/CustomAlert";
import HeaderText from "../../components/text_components/HeaderText";
import ParagraphText from "../../components/text_components/ParagraphText";
import SecondaryText from "../../components/text_components/SecondaryText";
import {
  fetchRewardCodesDataByRID,
  redeemRandomVoucherCode,
} from "../../utils/firebaseUtils";

export default function RewardDetails({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "RewardDetails">) {
  const { item, type = "unredeemed", redeemedCode } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => shareReward(item.RID ?? "")}
        >
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
      if (points != undefined && rewardData?.price != undefined) {
        points -= rewardData?.price;
        setNewPoint(points);
      }

      if (
        emailAddress != undefined &&
        rewardData?.price != undefined &&
        points != undefined
      ) {
        const currentTime = new Date().toISOString();
        const pointsUsedData = {
          date: currentTime,
          points: rewardData?.price,
        };

        await Promise.all([
          dispatch(storePointsUsedDataToFirebase(pointsUsedData)).unwrap(),
          dispatch(updateUserPoints({ emailAddress, points })).unwrap(),
        ]);

        await dispatch(fetchUserData(emailAddress)).unwrap();

        const redeemedCode = await redeemRandomVoucherCode(
          item.RID,
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

  const showRewardCode = () => {
    if (redeemedCode) {
      showCustomAlert(
        "Your Reward Code",
        `Code: ${redeemedCode}`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Copy",
            onPress: () => {
              Clipboard.setString(redeemedCode);
              showCustomAlert(
                "Copied!",
                "Reward code copied to clipboard.",
                [{ text: "OK" }]
              );
            },
          },
        ]
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
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
        {type === "redeemed" && (
          <View style={styles.redeemButton}>
            <TextButton onPress={showRewardCode}>Use Now</TextButton>
          </View>
        )}

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
    backgroundColor: "#FF8D13",
    position: "relative",
  },
  rewardImage: {
    width: screenWidth,
    aspectRatio: 16 / 7,
    resizeMode: "contain",
    zIndex: 2,
  },
  supplierLogo: {
    width: 50,
    height: 50,
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  shareIcon: { height: 24, width: 24 },
  titleContainer: {
    padding: 5,
    alignItems: "center",
  },
  alternativesContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  pointsContainer: {
    marginHorizontal: 5,
  },
  verticleLine: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: "#909090",
    marginHorizontal: 30,
  },
  validityContainer: {},
  scrollContainer: {
    position: "absolute",
    top: 125,
    bottom: 100,
    left: 5,
    right: 5,
  },
  scrollViewContainer: {},
  horizontalLine: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#909090",
    marginVertical: 10,
  },
  sectionContainer: {
    marginVertical: 10,
  },
  redeemContainer: {
    position: "absolute",
    bottom: 10,
    right: 0,
    left: 0,
    marginHorizontal: "6%",
  },
  redeemButton: {
    marginHorizontal: "10%",
  },
});