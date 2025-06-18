import React, { useEffect, useState, useCallback } from "react";
import {
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Text,
  View,
  Image,
  RefreshControl,
} from "react-native";
import { fetchRewardsObtainedData } from "../../features/userSlice";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Screen.types";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { RootState } from "../../store";
import { RewardObtainedType } from "../../types";
import SecondaryText from "../../components/text_components/SecondaryText";
import PrimaryText from "../../components/text_components/PrimaryText";
import { DateTime } from "luxon";
import styles from "../../styles";

export default function MyRewards({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "MyRewards">) {
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

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

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
      // console.log(item),
      <Pressable
        onPress={() =>
          navigation.navigate("RewardDetails", {
            item: { RID: item.reference },
            type: item.status,
            redeemedCode: item.code,
            expiredDate: item.expiredDate,
            redeemedDate: item.redeemedDate,
            usedDate: item.usedDate,
          })
        }
      >
        <View style={styles.myRewardGridItem}>
          {/* <View
            style={[
              styles.imageBox,
              activeTab === "past" && styles.imageOverlay,
            ]}
          >
            <Image
              source={{ uri: item.rewardInfo.image }}
              style={styles.image}
            />
          </View> */}
          <View style={styles.verticalImageBox}>
            <Image
              source={{ uri: item.rewardInfo.image }}
              style={styles.verticalImage}
            />

            {activeTab === "past" && (
              <View style={styles.overlayContainer}>
                <View style={styles.imageOverlay} />
              </View>
            )}
          </View>
          <View style={styles.verticalTextContainer}>
            <PrimaryText style={styles.itemTitle}>
              {item.rewardInfo.name}
            </PrimaryText>
            <SecondaryText style={styles.itemSubTitle}>
              {item.rewardInfo.supplierName}
            </SecondaryText>
            {activeTab === "active" && (
              <SecondaryText style={styles.expiryDateText}>
                Expires on{" "}
                {typeof DateTime.fromISO(item.expiredDate).setZone(userTimeZone)
                  ?.toFormat === "function"
                  ? DateTime.fromISO(item.expiredDate)
                      .setZone(userTimeZone)
                      .toFormat("d MMM yyyy, hh:mm:ss a")
                  : DateTime.fromISO(item.expiredDate).setZone(userTimeZone)
                  ? String(
                      DateTime.fromISO(item.expiredDate).setZone(userTimeZone)
                    )
                  : "Unknown"}
              </SecondaryText>
            )}
            {activeTab === "past" && item.usedDate !== "N/A" && (
              <SecondaryText style={styles.expiryDateText}>
                Used on{" "}
                {typeof DateTime.fromISO(item.usedDate).setZone(userTimeZone)
                  ?.toFormat === "function"
                  ? DateTime.fromISO(item.usedDate)
                      .setZone(userTimeZone)
                      .toFormat("d MMM yyyy, hh:mm:ss a")
                  : DateTime.fromISO(item.usedDate).setZone(userTimeZone)
                  ? String(
                      DateTime.fromISO(item.usedDate).setZone(userTimeZone)
                    )
                  : "Unknown"}
              </SecondaryText>
            )}
            {activeTab === "past" && item.usedDate === "N/A" && (
              <SecondaryText style={styles.expiryDateText}>
                Expired on{" "}
                {typeof DateTime.fromISO(item.expiredDate).setZone(userTimeZone)
                  ?.toFormat === "function"
                  ? DateTime.fromISO(item.expiredDate)
                      .setZone(userTimeZone)
                      .toFormat("d MMM yyyy, hh:mm:ss a")
                  : DateTime.fromISO(item.expiredDate).setZone(userTimeZone)
                  ? String(
                      DateTime.fromISO(item.expiredDate).setZone(userTimeZone)
                    )
                  : "Unknown"}
              </SecondaryText>
            )}
            {activeTab === "active" && (
              <SecondaryText style={styles.activeBadge}>Use Now</SecondaryText>
            )}
            {activeTab === "past" && item.usedDate !== "N/A" && (
              <SecondaryText style={styles.usedBadge}>Used</SecondaryText>
            )}
            {activeTab === "past" && item.usedDate === "N/A" && (
              <SecondaryText style={styles.expiredBadge}>Expired</SecondaryText>
            )}
          </View>
        </View>
      </Pressable>
    ),
    [navigation, activeTab]
  );

  return (
    <View style={styles.greyContainer}>
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
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchData}
              colors={["#FF8D13"]} // 仅适用于 Android
              tintColor="#FF8D13" // 仅适用于 iOS
            />
          }
        />
      )}
    </View>
  );
}
