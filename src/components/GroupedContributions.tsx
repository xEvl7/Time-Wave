import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

interface UserContribution {
    // year: string;
    month: string;
    totalContrHours: number;
    updatedDate: any;
  }
  
const GroupedContributions = ({ data }: { data: { [year: string]: UserContribution[] } }) => {
  const renderItem = ({ item }: { item: UserContribution }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemMonth}>{item.month}</Text>
      <Text style={styles.itemHours}>Hours: {item.totalContrHours}</Text>
      <Text style={styles.itemDate}>Date: {item.updatedDate}</Text>
    </View>
  );

  const renderYear = ({ item }: { item: { year: string; contributions: UserContribution[] } }) => (
    <View style={styles.yearContainer}>
      <Text style={styles.yearHeader}>{item.year}</Text>
      <FlatList
        data={item.contributions}
        renderItem={renderItem}
        keyExtractor={(item) => item.month + item.updatedDate}
      />
    </View>
  );

  const groupedData = Object.keys(data).map((year) => ({
    year,
    contributions: data[year],
  }));

  return (
    <FlatList
      data={groupedData}
      renderItem={renderYear}
      keyExtractor={(item) => item.year}
    />
  );
};

const styles = StyleSheet.create({
  yearContainer: {
    marginBottom: 16,
  },
  yearHeader: {
    fontSize: 20,
    fontWeight: "bold",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#f0f0f0",
  },
  itemContainer: {
    padding: 12,
    marginVertical: 8,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#BDBDBD",
  },
  itemMonth: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemHours: {
    fontSize: 14,
  },
  itemDate: {
    fontSize: 12,
    color: "#757575",
  },
});

export default GroupedContributions;
