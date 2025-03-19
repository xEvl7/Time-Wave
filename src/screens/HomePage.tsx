import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAppSelector } from "../hooks";
import { selectUserName } from "../features/userSlice";
import { NavigationProp } from "@react-navigation/native";
import { fetchCommunitiesData, fetchRewardsData } from "../utils/firebaseUtils";
import ListSection from "../components/HorizontalFlatList";
import RewardItem from "../components/RewardItem";
import { CommunityType, RewardType } from "../types";
import CommunityItem from "../components/CommunityItem";

const HomePage = ({ navigation }: { navigation: NavigationProp<any> }) => {
  // username
  const name = useAppSelector(selectUserName);

  // communities data
  const [CommunitiesData, setCommunitiesData] = useState<CommunityType[]>([]);
  useEffect(() => {
    fetchCommunitiesData().then(setCommunitiesData);
  }, []);

  // rewards data
  const [RewardsData, setRewardsData] = useState<RewardType[]>([]);
  useEffect(() => {
    fetchRewardsData().then(setRewardsData);
  }, []);

  return (
    <>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerInfo}>
          <Text style={styles.headerWelcomeText}>Hello, {name}</Text>
          <Pressable
            onPress={() => navigation.navigate("ScanPage")}
            style={styles.iconButton}
          >
            <Ionicons name="scan-outline" size={28} color="#FFF" />
          </Pressable>
        </View>
      </View>
      {/* Content lists */}
      <View style={styles.listContainer}>
        <ScrollView>
          <ListSection
            title="Communities Around You"
            data={CommunitiesData}
            navigation={navigation}
            renderItem={({ item }) => (
              <CommunityItem item={item} navigation={navigation} />
            )}
            seeAllPage="Communities"
          />
          <ListSection
            title="Time Bank Rewards"
            data={RewardsData}
            navigation={navigation}
            renderItem={({ item }) => (
              <RewardItem item={item} navigation={navigation} />
            )}
            seeAllPage="TimeBankRewardsPage"
          />
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 60,
    backgroundColor: "#FF8D13",
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
  },
  headerWelcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: "10%",
    paddingVertical: "5%",
  },
  iconButton: {
    // padding: 10,
  },

  listContainer: {
    flex: 1,
    backgroundColor: "white",
  },
});

export default HomePage;
