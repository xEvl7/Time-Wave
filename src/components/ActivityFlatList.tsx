import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

interface CommunityActivity {
  activityId: string;
  activityName: string;
  communityId: string;
  generateTime: any;
  scanDate: any;
  scanTime: any;
  type: string;
}

interface PointsActivity {
  date: string;
  time: string;
  points: number;
}

interface CombinedActivity {
  date: string;
  time: string;
  title: string;
  description: string;
  points?: number; // Optional for combined activities
  activityName?: string; // Optional for combined activities
}

interface ActivityFlatListProps {
  data: (CommunityActivity | PointsActivity | CombinedActivity)[];
  type: "received" | "used" | "community" | "combined"; // Added combined type
}

const ActivityFlatList: React.FC<ActivityFlatListProps> = ({ data, type }) => {
  const renderItem = ({
    item,
  }: {
    item: CommunityActivity | PointsActivity | CombinedActivity; // Updated item type
  }) => {
    // Type guard to determine if item is CommunityActivity
    const isCommunityActivity = (
      item: CommunityActivity | PointsActivity | CombinedActivity
    ): item is CommunityActivity => {
      return (item as CommunityActivity).scanDate !== undefined;
    };

    let dateText = "";
    let timeText = "";
    let descriptionText = "";

    if (isCommunityActivity(item)) {
      dateText = item.scanDate;
      timeText = item.scanTime;
      descriptionText = item.activityName;
    } else if ("points" in item) {
      dateText = item.date;
      timeText = item.time;
      descriptionText = `Points: ${item.points || 0}`;
    } else {
      dateText = item.date;
      timeText = item.time;
      descriptionText = item.description; // For combined activities
    }

    return (
      <View>
        <View style={styles.listContainer1}>
          <Text style={styles.listDateText}>{dateText}</Text>
        </View>
        <View style={styles.listContainer2}>
          <Text style={styles.listTimeText}>{timeText}</Text>
          {type === "combined" ? (
            <>
              <Text style={styles.listCategoryText}>{item.title}</Text>
              <Text style={styles.listNameText}>{descriptionText}</Text>
            </>
          ) : isCommunityActivity(item) ? (
            <>
              <Text style={styles.listCategoryText}>{item.type}</Text>
              <Text style={styles.listNameText}>{item.activityName}</Text>
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
