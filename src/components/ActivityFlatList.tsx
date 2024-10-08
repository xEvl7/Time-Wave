import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

interface CommunityActivity {
  activityId: string;
  activityName: string;
  communityId: string;
  generateTime: string;
  scanTime: string;
  type: string;
}

interface PointsActivity {
  date: string;
  time: string;
  points: number;
}

interface ActivityFlatListProps {
  data: (CommunityActivity | PointsActivity)[];
  type: "received" | "used" | "community"; // Type can be adjusted based on your needs
}

const ActivityFlatList: React.FC<ActivityFlatListProps> = ({ data, type }) => {
  const renderItem = ({ item }: { item: CommunityActivity | PointsActivity }) => {
    // Type guard to determine if item is CommunityActivity
    const isCommunityActivity = (item: CommunityActivity | PointsActivity): item is CommunityActivity => {
      return (item as CommunityActivity).generateTime !== undefined;
    };

    return (
      <View>
        <View style={styles.listContainer1}>
          <Text style={styles.listDateText}>
            {isCommunityActivity(item) ? item.generateTime : item.date}
          </Text>
        </View>
        <View style={styles.listContainer2}>
          <Text style={styles.listTimeText}>
            {isCommunityActivity(item) ? item.scanTime : item.time}
          </Text>
          {isCommunityActivity(item) ? (
            <>
              <Text style={styles.listCategoryText}>{item.type}</Text>
              {/* <Text style={styles.listNameText}>{item.activityId}</Text> */}
              <Text style={styles.listNameText}>{item.activityName}</Text>
              {/* <Text style={styles.listNameText}>Participated</Text> */}
            </>
          ) : (
            <>
              <Text style={styles.listCategoryText}>Points Rewards</Text>
              <View style={styles.tabContainer}>
                <Text style={styles.listNameText}>Points</Text>
                <Text style={styles.listPointsText}>
                  {type === "received" ? `+${item.points}` : `-${item.points}`}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <FlatList
      contentContainerStyle={{ paddingBottom: 100 }}
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
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
