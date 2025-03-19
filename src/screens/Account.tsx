import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import {
  fetchUserData,
  fetchUserContributionData,
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

const Account = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Account">) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // user & contribution data from redux store
  const userData = useAppSelector((state: RootState) => state.user.data);
  const contributionData = useAppSelector(
    (state: RootState) => state.user.contributionData
  );
  const email = useAppSelector((state) => state.user.data?.emailAddress);

  const fetchData = useCallback(async () => {
    if (!email) return;
    setIsLoading(true);
    try {
      await Promise.all([
        dispatch(fetchUserData(email)),
        dispatch(fetchUserContributionData(email)),
      ]);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
    setIsLoading(false);
  }, [email, dispatch]);

  // rewards data
  const [RewardsData, setRewardsData] = useState<RewardType[]>([]);
  useEffect(() => {
    fetchRewardsData().then(setRewardsData);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  // contribution hours & level
  const contributedHours = useMemo(
    () => getTotalContributedHours(contributionData),
    [contributionData]
  );
  const currentLevel = calculateLevel(contributedHours);

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

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color="#FF8D13"
        style={styles.loadingIndicator}
      />
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      scrollEventThrottle={16}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        {/* Level Section */}
        <SectionContainer>
          <View style={styles.levelContainer}>
            <Text style={styles.levelText1}>Level {currentLevel}</Text>
            <ProgressBar progressPercentage={progressPercentage} />
            <Text style={styles.levelText2}>
              {currentLevel < 4
                ? `Contribute ${hoursLeftToNextLevel} more hours by ${formattedLastDay} to reach Level ${
                    currentLevel + 1
                  }`
                : `🎉 You've reached the max level! Keep contributing to make an impact!`}
            </Text>
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
            <Text style={styles.Text2}>{userData?.points}</Text>
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
          {RewardsData.length > 0 &&
            RewardsData.slice(0, maxItems).map((reward, index) => (
              <VerticalItemList
                key={index}
                imageSource={reward.image}
                title={reward.name}
                subtitle={reward.supplierName}
                points={reward.price}
                onPress={() => {
                  navigation.navigate("Reward", { reward });
                }}
              />
            ))}
          <View style={styles.line}></View>
          <TouchableOpacity style={styles.rButton} onPress={() => {}}>
            <Text style={styles.rButtonText}>View All Rewards</Text>
          </TouchableOpacity>
        </SectionContainer>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingBottom: 16,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
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
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  levelText2: {
    fontSize: 12.5,
    fontWeight: "bold",
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
