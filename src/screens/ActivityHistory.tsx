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

const ActivityHistory = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "ActivityHistory">) => {
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
  const [activeTab, setActiveTab] = useState<"community" | "points">(
    "community"
  );

  useEffect(() => {
    if (email) {
      dispatch(fetchPointsReceivedData(email));
      dispatch(fetchPointsUsedData(email));
      dispatch(fetchUserActivitiesData(email));
    }
  }, [dispatch, email]);

  useEffect(() => {
    if (pointsReceivedData && pointsUsedData && activitiesData) {
      setIsLoading(false);
    }
  }, [pointsReceivedData, pointsUsedData, activitiesData]);

  // Combined points data from both received and used
  const pointsData = [
    ...(pointsReceivedData || []),
    ...(pointsUsedData || []),
  ].map((point) => ({
    date: point.date || "N/A",
    time: point.time || "N/A",
    points: point.points || 0,
  }));

  const handleTabChange = (tab: "community" | "points") => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setIsLoading(true);

      if (tab === "community") {
        // Fetch user activities data when switching to community
        dispatch(fetchUserActivitiesData(email));
      } else {
        // Fetch points data when switching to points
        dispatch(fetchPointsReceivedData(email));
        dispatch(fetchPointsUsedData(email));
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "community" && styles.activeTab,
          ]}
          onPress={() => handleTabChange("community")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "community" && styles.activeTabText,
            ]}
          >
            Community
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "points" && styles.activeTab]}
          onPress={() => handleTabChange("points")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "points" && styles.activeTabText,
            ]}
          >
            Points
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#FF8D13"
          style={styles.loadingIndicator}
        />
      ) : (
        <ActivityFlatList
          data={activeTab === "community" ? activitiesData : pointsData}
          type={activeTab}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderColor: "white",
    backgroundColor: "white",
  },
  activeTab: {
    borderColor: "#FF8D13",
  },
  activeTabText: {
    color: "#FF8D13",
    fontSize: 16,
    fontWeight: "bold",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#BABABA",
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ActivityHistory;
