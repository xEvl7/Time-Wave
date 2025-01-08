import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  fetchPointsReceivedData,
  fetchPointsUsedData,
  fetchUserActivitiesData,
} from "../features/userSlice";
import { RootState } from "../store";
import ActivityFlatList from "../components/ActivityFlatList";
import HeaderText from "../components/text_components/HeaderText";

const RecentActivities = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "RecentActivities">) => {
  const dispatch = useAppDispatch();
  const email = useAppSelector(
    (state: RootState) => state.user.data?.emailAddress
  ) as string;
  const pointsReceivedData = useAppSelector(
    (state: RootState) => state.user.pointsReceivedData
  );
  const pointsUsedData = useAppSelector(
    (state: RootState) => state.user.pointsUsedData
  );
  const activitiesData = useAppSelector(
    (state: RootState) => state.user.activitiesData
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [startDate, setStartDate] = useState<string | null>(null); // 初始为 null
  const [endDate, setEndDate] = useState<string | null>(null); // 初始为 null

  useEffect(() => {
    dispatch(fetchPointsReceivedData(email));
    dispatch(fetchPointsUsedData(email));
    // dispatch(fetchUserActivitiesData(email));
    dispatch(fetchUserActivitiesData({ email, startDate, endDate }));
  }, [dispatch, email]);

  useEffect(() => {
    if (pointsReceivedData && pointsUsedData && activitiesData) {
      setIsLoading(false);
    }
  }, [pointsReceivedData, pointsUsedData, activitiesData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    dispatch(fetchPointsReceivedData(email));
    dispatch(fetchPointsUsedData(email));
    dispatch(fetchUserActivitiesData({ email, startDate, endDate }));
    setIsRefreshing(false); // 数据加载完后停止刷新
  };

  const normalizeData = () => {
    const pointsData = (pointsReceivedData || []).map((point) => ({
      date: point.date || "N/A",
      time: point.time || "N/A",
      title: "Points Received",
      description: `+${point.points || 0}`, // For received points
    }));

    const usedData = (pointsUsedData || []).map((point) => ({
      date: point.date || "N/A",
      time: point.time || "N/A",
      title: "Points Used",
      description: `-${point.points || 0}`, // For used points
    }));

    const activities = (activitiesData || []).map((activity) => ({
      date: activity.scanDate || "N/A", // Use scanDate
      time: activity.scanTime || "N/A", // Use scanTime
      title:
        activity.type === "check-in" || activity.type === "check-out"
          ? `${activity.type}`
          : `${activity.type}`,
      description:
        activity.type === "check-in" || activity.type === "check-out"
          ? `${activity.activityName || "Unknown"}`
          : `Activity: ${activity.activityName || "Unknown"}`, // Description for activities
    }));

    // console.log("Points Data:", pointsData);
    // console.log("Used Data:", usedData);
    // console.log("Activities:", activities);

    // Combine and sort the data
    const combinedData = [...pointsData, ...usedData, ...activities];

    // console.log("Combined Data:", combinedData);

    // Parse and sort by date and time
    const sortedData = combinedData.sort((a, b) => {
      const dateA = safeParseDateTime(a.date, a.time);
      const dateB = safeParseDateTime(b.date, b.time);
      return dateB - dateA; // Sort in descending order (latest first)
    });

    // console.log("Sorted Data:", sortedData);

    // Return only the top 10 results
    return sortedData.slice(0, 10);
  };

  // Helper function to safely parse date and time
  const safeParseDateTime = (dateStr: string, timeStr: string) => {
    const validDateStr = convertDate(dateStr); // 转换为 "YYYY-MM-DD"
    const validTimeStr = validateTime(timeStr); // 确保时间有效
    const dateTimeStr = `${validDateStr}T${validTimeStr}`; // 拼接成 ISO 格式字符串

    const parsedDate = Date.parse(dateTimeStr);
    return isNaN(parsedDate) ? Date.parse("1970-01-01T00:00:00") : parsedDate; // 解析失败则返回默认时间
  };

  // Helper function to convert "Wed, 25 Sep 2024" to "2024-09-25"
  const convertDate = (dateStr) => {
    const months = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };

    if (!dateStr) return "1970-01-01"; // 如果日期无效，返回默认日期

    const [dayOfWeek, day, monthStr, year] = dateStr.split(" ");
    const month = months[monthStr];

    if (!day || !month || !year) return "1970-01-01"; // 确保日期解析有效

    return `${year}-${month}-${day.padStart(2, "0")}`; // 返回标准格式日期
  };

  // 新增的时间验证函数
  const validateTime = (timeStr) => {
    const validTime = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?\s?(AM|PM)?$/i;

    if (validTime.test(timeStr)) {
      if (timeStr.includes("AM") || timeStr.includes("PM")) {
        // 如果时间包含 AM/PM，我们需要转换为 24 小时制
        const [time, modifier] = timeStr.split(" ");
        let [hours, minutes] = time.split(":");
        if (modifier.toUpperCase() === "PM" && hours !== "12") {
          hours = String(Number(hours) + 12);
        }
        if (modifier.toUpperCase() === "AM" && hours === "12") {
          hours = "00";
        }
        return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:00`;
      }
      return timeStr;
    }

    return "00:00:00"; // 无效时间返回午夜
  };

  const sortedActivities = normalizeData();

  return (
    <View style={styles.container}>
      <HeaderText>Recent</HeaderText>
      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => navigation.navigate("ActivityHistory")}
      >
        <Text style={styles.buttonText}>History</Text>
      </TouchableOpacity>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#FF8D13"
          style={styles.loadingIndicator}
        />
      ) : (
        <ActivityFlatList
          data={sortedActivities}
          type="combined"
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={["#FF8D13"]}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  historyButton: {
    position: "absolute", // Position the button absolutely
    top: 20, // Distance from the top
    right: 20, // Distance from the right
    backgroundColor: "#FF8D13",
    paddingVertical: 5, // Small vertical padding
    paddingHorizontal: 10, // Small horizontal padding
    borderRadius: 15,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12, // Smaller font size for the button text
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RecentActivities;
