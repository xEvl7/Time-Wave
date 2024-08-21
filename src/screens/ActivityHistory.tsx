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
import { fetchCommunities } from "../features/communitySlice";
import {
  fetchPointsReceivedData,
  fetchPointsUsedData,
} from "../features/userSlice";
import { RootState } from "../store";
import ActivityFlatList from "../components/ActivityFlatList";

const ActivityHistory = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "ActivityHistory">) => {
  const dispatch = useAppDispatch();

  const selectedCommunityId = useAppSelector(
    (state: RootState) => state.community.selectedCommunityId
  );
  const email = useAppSelector(
    (state: RootState) => state.user.data?.emailAddress
  ) as string;

  const communityActivities = useAppSelector(
    (state: RootState) => state.community.activities
  );
  const pointsReceivedData = useAppSelector(
    (state: RootState) => state.user.pointsReceivedData
  );
  const pointsUsedData = useAppSelector(
    (state: RootState) => state.user.pointsUsedData
  );

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"community" | "points">(
    "community"
  );

  useEffect(() => {
    if (selectedCommunityId) {
      dispatch(fetchCommunities(selectedCommunityId));
    }
    dispatch(fetchPointsReceivedData(email));
    dispatch(fetchPointsUsedData(email));
  }, [dispatch, selectedCommunityId, email]);

  useEffect(() => {
    console.log("Community Activities:", communityActivities);
    console.log("Points Received:", pointsReceivedData);
    console.log("Points Used:", pointsUsedData);
    
    // Update the loading condition to check for array length
    if (
      communityActivities?.length > 0 &&
      pointsReceivedData?.length >= 0 && // Allow zero points received
      pointsUsedData?.length >= 0 // Allow zero points used
    ) {
      setIsLoading(false);
    }
  }, [communityActivities, pointsReceivedData, pointsUsedData]);

  const communityData = communityActivities?.map((activity: { date: any; time: any; points: any; }) => ({
    date: activity.date || "N/A",
    time: activity.time || "N/A",
    points: activity.points || 0,
  })) || []; // Default to empty array

  const pointsData = [
    ...(pointsReceivedData || []),
    ...(pointsUsedData || [])
  ].map((point) => ({
    date: point.date || "N/A",
    time: point.time || "N/A",
    points: point.points || 0,
  }));

  const handleTabChange = (tab: "community" | "points") => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setIsLoading(true);
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
          data={activeTab === "community" ? communityData : pointsData}
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
