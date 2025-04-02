import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import {
  fetchUserData,
  fetchUserContributionData,
  selectEmail,
  selectUserContributionData,
  selectUserData,
} from "../features/userSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import { RootState } from "../store";
import ProgressBar from "../components/ProgressBar";
import SectionContainer from "../components/SectionContainer";
import VerticalItemList from "../components/VerticalItemList";
import { useFocusEffect } from "@react-navigation/native";
import { getTotalContributedHours } from "../utils/contributionUtils";
import { calculateLevel } from "../utils/levelUtils";
import { getLastDayOfMonth } from "../utils/dateUtils";
import { RewardType } from "../types";
import { fetchRewardsData } from "../utils/firebaseUtils";
import PrimaryText from "../components/text_components/PrimaryText";

const Account = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Account">) => {
  const dispatch = useAppDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [rewardsData, setRewardsData] = useState<RewardType[]>([]);

  // user & contribution data from redux store
  const email = useAppSelector(selectEmail);
  const userData = useAppSelector(selectUserData);
  const userContributionData = useAppSelector(selectUserContributionData);

  // fetch user & contribution data again from firebase into redux store
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

  // useEffect(() => {
  //   fetchRewardsData().then(setRewardsData);
  // }, []);

  // contribution hours & level
  const contributedHours = useMemo(
    () => getTotalContributedHours(userContributionData),
    [userContributionData]
  );
  const currentLevel = calculateLevel(contributedHours);
  const userPoints = useMemo(() => userData?.points ?? 0, [userData]);

  // level progress bar
  const { hoursLeftToNextLevel, progressPercentage } = useMemo(() => {
    const maxHours = currentLevel * 10;
    return {
      hoursLeftToNextLevel: maxHours + 10 - contributedHours,
      progressPercentage: Math.min(
        Math.max((contributedHours - (maxHours - 10)) / 10, 0),
        1
      ),
    };
  }, [currentLevel, contributedHours]);

  const formattedLastDay = useMemo(() => getLastDayOfMonth(), []);

  const maxItems = 5;

  return (
    <ScrollView
      // contentContainerStyle={styles.scrollViewContent}
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
      <View style={styles.container}>
        {/* Level Section */}
        <SectionContainer>
          <View style={styles.levelContainer}>
            <PrimaryText
              style={styles.levelText1}
            >{`Level ${currentLevel}`}</PrimaryText>
            <ProgressBar progressPercentage={progressPercentage} />
            <PrimaryText style={styles.levelText2}>
              {currentLevel < 4
                ? `Contribute ${hoursLeftToNextLevel} more hours by ${formattedLastDay} to reach Level ${
                    currentLevel + 1
                  }`
                : `🎉 You've reached the max level! Keep contributing to make an impact!`}
            </PrimaryText>
            <View style={styles.policyButtonContainer}>
              <TouchableOpacity
                style={styles.policyButton}
                onPress={() =>
                  navigation.navigate("PointsPolicy", {
                    level: "level" + currentLevel,
                  })
                }
              >
                <Text style={styles.policyButtonText}>View Points Policy</Text>
                <Image
                  source={require("../assets/next_icon_white.png")}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </SectionContainer>

        {/* Contributions Section */}
        <SectionContainer>
          <Text style={styles.Text1}>
            So far this month, you have contributed
          </Text>
          <View style={styles.rowContainer}>
            <Text style={styles.Text2}>{contributedHours}</Text>
            <Text style={styles.Text1}>Accumulated Hours</Text>
          </View>
          <View style={styles.line}></View>
          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => navigation.navigate("ContributionsHistory")}
          >
            <Text style={styles.historyButtonText}>
              View my contributions history
            </Text>
            <Image
              source={require("../assets/next_icon_orange.png")}
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>
          <View style={styles.line}></View>
        </SectionContainer>

        {/* Points Section */}
        <SectionContainer>
          <Text style={styles.Text1}>You have</Text>
          <View style={styles.rowContainer}>
            <Text style={styles.Text2}>{userPoints}</Text>
            <Text style={styles.Text1}>Points</Text>
          </View>
          <View style={styles.line}></View>
          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => navigation.navigate("PointsHistory")}
          >
            <Text style={styles.historyButtonText}>View my points history</Text>
            <Image
              source={require("../assets/next_icon_orange.png")}
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>
          <View style={styles.line}></View>
        </SectionContainer>

        {/* Latest Rewards */}
        <SectionContainer>
          <Text style={styles.lrText1}>Latest Rewards</Text>
          {rewardsData.slice(0, maxItems).map((item, index) => (
            <VerticalItemList
              key={index}
              imageSource={item.image}
              title={item.name}
              subtitle={item.supplierName}
              points={item.price}
              onPress={() => navigation.navigate("Reward", { item })}
            />
          ))}
          <View style={styles.line}></View>
          <TouchableOpacity
            style={styles.rButton}
            onPress={() => navigation?.navigate("TimeBankRewardsPage")}
          >
            <Text style={styles.rButtonText}>View All Rewards</Text>
          </TouchableOpacity>
        </SectionContainer>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    // paddingBottom: 16,
  },
  container: {
    padding: 16,
    backgroundColor: "white",
  },
  levelContainer: {
    backgroundColor: "#FF8D13",
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingEnd: 20,
    borderRadius: 25,
    marginBottom: 16,
  },
  levelText1: {
    fontSize: 23,
    // fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  levelText2: {
    fontSize: 12.5,
    // fontWeight: "bold",
    color: "white",
    marginTop: 8,
    marginBottom: 25,
  },
  policyButtonContainer: {
    backgroundColor: "#EEA575",
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginLeft: -20,
    marginRight: -20,
  },
  policyButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  policyButtonText: {
    color: "white",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    paddingBottom: 3,
  },
  Text1: {
    fontSize: 15,
    fontWeight: "300",
  },
  Text2: {
    fontWeight: "bold",
    fontSize: 30,
    marginHorizontal: 10,
  },
  line: {
    height: 1,
    width: "100%",
    backgroundColor: "#BDBDBD",
    marginVertical: 3,
  },
  historyButton: {
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyButtonText: {
    fontWeight: "300",
  },
  lrText1: {
    fontWeight: "bold",
    fontSize: 18,
  },
  rButton: {
    marginTop: 8,
    alignItems: "center",
  },
  rButtonText: {
    color: "#FF8D13",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Account;
