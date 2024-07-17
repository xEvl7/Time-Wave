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

const PointsHistory = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "PointsHistory">) => {
  const dispatch = useAppDispatch();
  const email = useAppSelector(
    (state) => state.user.data?.emailAddress
  ) as string;

  useEffect(() => {
    dispatch(fetchPointsReceivedData(email));
    dispatch(fetchPointsUsedData(email));
  }, [dispatch, email]);

  const pointsReceivedData = useAppSelector(
    (state: RootState) => state.user.pointsReceivedData
  );
  const pointsUsedData = useAppSelector(
    (state: RootState) => state.user.pointsUsedData
  );

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"received" | "used">("received");

  useEffect(() => {
    if (activeTab === "received" && pointsReceivedData) {
      setIsLoading(false);
    } else if (activeTab === "used" && pointsUsedData) {
      setIsLoading(false);
    }
  }, [activeTab, pointsReceivedData, pointsUsedData]);

  const handleTabChange = (tab: "received" | "used") => {
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
            activeTab == "received" && styles.activeTab,
          ]}
          onPress={() => handleTabChange("received")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab == "received" && styles.activeTabText,
            ]}
          >
            Points Received
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "used" && styles.activeTab]}
          onPress={() => handleTabChange("used")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab == "used" && styles.activeTabText,
            ]}
          >
            Points Used
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
          data={activeTab === "received" ? pointsReceivedData : pointsUsedData}
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

export default PointsHistory;
