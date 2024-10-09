import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  fetchPointsReceivedData,
  fetchPointsUsedData,
  fetchUserActivitiesData,
} from "../features/userSlice";
import { RootState } from "../store";
import ActivityFlatList from "../components/ActivityFlatList";
import HeaderText from "../components/text_components/HeaderText";

const RecentActivities = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "RecentActivities">) => {
  const dispatch = useAppDispatch();
  const email = useAppSelector(
    (state: RootState) => state.user.data?.emailAddress
  ) as string;
  const pointsReceivedData = useAppSelector(
    (state: RootState) => state.user.pointsReceivedData
  );
  const pointsUsedData = useAppSelector(
    (state: RootState) => state.user.pointsUsedData
  );
  const activitiesData = useAppSelector(
    (state: RootState) => state.user.activitiesData
  );

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchPointsReceivedData(email));
    dispatch(fetchPointsUsedData(email));
    dispatch(fetchUserActivitiesData(email));
  }, [dispatch, email]);

  useEffect(() => {
    if (pointsReceivedData && pointsUsedData && activitiesData) {
      setIsLoading(false);
    }
  }, [pointsReceivedData, pointsUsedData, activitiesData]);

  const normalizeData = () => {
    const pointsData = (pointsReceivedData || []).map((point) => ({
      date: point.date || "N/A",
      time: point.time || "N/A",
      title: "Points Received",
      description: `+${point.points || 0}`, // For received points
    }));

    const usedData = (pointsUsedData || []).map((point) => ({
      date: point.date || "N/A",
      time: point.time || "N/A",
      title: "Points Used",
      description: `-${point.points || 0}`, // For used points
    }));

    const activities = (activitiesData || []).map((activity) => ({
      date: activity.scanDate || "N/A", // Use scanDate
      time: activity.scanTime || "N/A", // Use scanTime
      title:
        activity.type === "check-in" || activity.type === "check-out"
          ? `${activity.type}`
          : `${activity.type}`,
      description:
        activity.type === "check-in" || activity.type === "check-out"
          ? `${activity.activityName || "Unknown"}`
          : `Activity: ${activity.activityName || "Unknown"}`, // Description for activities
    }));

    return [...pointsData, ...usedData, ...activities].map((item) => ({
      date: item.date,
      time: item.time,
      title: item.title,
      description: item.description,
    }));
  };

  const sortedActivities = normalizeData().sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`).getTime();
    const dateB = new Date(`${b.date} ${b.time}`).getTime();
    return dateB - dateA; // Sort in descending order (latest first)
  });

  return (
    <View style={styles.container}>
      <HeaderText>Recent</HeaderText>
      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => navigation.navigate("ActivityHistory")}
      >
        <Text style={styles.buttonText}>History</Text>
      </TouchableOpacity>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#FF8D13"
          style={styles.loadingIndicator}
        />
      ) : (
        <ActivityFlatList data={sortedActivities} type="combined" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  historyButton: {
    position: "absolute", // Position the button absolutely
    top: 20, // Distance from the top
    right: 20, // Distance from the right
    backgroundColor: "#FF8D13",
    paddingVertical: 5, // Small vertical padding
    paddingHorizontal: 10, // Small horizontal padding
    borderRadius: 15,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12, // Smaller font size for the button text
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RecentActivities;
