import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";

import { DateTime } from "luxon";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  fetchPointsReceivedData,
  fetchPointsUsedData,
} from "../features/userSlice";
import { RootState } from "../store";

const PointsHistory = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "PointsHistory">) => {
  const handlePressBack = () => {
    navigation.navigate("RewardsPage");
  };

  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user.data);
  const email = useAppSelector(
    (state) => state.user.data?.emailAddress
  ) as string;

  // 实现每进来一次都会重新从firebase获取数据
  useEffect(() => {
    dispatch(fetchPointsReceivedData(email));
    dispatch(fetchPointsUsedData(email));
  }, [dispatch]);

  // Access the data from the Redux store
  const pointsReceivedData = useAppSelector(
    (state: RootState) => state.user.pointsReceivedData
  );
  const pointsUsedData = useAppSelector(
    (state: RootState) => state.user.pointsUsedData
  );

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"received" | "used">("received");

  // const [receivedPointsData, setReceivedPointsData] = useState([
  //   {
  //     date: "Tue, 1 Aug 2023",
  //     time: "12:00 AM",
  //     category: "Time Points Rewards",
  //     name: "TimeBank Rewards Points",
  //     points: 50,
  //   },
  //   {
  //     date: "Sat, 1 Jul 2023",
  //     time: "12:00 AM",
  //     category: "Time Points Rewards",
  //     name: "TimeBank Rewards Points",
  //     points: 75,
  //   },
  //   {
  //     date: "Tue, 1 Aug 2023",
  //     time: "12:00 AM",
  //     category: "Time Points Rewards",
  //     name: "TimeBank Rewards Points",
  //     points: 50,
  //   },
  //   {
  //     date: "Sat, 1 Jul 2023",
  //     time: "12:00 AM",
  //     category: "Time Points Rewards",
  //     name: "TimeBank Rewards Points",
  //     points: 75,
  //   },
  //   {
  //     date: "Tue, 1 Aug 2023",
  //     time: "12:00 AM",
  //     category: "Time Points Rewards",
  //     name: "TimeBank Rewards Points",
  //     points: 50,
  //   },
  //   {
  //     date: "Sat, 1 Jul 2023",
  //     time: "12:00 AM",
  //     category: "Time Points Rewards",
  //     name: "TimeBank Rewards Points",
  //     points: 75,
  //   },
  // ]);
  // const [usedPointsData, setUsedPointsData] = useState([
  //   {
  //     date: "Sun, 6 Aug 2023",
  //     time: "11:00 AM",
  //     category: "Time Points Rewards",
  //     name: "TimeBank Rewards Points",
  //     points: 30,
  //   },
  //   {
  //     date: "Tue, 27 Jun 2023",
  //     time: "08:00 PM",
  //     category: "Time Points Rewards",
  //     name: "TimeBank Rewards Points",
  //     points: 55,
  //   },
  //   {
  //     date: "Sun, 6 Aug 2023",
  //     time: "11:00 AM",
  //     category: "Time Points Rewards",
  //     name: "TimeBank Rewards Points",
  //     points: 30,
  //   },
  //   {
  //     date: "Tue, 27 Jun 2023",
  //     time: "08:00 PM",
  //     category: "Time Points Rewards",
  //     name: "TimeBank Rewards Points",
  //     points: 55,
  //   },
  //   {
  //     date: "Sun, 6 Aug 2023",
  //     time: "11:00 AM",
  //     category: "Time Points Rewards",
  //     name: "TimeBank Rewards Points",
  //     points: 30,
  //   },
  //   {
  //     date: "Tue, 27 Jun 2023",
  //     time: "08:00 PM",
  //     category: "Time Points Rewards",
  //     name: "TimeBank Rewards Points",
  //     points: 55,
  //   },
  // ]);

  useEffect(() => {
    setTimeout(() => {
      // if (activeTab == "received") {
      //   setReceivedPointsData;
      // } else {
      //   setUsedPointsData;
      // }
      setIsLoading(false);
    }, 500);
  }, [activeTab]);

  const handleTabChange = (tab: "received" | "used") => {
    setActiveTab(tab);
    setIsLoading(true);
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
        <View>
          {activeTab == "received" ? (
            // Render Points Received Fragment
            <View>
              {/* Content for Points Received */}
              <FlatList
                contentContainerStyle={{ paddingBottom: 100 }}
                data={pointsReceivedData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View>
                    <View style={styles.listContainer1}>
                      <Text style={styles.listDateText}>{item.date}</Text>
                    </View>
                    <View style={styles.listContainer2}>
                      <Text style={styles.listTimeText}>{item.time}</Text>
                      <Text style={styles.listCategoryText}>
                        Time Points Rewards
                        {/* {item.category} */}
                      </Text>
                      <View style={styles.tabContainer}>
                        <Text style={styles.listNameText}>
                          TimeBank Rewards Points
                          {/* {item.name} */}
                        </Text>
                        <Text style={styles.listPointsText}>
                          +{item.points}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              />
            </View>
          ) : (
            // Render Points Used Fragment
            <View>
              {/* Content for Points Used */}
              <FlatList
                contentContainerStyle={{ paddingBottom: 100 }}
                data={pointsUsedData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View>
                    <View style={styles.listContainer1}>
                      <Text style={styles.listDateText}>{item.date}</Text>
                    </View>
                    <View style={styles.listContainer2}>
                      <Text style={styles.listTimeText}>{item.time}</Text>
                      <Text style={styles.listCategoryText}>
                        Time Points Rewards
                        {/* {item.category} */}
                      </Text>
                      <View style={styles.tabContainer}>
                        <Text style={styles.listNameText}>
                          TimeBank Rewards Points
                          {/* {item.name} */}
                        </Text>
                        <Text style={styles.listPointsText}>
                          -{item.points}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 8,
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
  listContainer1: {
    backgroundColor: "transparent",
    paddingHorizontal: 20,
    paddingVertical: 7,
  },
  listContainer2: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  listDateText: {
    fontSize: 16,
    fontWeight: "300",
  },
  listTimeText: {
    fontSize: 14,
    fontWeight: "300",
    paddingBottom: 3,
  },
  listCategoryText: {
    fontSize: 16,
    fontWeight: "bold",
    paddingBottom: 3,
  },
  listNameText: {
    fontSize: 15,
    fontWeight: "400",
  },
  listPointsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF8D13",
  },
});

export default PointsHistory;
