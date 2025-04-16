import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  fetchUserData,
  selectEmail,
  selectUserName,
} from "../features/userSlice";
import { NavigationProp, useFocusEffect } from "@react-navigation/native";
import { fetchCommunitiesData, fetchRewardsData } from "../utils/firebaseUtils";
import HorizontalFlatList from "../components/HorizontalFlatList";
import RewardItem from "../components/RewardItem";
import { CommunityType, RewardType } from "../types";
import CommunityItem from "../components/CommunityItem";

const HomePage = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const dispatch = useAppDispatch();
  const [refreshing, setRefreshing] = useState(false);

  // username & email
  const name = useAppSelector(selectUserName);
  const email = useAppSelector(selectEmail);

  // communities data
  const [CommunitiesData, setCommunitiesData] = useState<CommunityType[]>([]);
  // useEffect(() => {
  //   fetchCommunitiesData().then(setCommunitiesData);
  // }, []);

  // rewards data
  const [RewardsData, setRewardsData] = useState<RewardType[]>([]);
  // useEffect(() => {
  //   fetchRewardsData().then(setRewardsData);
  // }, []);

  // fetch user & contribution data again from firebase into redux store
  const refreshData = useCallback(async () => {
    if (!email) return;
    try {
      await Promise.all([
        dispatch(fetchUserData(email)),
        fetchCommunitiesData().then(setCommunitiesData),
        fetchRewardsData().then(setRewardsData),
      ]);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [email, dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      refreshData();
    }, [refreshData])
  );

  return (
    <>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerInfo}>
          <Text style={styles.headerWelcomeText}>Hello, {name}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("ScanPage")}
            style={styles.iconButton}
          >
            <Ionicons name="scan-outline" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Content lists */}
      <View style={styles.listContainer}>
        <ScrollView
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#FF8D13"]} // 仅适用于 Android
              tintColor="#FF8D13" // 仅适用于 iOS
            />
          }
        >
          <HorizontalFlatList
            title="Communities Around You"
            data={CommunitiesData}
            navigation={navigation}
            renderItem={({ item }) => (
              <CommunityItem item={item} navigation={navigation} />
            )}
            seeAllPage="Communities"
          />
          <HorizontalFlatList
            title="Time Bank Rewards"
            data={RewardsData}
            navigation={navigation}
            renderItem={({ item }) => (
              <RewardItem item={item} navigation={navigation} />
            )}
            seeAllPage="Rewards"
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
    paddingTop: 10,
  },
});

export default HomePage;
