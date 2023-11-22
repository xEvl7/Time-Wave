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

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import firestore from '@react-native-firebase/firestore';
import { Timestamp } from "firebase/firestore";
import { DateTime } from 'luxon';

// type FormData = {
//   userPointActivity_id: string;
//   earned_points: number;
//   used_points: number;
//   timestamp: Timestamp;
//   pointActivity_category: string;
//   pointActivity_name: string;
// };

interface UserPointActivity {
  earned_points: number;
  pointActivity_category: string;
  pointActivity_name: string;
  timestamp: Timestamp;
  used_points: number | null; // Or, if you expect it to be 'null', use 'null'
  userPointActivity_id: string;
}


const PointsHistory = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "PointsHistory">) => {
  const handlePressBack = () => {
    navigation.navigate("RewardsPage");
  };

  const firebaseConfig = {
    apiKey: "AIzaSyD7u8fTERnA_Co1MnpVeJ6t8ZumV0T59-Y",
    authDomain: "time-wave-88653.firebaseapp.com",
    projectId: "time-wave-88653",
    storageBucket: "time-wave-88653.appspot.com",
    messagingSenderId: "666062417383",
    appId: "1:666062417383:web:8d8a8c4d4c0a3d55052142",
    measurementId: "G-L7TTXFZ6DM",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  // const handleData = async (data: FormData) => {
  //   const querySnapshot = await getDocs(collection(db, "users"));
  //   querySnapshot.forEach((doc) => {
  //     console.log(`${doc.id} => ${doc.data()}`);
  //   });
  // };

  const [userActivities, setUserActivities] = useState<UserPointActivity[]>([]);


  useEffect(() => {
    const userId = '8Unjvkx1JB2iOUlQrgAe'; // Replace with the actual user's ID

    // Reference to the "Users" collection
    const usersCollection = firestore().collection('Users');

    // Reference to a specific user's "UserPointActivity" sub-collection
    const userDocument = usersCollection.doc(userId);

    // Query the sub-collection
    const userPointActivityCollection = userDocument.collection('UserPointActivity');

     // Fetch data from the sub-collection
     userPointActivityCollection.get().then((querySnapshot) => {
      const activities: UserPointActivity[] = [];
      querySnapshot.forEach((doc) => {
        // Get the data from the document and add it to the activities array
        const activityData = doc.data() as UserPointActivity; // Cast the data to the correct type
        activities.push(activityData);
      });

      // Now, the activities array is populated with data from Firestore
      setUserActivities(activities);
    });
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"received" | "used">("received");
  const [receivedPointsData, setReceivedPointsData] = useState([
    {
      date: "Tue, 1 Aug 2023",
      time: "12:00 AM",
      category: "Time Points Rewards",
      name: "TimeBank Rewards Points",
      points: 50,
    },
    {
      date: "Sat, 1 Jul 2023",
      time: "12:00 AM",
      category: "Time Points Rewards",
      name: "TimeBank Rewards Points",
      points: 75,
    },
    {
      date: "Tue, 1 Aug 2023",
      time: "12:00 AM",
      category: "Time Points Rewards",
      name: "TimeBank Rewards Points",
      points: 50,
    },
    {
      date: "Sat, 1 Jul 2023",
      time: "12:00 AM",
      category: "Time Points Rewards",
      name: "TimeBank Rewards Points",
      points: 75,
    },
    {
      date: "Tue, 1 Aug 2023",
      time: "12:00 AM",
      category: "Time Points Rewards",
      name: "TimeBank Rewards Points",
      points: 50,
    },
    {
      date: "Sat, 1 Jul 2023",
      time: "12:00 AM",
      category: "Time Points Rewards",
      name: "TimeBank Rewards Points",
      points: 75,
    },
  ]);
  const [usedPointsData, setUsedPointsData] = useState([
    {
      date: "Sun, 6 Aug 2023",
      time: "11:00 AM",
      category: "Time Points Rewards",
      name: "TimeBank Rewards Points",
      points: 30,
    },
    {
      date: "Tue, 27 Jun 2023",
      time: "08:00 PM",
      category: "Time Points Rewards",
      name: "TimeBank Rewards Points",
      points: 55,
    },
    {
      date: "Sun, 6 Aug 2023",
      time: "11:00 AM",
      category: "Time Points Rewards",
      name: "TimeBank Rewards Points",
      points: 30,
    },
    {
      date: "Tue, 27 Jun 2023",
      time: "08:00 PM",
      category: "Time Points Rewards",
      name: "TimeBank Rewards Points",
      points: 55,
    },
    {
      date: "Sun, 6 Aug 2023",
      time: "11:00 AM",
      category: "Time Points Rewards",
      name: "TimeBank Rewards Points",
      points: 30,
    },
    {
      date: "Tue, 27 Jun 2023",
      time: "08:00 PM",
      category: "Time Points Rewards",
      name: "TimeBank Rewards Points",
      points: 55,
    },
  ]);

  useEffect(() => {
    setTimeout(() => {
      if (activeTab == "received") {
        setReceivedPointsData;
      } else {
        setUsedPointsData;
      }
      setIsLoading(false);
    }, 500);
  }, [activeTab]);

  const handleTabChange = (tab: "received" | "used") => {
    setActiveTab(tab);
    setIsLoading(true);
  };

  const formatTimestamp = (timestamp: Timestamp) => {
    // Convert timestamp to luxon DateTime object
    const date = DateTime.fromJSDate(timestamp.toDate());

    // Set the timezone to UTC+8
    const formattedDate = date.setZone('Asia/Singapore').toFormat('EEE, d LLL yyyy');
    const formattedTime = date.setZone('Asia/Singapore').toFormat('h:mm a');

    return { date: formattedDate, time: formattedTime };
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "received" && styles.activeTab,
          ]}
          onPress={() => handleTabChange("received")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "received" && styles.activeTabText,
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
              activeTab === "used" && styles.activeTabText,
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
          {activeTab === "received" ? (
            // Render Points Received Fragment
            <View>
              {/* Content for Points Received */}
              <FlatList
                contentContainerStyle={{ paddingBottom: 100 }}
                // data={receivedPointsData}
                data={userActivities}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View>
                    <View style={styles.listContainer1}>
                      <Text style={styles.listDateText}>{formatTimestamp(item.timestamp).date}</Text>
                    </View>
                    <View style={styles.listContainer2}>
                      <Text style={styles.listTimeText}>{formatTimestamp(item.timestamp).time}</Text>
                      <Text style={styles.listCategoryText}>
                        {item.pointActivity_category}
                      </Text>
                      <View style={styles.tabContainer}>
                        <Text style={styles.listNameText}>{item.pointActivity_name}</Text>
                        <Text style={styles.listPointsText}>
                          +{item.earned_points}
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
                data={usedPointsData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View>
                    <View style={styles.listContainer1}>
                      <Text style={styles.listDateText}>{item.date}</Text>
                    </View>
                    <View style={styles.listContainer2}>
                      <Text style={styles.listTimeText}>{item.time}</Text>
                      <Text style={styles.listCategoryText}>
                        {item.category}
                      </Text>
                      <View style={styles.tabContainer}>
                        <Text style={styles.listNameText}>{item.name}</Text>
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