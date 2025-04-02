import React, { useEffect, useState, useCallback } from "react";
import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Text,
  View,
  Image,
  RefreshControl,
} from "react-native";
import { fetchRewardsObtainedData } from "../features/userSlice";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import { useAppDispatch, useAppSelector } from "../hooks";
import { RootState } from "../store";
import { RewardObtainedType } from "../types";

export default function ActiveRewardsPage({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "ActiveRewardsPage">) {
  const dispatch = useAppDispatch();
  const email = useAppSelector(
    (state: RootState) => state.user.data?.emailAddress
  ) as string;
  const rewardsActiveData = useAppSelector(
    (state: RootState) => state.user.rewardsActiveData
  );
  const rewardsPastData = useAppSelector(
    (state: RootState) => state.user.rewardsPastData
  );
  const [activeTab, setActiveTab] = useState<"active" | "past">("active");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (email) {
      fetchData();
    }
  }, [email]);

  const fetchData = async () => {
    setRefreshing(true);
    await dispatch(fetchRewardsObtainedData({ email, type: "active" }));
    await dispatch(fetchRewardsObtainedData({ email, type: "past" }));
    setRefreshing(false);
  };

  const handleTabChange = (tab: "active" | "past") => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      dispatch(fetchRewardsObtainedData({ email, type: tab }));
    }
  };

  const renderRewardItem = useCallback(
    ({ item }: { item: RewardObtainedType }) => (
      <Pressable
        onPress={() =>
          navigation.navigate(
            activeTab === "active"
              ? "ActiveRewardsDetailsPage"
              : "PastRewardsDetailsPage"
          )
        }
      >
        <View style={styles.gridItem}>
          <View
            style={[
              styles.imageBox,
              activeTab === "past" && styles.usedImageBox,
            ]}
          >
            <Image
              source={{ uri: item.rewardInfo.image }}
              style={styles.image}
            />
          </View>
          <View style={styles.text}>
            <Text style={styles.supplierName}>
              {item.rewardInfo.supplierName}
            </Text>
            <Text style={styles.rewardTitle}>{item.rewardInfo.name}</Text>
            <Text style={styles.expiryDate}>Expires on {item.expiredDate}</Text>
            {activeTab === "past" && <Text style={styles.usedBadge}>Used</Text>}
          </View>
        </View>
      </Pressable>
    ),
    [navigation, activeTab]
  );

  return (
    <View style={styles.container}>
      {/* Tab 按钮 */}
      <View style={styles.tabContainer}>
        {["active", "past"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => handleTabChange(tab as "active" | "past")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab === "active" ? "Active Rewards" : "Past Rewards"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 数据加载 & FlatList */}
      {!rewardsActiveData || !rewardsPastData ? (
        <ActivityIndicator
          size="large"
          color="#FF8D13"
          style={styles.loadingIndicator}
        />
      ) : (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={activeTab === "active" ? rewardsActiveData : rewardsPastData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderRewardItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8F8" },

  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "white",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: "#FF8D13",
  },
  activeTabText: {
    color: "#FF8D13",
    fontSize: 16,
    fontWeight: "bold",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#BABABA",
  },

  loadingIndicator: { flex: 1, justifyContent: "center", alignItems: "center" },

  listContent: { paddingBottom: 100 },

  gridItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: 12,
    // marginBottom: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  imageBox: {
    marginLeft: 10,
    alignSelf: "center",
    // height: "80%", // 增大高度
    width: "40%", // 让图片区域更宽
    backgroundColor: "#F1CFA3",
    borderRadius: 15,
    justifyContent: "center", // 让图片居中
    alignItems: "center",
  },

  usedImageBox: { backgroundColor: "#9E815B" },

  image: {
    alignSelf: "center",
    resizeMode: "cover",
    width: 180, // 增大宽度
    height: 140, // 增大高度
    borderRadius: 15, // 让图片边角更圆润
  },

  text: {
    flex: 1,
    marginLeft: 15,
  },

  supplierName: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },

  rewardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },

  expiryDate: {
    fontSize: 14,
    color: "#666",
  },

  usedBadge: {
    position: "absolute",
    right: 10,
    bottom: -20,
    backgroundColor: "#D3D3D3",
    color: "#555",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    fontSize: 12,
    fontWeight: "bold",
  },
});
