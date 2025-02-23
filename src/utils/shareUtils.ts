import { Share, Alert } from "react-native";

export const shareReward = async (message: string, url: string) => {
  try {
    const result = await Share.share({ message, url, title: "Reward Share" });
    // url: "https://firebasestorage.googleapis.com/v0/b/time-wave-88653.appspot.com/o/sewing%20machine.png?alt=media&token=f42e4f7e-ed65-441a-b05b-66f743a70554",

    if (result.action === Share.sharedAction) {
      console.log(result.activityType || "Shared successfully");
    } else if (result.action === Share.dismissedAction) {
      console.log("Share dismissed");
    }
  } catch (error) {
    Alert.alert("Error", error instanceof Error ? error.message : "Unknown error occurred");
  }
};
