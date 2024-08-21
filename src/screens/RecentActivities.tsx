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

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchPointsReceivedData(email));
    dispatch(fetchPointsUsedData(email));
  }, [dispatch, email]);

  useEffect(() => {
    if (pointsReceivedData && pointsUsedData) {
      setIsLoading(false);
    }
  }, [pointsReceivedData, pointsUsedData]);

  const recentActivities = [
    ...(pointsReceivedData || []),
    ...(pointsUsedData || []),
  ].map((point) => ({
    date: point.date || "N/A",
    time: point.time || "N/A",
    points: point.points || 0,
  }));

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
        <ActivityFlatList data={recentActivities} type="points" />
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
