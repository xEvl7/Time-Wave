import { Share, Alert } from "react-native";

const APP_SCHEME = "timewave://reward/";

export const shareReward = async (rewardId: string) => {
  try {
    const deepLink = `${APP_SCHEME}${rewardId}`;
    const message = `Check out this amazing reward! Click here to view: ${deepLink}`;

    const result = await Share.share({
      message,
      title: "Reward Share",
    });

    if (result.action === Share.sharedAction) {
      console.log(result.activityType || "Shared successfully");
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
