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
import {
  fetchUserData,
  fetchUserContributionData,
} from "../features/userSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import { RootState } from "../store";
import ProgressBar from "../components/ProgressBar";
import SectionContainer from "../components/SectionContainer";
import ListItem from "../components/ListItem";

const Account = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Account">) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const userData = useAppSelector((state: RootState) => state.user.data);
  const contributionData = useAppSelector(
    (state: RootState) => state.user.contributionData
  );

  const email = useAppSelector((state) => state.user.data?.emailAddress) as
    | string
    | undefined;

  useEffect(() => {
    if (!email) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        await dispatch(fetchUserData(email));
        await dispatch(fetchUserContributionData(email));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [dispatch, email]);

  const selectedYear = "2023";
  const selectedMonth = "Dec";
  const totalContrHours =
    contributionData?.[selectedYear]?.[selectedMonth]?.totalContrHours || 0;

  const [contributedHours, setContributedHours] =
    useState<number>(totalContrHours);
  const progressPercentage = (contributedHours / 20);

  const calculateLevel = (hours: number) => {
    if (hours <= 10) return 1;
    if (hours <= 20) return 2;
    if (hours <= 30) return 3;
    return 4;
  };

  const currentLevel = calculateLevel(contributedHours);
  const currentLevelMaxHours = currentLevel * 10; // Example max hours for the current level
  const hoursLeftToNextLevel = currentLevelMaxHours + 10 - contributedHours;

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
    setContributedHours(totalContrHours);
  }, [totalContrHours]);

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color="#FF8D13"
        style={styles.loadingIndicator}
      />
    );
  }

  const handleNavigateToPointsPolicy = () => {
    const level = "level" + calculateLevel(contributedHours);
    // console.log(level);
    navigation.navigate("PointsPolicy", { level });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      scrollEventThrottle={16}
    >
      <View style={styles.container}>
        {/* Level Section */}
        <SectionContainer>
          <View style={styles.levelContainer}>
            <Text style={styles.levelText1}>
              Level {calculateLevel(contributedHours)}
            </Text>
            <ProgressBar progressPercentage={progressPercentage} />
            <Text style={styles.levelText2}>
              Contribute {hoursLeftToNextLevel} more hours by {formattedLastDay}{" "}
              to reach Level {calculateLevel(contributedHours) + 1}
            </Text>
            <View style={styles.policyButtonContainer}>
              <TouchableOpacity
                style={styles.policyButton}
                onPress={() => handleNavigateToPointsPolicy()}
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
            <Text style={styles.Text1}>TimeBank Rewards Hours</Text>
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
            <Text style={styles.Text1}>TimeBank Rewards Points</Text>
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
          <ListItem
            imageSource={require("../assets/sewing_machine.png")}
            title="Singer Sewing Machine"
            subtitle="Official Mavcap"
            points="100"
            onPress={() => {}}
          />
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
