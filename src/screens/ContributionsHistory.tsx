import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import { fetchUserContributionData2 } from "../features/userSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import { RootState } from "../store";
import GroupedContributions from "../components/GroupedContributions";

const ContributionsHistory = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "ContributionsHistory">) => {
  const dispatch = useAppDispatch();
  const email = useAppSelector(
    (state) => state.user.data?.emailAddress
  ) as string;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchUserContributionData2(email));
      } catch (error) {
        console.error("Error fetching contribution data:", error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [dispatch, email]);

  const contributionsData = useAppSelector(
    (state: RootState) => state.user.contributionData
  );

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
    <View style={styles.container}>
      <GroupedContributions data={contributionsData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ContributionsHistory;
