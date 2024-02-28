import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Animated,
} from "react-native";
import React, { useState, useEffect } from "react";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import {
  fetchUserData,
  fetchUserContributionData,
  // fetchContributionHours,
} from "../features/userSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import { RootState } from "../store";

const RewardsPage = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "RewardsPage">) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const userData = useAppSelector((state) => state.user.data);
  const email = useAppSelector(
    (state) => state.user.data?.emailAddress
  ) as string;
  // const [currentMonth, setCurrentMonth] = useState<string>("Oct");

  // 实现每进来一次都会重新从firebase获取数据
  useEffect(() => {
    console.log("Fetching user data...");
    dispatch(fetchUserData(email));
    console.log("Fetching contribution data...");
    dispatch(fetchUserContributionData(email));
    // dispatch(fetchContributionHours({ email, currentMonth}));
  }, [dispatch]);

  // Access the data from the Redux store
  const contributionData = useAppSelector(
    (state: RootState) => state.user.contributionData
  );

  // Retrieve totalContrHours for a specific year and month
  const selectedYear = "2023";
  const selectedMonth = "Dec";
  const totalContrHours =
    contributionData?.[selectedYear]?.[selectedMonth]?.totalContrHours;

  const [contributedHours, setContributedHours] =
    useState<any>(totalContrHours);
  const progressPercentage = contributedHours / 20;
  const progressBarWidth = `${progressPercentage * 100}%`;

  const [currentLevelMaxHours, setCurrentLevelMaxHours] = useState<number>(11);
  // const [currentLevelMaxHours, setCurrentLevelMaxHours] = useState<number>(21);
  const hoursLeftToNextLevel = currentLevelMaxHours - contributedHours;

  /* Date Variable */
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const nextMonthFirstDay = new Date(year, month + 1, 1);

  const lastDay = new Date(nextMonthFirstDay.getTime() - 1);

  const lastDate = lastDay.getDate();
  const lastMonth = lastDay.toLocaleString("default", { month: "short" });
  const lastYear = month == 11 ? year + 1 : year;

  const formattedLastDay = `${lastDate} ${lastMonth} ${lastYear}`;
  /* Date Variable End*/

  useEffect(() => {
    // Simulate loading data
    setTimeout(async () => {
      setIsLoading(false);
    }, 500); // Simulated loading time
  }, []);

  // Use useEffect to check when data is available
  useEffect(() => {
    if (userData && contributionData) {
      setIsLoading(false);
    }
  }, [userData, contributionData]);

  const handlePressBack = () => {
    navigation.navigate("HomePage");
  };

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
    >
      <View style={styles.container}>
        {/* Level Section */}
        <View style={styles.levelContainer}>
          <Text style={styles.levelText1}>
            Level {calculateLevel(contributedHours)}
            {/* Level 2 */}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={{
                width: progressBarWidth,
                height: 5,
                backgroundColor: "white",
              }}
            />
          </View>
          <Text style={styles.levelText2}>
            Contribute {hoursLeftToNextLevel} more hours by {formattedLastDay}{" "}
            to reach Level {calculateLevel(contributedHours) + 1}
          </Text>

          <View style={styles.policyButtonContainer}>
            <TouchableOpacity
              style={styles.policyButton}
              onPress={() => {
                navigation.navigate("PointsPolicy");
              }}
            >
              <Text style={styles.policyButtonText}>View Points Policy</Text>
              <Image
                source={require("../assets/next_icon_white.png")}
                style={{ width: 20, height: 20 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Contributions Section */}
        <View style={styles.subContainer}>
          <Text style={styles.Text1}>
            So far this month, you have contributed
          </Text>
          <View style={styles.rowContainer}>
            <Text style={styles.Text2}>{contributedHours}</Text>
            <Text style={styles.Text1}>TimeBank Rewards Hours</Text>
          </View>

          <View style={styles.line}></View>

          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => {
              navigation.navigate("ContributionsHistory");
            }}
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
        </View>

        {/* Points Section */}
        <View style={styles.subContainer}>
          <Text style={styles.Text1}>You have</Text>
          <View style={styles.rowContainer}>
            <Text style={styles.Text2}>{userData?.points}</Text>
            <Text style={styles.Text1}>TimeBank Rewards Points</Text>
          </View>

          <View style={styles.line}></View>

          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => {
              // Handle the "View my points history" button click
              navigation.navigate("PointsHistory");
            }}
          >
            <Text style={styles.historyButtonText}>View my points history</Text>
            <Image
              source={require("../assets/next_icon_orange.png")}
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>

          <View style={styles.line}></View>
        </View>

        {/* Latest Rewards */}
        <View style={styles.subContainer}>
          <Text style={styles.lrText1}>Latest Rewards</Text>

          <TouchableOpacity
            onPress={() => {
              // Handle button click
            }}
          >
            <View style={styles.lrContainer}>
              <Image
                source={require("../assets/sewing_machine.png")}
                style={styles.lrImage}
              />
              <View>
                <Text style={styles.lrText2}>Singer Sewing Machine</Text>
                <Text style={styles.lrText3}>Official Mavcap</Text>
                <View style={styles.lrButton}>
                  <Image
                    source={require("../assets/diamond.png")}
                    style={styles.lrIcon}
                  />
                  <Text style={styles.lrText4}>100</Text>
                  <Text style={styles.lrText5}> Points</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.line}></View>

          {/* All Rewards */}
          <TouchableOpacity
            style={styles.rButton}
            onPress={() => {
              // Handle the "View All Rewards" button click
            }}
          >
            <Text style={styles.rButtonText}>View All Rewards</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const calculateLevel = (hours: number) => {
  return Math.floor(hours / 10);
};

const styles = StyleSheet.create({
  scrollViewContent: {
    // paddingHorizontal: 16,
    paddingBottom: 16,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  container: {
    // flex: 1,
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
  progressBar: {
    height: 5,
    backgroundColor: "#FBB97C",
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

  subContainer: {
    paddingVertical: 8,
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
  lrContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    // borderWidth: 1,
    // borderColor: 'lightgray',
    // borderRadius: 8,
  },
  lrImage: {
    width: 150,
    height: 100,
    marginRight: 12,
  },
  lrText2: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
  },
  lrText3: {
    fontSize: 13,
    marginBottom: 6,
  },
  lrButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  lrIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  lrText4: {
    fontSize: 14,
    fontWeight: "bold",
  },
  lrText5: {
    fontSize: 12,
    marginLeft: 2,
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

export default RewardsPage;
