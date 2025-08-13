import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import { fetchUserContributionData2 } from "../features/userSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import { RootState } from "../store";
import GroupedContributions from "../components/GroupedContributions";
import { Button, Divider } from "react-native-paper";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

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

  // 获取所有年份
  const years = contributionsData ? Object.keys(contributionsData) : [];
  const currentYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState(
    years.includes(currentYear) ? currentYear : years[0]
  );

  // 获取该年所有月份
  const months =
    contributionsData && contributionsData[selectedYear]
      ? Object.keys(contributionsData[selectedYear])
      : [];
  const currentMonth = monthNames[new Date().getMonth()];
  const [selectedMonth, setSelectedMonth] = useState(
    months.includes(currentMonth) ? currentMonth : months[0]
  );

  // 当年份变化时，自动切换到该年有数据的第一个月
  useEffect(() => {
    if (months.length > 0 && !months.includes(selectedMonth)) {
      setSelectedMonth(months[0]);
    }
    // eslint-disable-next-line
  }, [selectedYear]);

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color="#FF8D13"
        style={styles.loadingIndicator}
      />
    );
  }

  // 选中的数据
  const selectedData =
    contributionsData &&
    contributionsData[selectedYear] &&
    contributionsData[selectedYear][selectedMonth]
      ? contributionsData[selectedYear][selectedMonth]
      : {};

  return (
    <View style={styles.container}>
      <GroupedContributions data={contributionsData || {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 12,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  selectorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
    gap: 8,
  },
  selectorButton: {
    marginRight: 8,
    marginBottom: 4,
  },
});

export default ContributionsHistory;
