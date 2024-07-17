import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const ActivityFlatList = ({
  data,
  type,
}: {
  data: any;
  type: "received" | "used";
}) => {
  return (
    <FlatList
      contentContainerStyle={{ paddingBottom: 100 }}
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View>
          <View style={styles.listContainer1}>
            <Text style={styles.listDateText}>{item.date}</Text>
          </View>
          <View style={styles.listContainer2}>
            <Text style={styles.listTimeText}>{item.time}</Text>
            <Text style={styles.listCategoryText}>Time Points Rewards</Text>
            <View style={styles.tabContainer}>
              <Text style={styles.listNameText}>TimeBank Rewards Points</Text>
              <Text style={styles.listPointsText}>
                {type === "received" ? `+${item.points}` : `-${item.points}`}
              </Text>
            </View>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  listContainer1: {
    backgroundColor: "transparent",
    paddingHorizontal: 20,
    paddingVertical: 7,
  },
  listContainer2: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  listDateText: {
    fontSize: 16,
    fontWeight: "300",
  },
  listTimeText: {
    fontSize: 14,
    fontWeight: "300",
    paddingBottom: 3,
  },
  listCategoryText: {
    fontSize: 16,
    fontWeight: "bold",
    paddingBottom: 3,
  },
  listNameText: {
    fontSize: 15,
    fontWeight: "400",
  },
  listPointsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF8D13",
  },
});

export default ActivityFlatList;
