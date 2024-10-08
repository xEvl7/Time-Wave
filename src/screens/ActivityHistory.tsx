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
import firestore, { firebase } from "@react-native-firebase/firestore";

// Define the interface for user activities
interface UserActivity {
  activityId: string;
  activityName: string;
  communityId: string;
  generateTime: string;
  scanTime: string;
  type: string;
}

const ActivityHistory = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "ActivityHistory">) => {
  const dispatch = useAppDispatch();

  const selectedCommunityId = useAppSelector(
    (state: RootState) => state.community.selectedCommunityId
  );
  const uid = useAppSelector(
    (state: RootState) => state.user.data?.uid
  ) as string;
  const email = useAppSelector(
    (state: RootState) => state.user.data?.emailAddress
  ) as string;

  const communityActivities = useAppSelector(
    (state: RootState) => state.community.communities
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

  // Explicitly set the type for userActivities
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);

  useEffect(() => {
    // if (selectedCommunityId) {
    //   dispatch(fetchCommunities(selectedCommunityId));
    // }
    if (email) {
      dispatch(fetchPointsReceivedData(email));
      dispatch(fetchPointsUsedData(email));
    }

    // Fetch user activities from the "users" collection under "Activities"
    fetchUserActivities();
  }, [dispatch, selectedCommunityId, email]);

  const fetchUserActivities = async () => {
    try {
      const snapshot = await firestore()
        .collection("Users")
        .doc(uid)
        .collection("Activities")
        .orderBy("scanTime", "desc")
        .get();

      const activities = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          activityId: data.activityId || "Unknown Activity Id",
          activityName: data.activityName || "Unknown Activity Name",
          communityId: data.communityId || "Unknown Community Id",
          generateTime:
            data.generateTime?.toDate()?.toLocaleTimeString() || "N/A",
          scanTime: data.generateTime?.toDate()?.toLocaleTimeString() || "N/A",
          type: data.type || "Unknown Type",
        };
      });

      setUserActivities(activities);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user activities:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("Community Activities:", communityActivities);
    console.log("Points Received:", pointsReceivedData);
    console.log("Points Used:", pointsUsedData);
    console.log("User Activities:", userActivities);

    // Update the loading condition to check for array length
    if (
      communityActivities?.length > 0 ||
      pointsReceivedData?.length >= 0 ||
      pointsUsedData?.length >= 0 ||
      userActivities.length > 0
    ) {
      setIsLoading(false);
    }
  }, [communityActivities, pointsReceivedData, pointsUsedData, userActivities]);

  // const communityData =
  //   communityActivities?.map(
  //     (activity: { date: any; time: any; points: any }) => ({
  //       date: activity.date || "N/A",
  //       time: activity.time || "N/A",
  //       points: activity.points || 0,
  //     })
  //   ) || []; // Default to empty array

  // Combined points data from both received and used
  const pointsData = [
    ...(pointsReceivedData || []),
    ...(pointsUsedData || []),
  ].map((point) => ({
    date: point.date || "N/A",
    time: point.time || "N/A",
    points: point.points || 0,
  }));

  // Combine user activity history with community activities
  // const combinedCommunityData = [...communityData, ...userActivities];

  const handleTabChange = (tab: "community" | "points") => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setIsLoading(true);
      // Trigger loading of data for the newly selected tab if necessary
      if (tab === "community") {
        if (email) {
          dispatch(fetchPointsReceivedData(email));
          dispatch(fetchPointsUsedData(email));
        }
    
        // Fetch user activities from the "users" collection under "Activities"
        fetchUserActivities();
        // Potentially fetch community data again or prepare data
      } else {
        // Potentially fetch points data again or prepare data
        if (email) {
          dispatch(fetchPointsReceivedData(email));
          dispatch(fetchPointsUsedData(email));
        }
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
          data={activeTab === "community" ? userActivities : pointsData}
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
