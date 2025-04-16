import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabParamList, RootStackParamList } from "../Screen.types";
import { CompositeScreenProps, useFocusEffect } from "@react-navigation/native";
import ButtonText from "../components/text_components/ButtonText";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import HeaderText from "../components/text_components/HeaderText";
import SecondaryText from "../components/text_components/SecondaryText";
import { useAppDispatch, useAppSelector } from "../hooks";
import { RootState } from "../store";
import ListSection from "../components/HorizontalFlatList";
import RewardItem from "../components/RewardItem";
import SearchBar from "../components/SearchBar";
import { calculateLevel } from "../utils/levelUtils";
import { fetchRewardsData } from "../utils/firebaseUtils";
import { RewardType } from "../types";
import { getTotalContributedHours } from "../utils/contributionUtils";
import {
  fetchUserData,
  fetchUserContributionData,
  selectEmail,
  selectUserContributionData,
  selectUserData,
} from "../features/userSlice";

const TimeBankRewardsPage = ({
  navigation,
}: CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, "Rewards">,
  NativeStackScreenProps<RootStackParamList>
>) => {
  const dispatch = useAppDispatch();
  const [refreshing, setRefreshing] = useState(false);

  // user & contribution data from redux store
  const email = useAppSelector(selectEmail);
  const userData = useAppSelector(selectUserData);
  const userContributionData = useAppSelector(selectUserContributionData);

  // contribution hours & level
  const [contributedHours, setContributedHours] = useState<number>(
    getTotalContributedHours(userContributionData)
  );
  useEffect(() => {
    setContributedHours(getTotalContributedHours(userContributionData));
  }, [userContributionData]);
  const currentLevel = calculateLevel(contributedHours);

  // rewards data
  const [RewardsData, setRewardsData] = useState<RewardType[]>([]);
  // useEffect(() => {
  //   fetchRewardsData().then(setRewardsData);
  // }, []);

  // fetch user & reward data again from firebase into redux store
  const refreshData = useCallback(async () => {
    if (!email) return;
    try {
      await Promise.all([
        dispatch(fetchUserData(email)),
        dispatch(fetchUserContributionData(email)),
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

  // search function
  const [searchQuery, setSearchQuery] = useState<string>(""); // 搜索输入内容
  const [submittedQuery, setSubmittedQuery] = useState<string>(""); // 提交搜索时的内容
  // 仅在用户点击“搜索”按钮后过滤奖励数据
  const filteredRewards = RewardsData.filter((item) =>
    item.name.toLowerCase().includes(submittedQuery.toLowerCase())
  );

  return (
    <>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View>
          <HeaderText
            style={styles.levelText}
          >{`Level ${currentLevel}`}</HeaderText>
          <HeaderText
            style={styles.pointsText}
          >{`${userData?.points} Points`}</HeaderText>

          <TouchableOpacity
            activeOpacity={0.6} // 触摸时降低透明度
            style={styles.ticketContainer}
            onPress={() => navigation.navigate("ActiveRewardsPage")}
          >
            <Image
              source={require("../assets/ticket-icon.png")}
              style={styles.tIcon}
            />
            <ButtonText>My Rewards</ButtonText>
          </TouchableOpacity>
        </View>
      </View>

      {/* My Reward Details Button */}
      <View style={styles.contentContainer}>
        <View style={styles.rewardContainer}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => navigation.navigate("Account")}
          >
            {/* 左边的 Image + 文本 组成一个小容器 */}
            <View
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
            >
              <Image
                source={require("../assets/diamond.png")}
                style={styles.rIcon}
              />
              <SecondaryText>My Rewards Details</SecondaryText>
            </View>
            <Image
              source={require("../assets/next_icon_orange.png")}
              style={styles.nIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.line}></View>

        {/* 搜索框 */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={() => setSubmittedQuery(searchQuery)}
        />

        {/* Content Lists  */}
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
            {/* 根据搜索情况显示不同的 ListSection */}
            {submittedQuery ? (
              // 当有搜索关键词时，显示匹配的奖励
              <ListSection
                title="Search Results"
                navigation={navigation}
                data={filteredRewards} // 传递过滤后的奖励数据
                renderItem={({ item }) => (
                  <RewardItem item={item} navigation={navigation} />
                )}
                seeAllPage="RewardSeeAll"
              />
            ) : (
              <>
                <ListSection
                  title="Communities"
                  navigation={navigation}
                  data={RewardsData}
                  renderItem={({ item }) => (
                    <RewardItem item={item} navigation={navigation} />
                  )}
                  seeAllPage="RewardSeeAll"
                />

                <ListSection
                  title="Individual"
                  navigation={navigation}
                  data={RewardsData}
                  renderItem={({ item }) => (
                    <RewardItem item={item} navigation={navigation} />
                  )}
                  seeAllPage="RewardSeeAll"
                />
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    // flex: 0.1,
    // height: 150,
    // width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 25,
    // padding: 20,
    // paddingTop: 80,
    backgroundColor: "#FF8D13",
  },
  levelText: {
    fontSize: 28,
    color: "#FFFFFF",
  },
  pointsText: {
    fontSize: 16,
    color: "#FFFFFF",
    // marginBottom: 1,
  },
  ticketContainer: {
    position: "absolute",
    top: 25,
    right: -5,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 12,
    elevation: 3, // 适用于 Android
  },
  tIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  contentContainer: {
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  rewardContainer: {
    flex: 0.1,
    width: "100%",
    // position: "absolute",
    top: -12,
    paddingHorizontal: 20,
    paddingTop: 10,
    // marginVertical: 10,
    // left: 0,
    // right: 0,
    // height: 40,
    // justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  rIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  nIcon: {
    width: 20,
    height: 20,
  },
  line: {
    height: 1,
    width: "100%",
    backgroundColor: "#ccc",
    // marginVertical: 3,
    marginVertical: 10,
  },

  listContainer: {
    flex: 4,
  },
});

export default TimeBankRewardsPage;
