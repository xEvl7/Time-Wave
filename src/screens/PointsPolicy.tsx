import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const PointsPolicy = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "PointsPolicy">) => {
  const [isLoading, setIsLoading] = useState(true);

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

  const [activeTab, setActiveTab] = useState<
    "level1" | "level2" | "level3" | "level4"
  >("level1");

  const handleTabChange = (tab: "level1" | "level2" | "level3" | "level4") => {
    setActiveTab(tab);
  };

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      // const userLevel = getUserLevelFromFirebase();
      const userLevel = "level2";
      setActiveTab(userLevel);
      // Fetch user data from Firebase or perform any necessary async tasks
      // Example: Firebase logic to fetch user data
      // firebase.database().ref('users/' + userId).on('value', (snapshot) => {
      //   const userData = snapshot.val();
      //   setContributedHours(userData.contributedHours);
      //   setRewardsPoints(userData.rewardsPoints);
      // });

      // Set isLoading to false when data loading is complete
      setIsLoading(false);
    }, 500); // Simulated loading time (1 seconds in this example)
  }, []);

  let fragmentContent;

  switch (activeTab) {
    case "level1":
      fragmentContent = (
        <View>
          {/* empty */}
          <View style={{ height: 8 }} />

          {/* current level */}
          <View style={styles.fragment}>
            <Text style={styles.textHeader1}>Current level</Text>
            <Text style={styles.textHeader2}>Your Points Policy</Text>
            <Text style={styles.textContent}>
              Per month:
              {"\n"}
              1-10 hours: Each Hours *4
            </Text>
          </View>

          {/* empty */}
          <View style={{ height: 8 }} />

          {/* all levels policy */}
          <View style={styles.fragment}>
            <Text style={styles.textHeader2}>
              Policy for
              {"\n"}
              Earning Our TimeBank Rewards Points
            </Text>
            <Text style={styles.textContent}>
              Per month:
              {"\n"}
              1-10 hours: Each Hours *4
              {"\n"}
              11-20 hours: Each Hours *5
              {"\n"}
              21-30 hours: Each Hours *6
              {"\n"}
              31++ hours: Each Hours *8
              {"\n"}
            </Text>
            <Text style={styles.textContent}>
              E.g. If you have contributed a total of{" "}
              <Text style={{ fontWeight: "bold" }}>30 hours</Text> in the last
              month, then you will get a total of{" "}
              <Text style={{ fontWeight: "bold" }}>
                180 TimeBank rewards points (30*6)
              </Text>
              .
            </Text>
          </View>
        </View>
      );
      break;

    case "level2":
      fragmentContent = (
        <View>
          {/* empty */}
          <View style={{ height: 8 }} />

          {/* current level */}
          <View style={styles.fragment}>
            <Text style={styles.textHeader1}>Current level</Text>
            <Text style={styles.textHeader2}>Your Points Policy</Text>
            <Text style={styles.textContent}>
              Per month:
              {"\n"}
              11-20 hours: Each Hours *5
            </Text>
          </View>

          {/* empty */}
          <View style={{ height: 8 }} />

          {/* all levels policy */}
          <View style={styles.fragment}>
            <Text style={styles.textHeader2}>
              Policy for
              {"\n"}
              Earning Our TimeBank Rewards Points
            </Text>
            <Text style={styles.textContent}>
              Per month:
              {"\n"}
              1-10 hours: Each Hours *4
              {"\n"}
              11-20 hours: Each Hours *5
              {"\n"}
              21-30 hours: Each Hours *6
              {"\n"}
              31++ hours: Each Hours *8
              {"\n"}
            </Text>
            <Text style={styles.textContent}>
              E.g. If you have contributed a total of{" "}
              <Text style={{ fontWeight: "bold" }}>30 hours</Text> in the last
              month, then you will get a total of{" "}
              <Text style={{ fontWeight: "bold" }}>
                180 TimeBank rewards points (30*6)
              </Text>
              .
            </Text>
          </View>
        </View>
      );
      break;
    case "level3":
      fragmentContent = (
        <View>
          {/* empty */}
          <View style={{ height: 8 }} />

          {/* current level */}
          <View style={styles.fragment}>
            <Text style={styles.textHeader1}>Current level</Text>
            <Text style={styles.textHeader2}>Your Points Policy</Text>
            <Text style={styles.textContent}>
              Per month:
              {"\n"}
              21-30 hours: Each Hours *6
            </Text>
          </View>

          {/* empty */}
          <View style={{ height: 8 }} />

          {/* all levels policy */}
          <View style={styles.fragment}>
            <Text style={styles.textHeader2}>
              Policy for
              {"\n"}
              Earning Our TimeBank Rewards Points
            </Text>
            <Text style={styles.textContent}>
              Per month:
              {"\n"}
              1-10 hours: Each Hours *4
              {"\n"}
              11-20 hours: Each Hours *5
              {"\n"}
              21-30 hours: Each Hours *6
              {"\n"}
              31++ hours: Each Hours *8
              {"\n"}
            </Text>
            <Text style={styles.textContent}>
              E.g. If you have contributed a total of{" "}
              <Text style={{ fontWeight: "bold" }}>30 hours</Text> in the last
              month, then you will get a total of{" "}
              <Text style={{ fontWeight: "bold" }}>
                180 TimeBank rewards points (30*6)
              </Text>
              .
            </Text>
          </View>
        </View>
      );
      break;
    case "level4":
      fragmentContent = (
        <View>
          {/* empty */}
          <View style={{ height: 8 }} />

          {/* current level */}
          <View style={styles.fragment}>
            <Text style={styles.textHeader1}>Current level</Text>
            <Text style={styles.textHeader2}>Your Points Policy</Text>
            <Text style={styles.textContent}>
              Per month:
              {"\n"}
              31++ hours: Each Hours *8
            </Text>
          </View>

          {/* empty */}
          <View style={{ height: 8 }} />

          {/* all levels policy */}
          <View style={styles.fragment}>
            <Text style={styles.textHeader2}>
              Policy for
              {"\n"}
              Earning Our TimeBank Rewards Points
            </Text>
            <Text style={styles.textContent}>
              Per month:
              {"\n"}
              1-10 hours: Each Hours *4
              {"\n"}
              11-20 hours: Each Hours *5
              {"\n"}
              21-30 hours: Each Hours *6
              {"\n"}
              31++ hours: Each Hours *8
              {"\n"}
            </Text>
            <Text style={styles.textContent}>
              E.g. If you have contributed a total of{" "}
              <Text style={{ fontWeight: "bold" }}>30 hours</Text> in the last
              month, then you will get a total of{" "}
              <Text style={{ fontWeight: "bold" }}>
                180 TimeBank rewards points (30*6)
              </Text>
              .
            </Text>
          </View>
        </View>
      );
      break;
    default:
      fragmentContent = (
        <Text style={styles.textContent}>Unable to load the contents</Text>
      );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "level1" && styles.activeTab]}
          onPress={() => handleTabChange("level1")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "level1" && styles.activeTabText,
            ]}
          >
            Level 1
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "level2" && styles.activeTab]}
          onPress={() => handleTabChange("level2")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "level2" && styles.activeTabText,
            ]}
          >
            Level 2
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "level3" && styles.activeTab]}
          onPress={() => handleTabChange("level3")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "level3" && styles.activeTabText,
            ]}
          >
            Level 3
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "level4" && styles.activeTab]}
          onPress={() => handleTabChange("level4")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "level4" && styles.activeTabText,
            ]}
          >
            Level 4
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
        fragmentContent
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

  fragment: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "white",
    padding: 12,
  },
  textHeader1: {
    fontSize: 14,
    fontWeight: "300",
  },
  textHeader2: {
    fontSize: 18,
    fontWeight: "bold",
  },
  textContent: {
    fontSize: 16,
    fontWeight: "300",
    textAlign: "center",
  },
});

export default PointsPolicy;
