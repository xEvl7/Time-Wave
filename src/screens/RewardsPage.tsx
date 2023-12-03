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
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { updateUserData } from "../features/userSlice";
import { fetchUserData } from "../features/userSlice";
import { useAppDispatch, useAppSelector } from "../hooks";

const RewardsPage = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "RewardsPage">) => {
  const [isLoading, setIsLoading] = useState(true);
  const userData = useAppSelector((state) => state.user.data);
  const dispatch = useAppDispatch();

  //const email = userData?.uemail;
  const uid = userData?.uid;

  // user's contributed hours and rewards points need to get from firebase
  const [contributedHours, setContributedHours] = useState<number>(16);
  // const [contributedHours, setContributedHours] = useState([]);
  // const [rewardsPoints, setRewardsPoints] = useState<number>(113);

  const fetchUserData = async (uid: string | undefined) => {
    const userCollection = firestore().collection("Users");

    try {
      const userDoc = await userCollection.doc(uid).get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        // You now have the user's data in the `userData` variable.
        return userData;
      } else {
        console.log("User document not found.");
        return null; // Handle this case appropriately in your code.
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null; // Handle this case appropriately in your code.
    }
  };

  // Example of adding a contribution for January 2023
  // const newContribution = {
  //   totalCHours: 20,
  //   updatedDate: new Date(Date.now()),
  // };

  // firestore()
  //   .collection("Users")
  //   .doc("0XsA0YrwZyjjzqhMi1ve")
  //   .collection("UserContributions")
  //   .doc("2023")
  //   .collection("Jan")
  //   .add(newContribution);

  const progressPercentage = contributedHours / 20;
  const progressBarWidth = `${progressPercentage * 100}%`;

  const [currentLevelMaxHours, setCurrentLevelMaxHours] = useState<number>(20); //到20.0就变level3
  const hoursLeftToNextLevel = currentLevelMaxHours - contributedHours;

  /* Date Variable */
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const nextMonthFirstDay = new Date(year, month + 1, 1);

  const lastDay = new Date(nextMonthFirstDay.getTime() - 1);

  const lastDate = lastDay.getDate();
  const lastMonth = lastDay.toLocaleString("default", { month: "short" });
  const lastYear = month === 11 ? year + 1 : year;

  const formattedLastDay = `${lastDate} ${lastMonth} ${lastYear}`;
  /* Date Variable End*/

  useEffect(() => {
    // Simulate loading data
    setTimeout(async () => {
      setIsLoading(false);
    }, 500); // Simulated loading time (1 seconds in this example)
  }, []);

  const handlePressBack = () => {
    navigation.navigate("HomePage");
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#FF8D13"
          style={styles.loadingIndicator}
        />
      ) : (
        <View style={styles.container}>
          {/* Level Section */}
          <View style={styles.levelContainer}>
            <Text style={styles.levelText1}>
              Level {calculateLevel(contributedHours)}
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
              {/* <Text style={styles.Text2}>{rewardsPoints}</Text> */}
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
              <Text style={styles.historyButtonText}>
                View my points history
              </Text>
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
      )}
    </ScrollView>
  );
};

const calculateLevel = (hours: number) => {
  // Implement your logic to calculate the level based on contributed hours here
  // Example: return Math.floor(hours / 10); // Assuming 10 hours per level
  return 2; // Replace this with your actual logic
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
