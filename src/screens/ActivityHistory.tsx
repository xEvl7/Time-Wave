import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Button,
  ScrollView,
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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Calendar } from "react-native-calendars";

const ActivityHistory = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "ActivityHistory">) => {
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
  const [activeTab, setActiveTab] = useState<"community" | "points">(
    "community"
  );
  const [filterText, setFilterText] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const [isCalendarVisible, setCalendarVisible] = useState(false);

  useEffect(() => {
    if (email) {
      dispatch(fetchPointsReceivedData(email));
      dispatch(fetchPointsUsedData(email));
      dispatch(fetchUserActivitiesData({ email, startDate, endDate }));
    }
  }, [dispatch, email]);

  useEffect(() => {
    // Update loading state based on the completion of all fetches
    setIsLoading(!(pointsReceivedData && pointsUsedData && activitiesData));
  }, [pointsReceivedData, pointsUsedData, activitiesData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (email) {
      dispatch(fetchPointsReceivedData(email));
      dispatch(fetchPointsUsedData(email));
      dispatch(fetchUserActivitiesData({ email, startDate, endDate }));
    }
    setIsRefreshing(false); // 数据加载完后停止刷新
  };

  // Combined points data with date filtering
  const pointsData = () => {
    const received = (pointsReceivedData || [])
      .filter((point) => filterByDateRange(point.date))
      .map((point) => ({
        date: point.date || "N/A",
        time: point.time || "N/A",
        title: "Points Received",
        description: `+${point.points || 0}`,
      }));

    const used = (pointsUsedData || [])
      .filter((point) => filterByDateRange(point.date))
      .map((point) => ({
        date: point.date || "N/A",
        time: point.time || "N/A",
        title: "Points Used",
        description: `-${point.points || 0}`,
      }));

    return [...received, ...used];
  };

  const filterByDateRange = (dateStr: string) => {
    const pointDate = new Date(convertDate(dateStr));
    return (
      (!startDate || new Date(startDate) <= pointDate) &&
      (!endDate || new Date(endDate) >= pointDate)
    );
  };

  const handleDateSelection = (
    dateString: string,
    dateType: "startDate" | "endDate"
  ) => {
    if (dateType === "startDate") setStartDate(dateString);
    else setEndDate(dateString);

    if (activeTab === "community" && email) {
      dispatch(fetchUserActivitiesData({ email, startDate, endDate }));
    }
  };

  const resetDateRange = () => {
    setStartDate(null);
    setEndDate(null);

    if (activeTab === "community" && email) {
      dispatch(fetchUserActivitiesData({ email }));
    }
  };

  const normalizeData = (data: any[]) => {
    const filteredData = data.filter((item) => {
      const title = item.title?.toLowerCase() || "";
      const description = item.description?.toLowerCase() || "";
      return (
        title.includes(filterText.toLowerCase()) ||
        description.includes(filterText.toLowerCase())
      );
    });

    // Parse and sort by date and time
    const sortedData = filteredData.sort((a, b) => {
      const dateA = safeParseDateTime(a.date, a.time);
      const dateB = safeParseDateTime(b.date, b.time);
      return dateB - dateA; // Sort in descending order (latest first)
    });

    return sortedData;
  };

  // Helper function to safely parse date and time
  const safeParseDateTime = (dateStr: string, timeStr: string) => {
    const validDateStr = convertDate(dateStr); // 转换为 "YYYY-MM-DD"
    const validTimeStr = validateTime(timeStr); // 确保时间有效
    const dateTimeStr = `${validDateStr}T${validTimeStr}`; // 拼接成 ISO 格式字符串

    const parsedDate = Date.parse(dateTimeStr);
    return isNaN(parsedDate) ? Date.parse("1970-01-01T00:00:00") : parsedDate; // 解析失败则返回默认时间
  };

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

  const handleTabChange = (tab: "community" | "points") => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setIsLoading(true);

      if (tab === "community") {
        dispatch(fetchUserActivitiesData({ email, startDate, endDate }));
      } else {
        dispatch(fetchPointsReceivedData(email));
        dispatch(fetchPointsUsedData(email));
      }
    }
  };

  const displayedData =
    activeTab === "community"
      ? normalizeData(activitiesData || [])
      : normalizeData(pointsData());

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "community" && styles.activeTab,
          ]}
          onPress={() => handleTabChange("community")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "community" && styles.activeTabText,
            ]}
          >
            Community
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "points" && styles.activeTab]}
          onPress={() => handleTabChange("points")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "points" && styles.activeTabText,
            ]}
          >
            Points
          </Text>
        </TouchableOpacity>
      </View>

      {/* Calendar for Date Range Selection */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setCalendarVisible(!isCalendarVisible)}
      >
        <Text style={styles.toggleButtonText}>
          {isCalendarVisible ? "Hide Calendar" : "Filter by Date"}
        </Text>
      </TouchableOpacity>

      {isCalendarVisible && (
        <ScrollView style={styles.calendarContainer}>
          <Text style={styles.dateText}>
            Start Date: {startDate || "Not Selected"}
          </Text>
          <Calendar
            onDayPress={(day) =>
              handleDateSelection(day.dateString, "startDate")
            }
            markedDates={{
              [startDate]: {
                selected: true,
                marked: true,
                selectedColor: "#FF8D13",
              },
            }}
          />
          <Text style={styles.dateText}>
            End Date: {endDate || "Not Selected"}
          </Text>
          <Calendar
            onDayPress={(day) => handleDateSelection(day.dateString, "endDate")}
            markedDates={{
              [endDate]: {
                selected: true,
                marked: true,
                selectedColor: "#FF8D13",
              },
            }}
          />
          <TouchableOpacity style={styles.resetButton} onPress={resetDateRange}>
            <Text style={styles.resetButtonText}>Reset Date Range</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#FF8D13"
          style={styles.loadingIndicator}
        />
      ) : (
        <ActivityFlatList
          data={displayedData}
          type={activeTab}
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
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderColor: "white",
    backgroundColor: "white",
  },
  activeTab: {
    borderColor: "#FF8D13",
  },
  activeTabText: {
    color: "#FF8D13",
    fontSize: 16,
    fontWeight: "bold",
  },
  toggleButton: {
    // backgroundColor: "#FF8D13", // Button background color
    // paddingVertical: 12,
    paddingHorizontal: 20,
    // borderRadius: 8, // Rounded corners
    alignItems: "flex-end",
    marginVertical: 10,
    // alignSelf: "center", // Center the button
  },
  toggleButtonText: {
    color: "#FF8D13", // Button text color
    fontSize: 16,
    fontWeight: "bold",
  },
  calendarContainer: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  dateText: {
    fontSize: 16,
    marginVertical: 10,
    fontWeight: "bold",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#BABABA",
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  resetButton: {
    backgroundColor: "#FF8D13",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  resetButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default ActivityHistory;
