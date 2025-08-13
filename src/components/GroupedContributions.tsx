import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Platform,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DateTime } from "luxon";

interface UserContribution {
  month: string;
  totalContrHours: number;
  updatedDate: string;
}

interface GroupedData {
  [year: string]: UserContribution[];
}

interface Props {
  data: GroupedData;
}

const monthOrder: { [key: string]: number } = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
  Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
};

const formatDate = (iso: string) => {
  try {
    return DateTime.fromISO(iso).toFormat("yyyy-MM-dd HH:mm");
  } catch {
    return String(iso);
  }
};

const GroupedContributions: React.FC<Props> = ({ data }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState<"start" | "end" | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const allContributions = useMemo(() =>
    Object.values(data).flat(), [data]);

  const filteredContributions = useMemo(() => {
    return allContributions.filter((c) => {
      const date = DateTime.fromISO(c.updatedDate);
      if (startDate && date < DateTime.fromJSDate(startDate)) return false;
      if (endDate && date > DateTime.fromJSDate(endDate)) return false;
      return true;
    });
  }, [allContributions, startDate, endDate]);

  const groupedData = useMemo(() => {
    const map: { [year: string]: UserContribution[] } = {};
    filteredContributions.forEach((c) => {
      const year = DateTime.fromISO(c.updatedDate).year.toString();
      map[year] = map[year] || [];
      map[year].push(c);
    });
    return Object.keys(map)
      .map(Number)
      .sort((a, b) => b - a)
      .map((year) => ({
        year: String(year),
        contributions: map[year].sort(
          (a, b) => monthOrder[b.month] - monthOrder[a.month]
        ),
      }));
  }, [filteredContributions]);

  const totalHoursByYear = useMemo(() => {
    const totals: { [year: string]: number } = {};
    groupedData.forEach(({ year, contributions }) => {
      totals[year] = contributions.reduce((sum, c) => sum + c.totalContrHours, 0);
    });
    return totals;
  }, [groupedData]);

  const overallTotal = useMemo(
    () => filteredContributions.reduce((sum, c) => sum + c.totalContrHours, 0),
    [filteredContributions]
  );

  const renderContribution = ({ item }: { item: UserContribution }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemMonth}>{item.month}</Text>
      <Text style={styles.itemHours}>Hour(s): {item.totalContrHours}</Text>
      <Text style={styles.itemDate}>Date: {formatDate(item.updatedDate)}</Text>
    </View>
  );

  const renderYearSection = ({
    item,
  }: {
    item: { year: string; contributions: UserContribution[] };
  }) => (
    <View style={styles.yearContainer}>
      <Text style={styles.yearHeader}>
        {item.year} - Total: {totalHoursByYear[item.year] || 0} Hour(s)
      </Text>
      <FlatList
        data={item.contributions}
        renderItem={renderContribution}
        keyExtractor={(item) => `${item.month}-${item.updatedDate}`}
      />
    </View>
  );

  const chartData = Object.entries(totalHoursByYear).map(([year, hours]) => ({
    value: hours,
    label: year,
  }));

  // 刷新功能（模拟，实际可根据需要替换）
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500); // 模拟刷新
  };

  // 重置时间
  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 日期区间选择器 */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FF8D13" }]}
          onPress={() => setShowPicker("start")}
        >
          <Text style={styles.buttonText}>
            {`Start: ${startDate ? startDate.toDateString() : "Not set"}`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FF8D13" }]}
          onPress={() => setShowPicker("end")}
        >
          <Text style={styles.buttonText}>
            {`End: ${endDate ? endDate.toDateString() : "Not set"}`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#888" }]}
          onPress={handleReset}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* 时间选择器 */}
      {showPicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={(event, date) => {
            setShowPicker(null);
            if (event.type === "set" && date) {
              if (showPicker === "start") setStartDate(date);
              if (showPicker === "end") setEndDate(date);
            }
            // 如果是"dismissed"，什么都不做
          }}
        />
      )}

      {/* 列表 */}
      <FlatList
        data={groupedData}
        renderItem={renderYearSection}
        keyExtractor={(item) => item.year}
        ListHeaderComponent={
          <Text style={styles.totalHeader}>
            Overall Total Hour(s): {overallTotal}
          </Text>
        }
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // 允许换行
    justifyContent: "space-around",
    marginVertical: 8,
  },
  totalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 12,
    textAlign: "center",
  },
  yearContainer: {
    marginBottom: 16,
  },
  yearHeader: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  itemContainer: {
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 2,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 1,
  },
  itemMonth: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  itemHours: {
    fontSize: 14,
    color: "#333",
  },
  itemDate: {
    fontSize: 13,
    color: "#666",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
    marginHorizontal: 4,
    marginVertical: 4, // 增加竖直间距，防止重叠
    minWidth: 120, // 可选：让按钮宽度一致
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14, // 可适当减小字体
    textAlign: "center",
  },
});

export default GroupedContributions;
