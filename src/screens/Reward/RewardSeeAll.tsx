import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Screen.types";
import { RewardType } from "../../types"; // 引入 RewardType 類型

const RewardSeeAll = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, "RewardSeeAll">) => {
  // 檢查 route.params 是否為 undefined 或空數據
  const { data } = route.params ?? {}; // 使用 `??` 避免 undefined 情況

  if (!data || data.length === 0) {
    // 如果沒有獲得有效數據，顯示空的提示消息
    return (
      <View style={styles.container}>
        <Text style={styles.emptyMessage}>No rewards available at the moment!</Text>
      </View>
    );
  }

  const renderRewardItem = ({ item }: { item: RewardType | undefined }) => {
    // 檢查 item 是否為有效對象且具有 RID 屬性
    if (!item || !item.RID) {
      console.warn("Invalid item: ", item);
      return null; // 如果 item 沒有 RID 或為 undefined，則不渲染此項目
    }

    return (
      <Pressable
        style={styles.gridItem}
        onPress={() => navigation.navigate("RewardDetails", { item: item })}
      >
        <View style={styles.imageBox}>
          <Image source={{ uri: item.image }} style={styles.image} />
        </View>
        <View style={styles.text}>
          <Text style={styles.description}>{item.name}</Text>
          <Text style={styles.subDescription}>RID {item.RID}</Text>
          <Text style={styles.subDescription}>Supplier Name: {item.supplierName}</Text>
          <Text style={styles.subDescription}>Price: ${item.price}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item?.RID?.toString() ?? "default_key"} // 確保 item.RID 始終是有效的字符串
        renderItem={renderRewardItem}
        contentContainerStyle={{ padding: 10 }}
        ListEmptyComponent={() => (
          <Text style={styles.emptyMessage}>No rewards available at the moment!</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  gridItem: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  imageBox: {
    width: "100%",
    aspectRatio: 16 / 9,
    marginBottom: 10,
  },
  image: {
    width: "60%",  // 图片宽度填满父容器
    aspectRatio: 9 / 9,  // 设置宽高比例
    borderRadius: 8,
    marginBottom: 16,
  },
  text: {
    paddingHorizontal: 4,
  },
  description: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subDescription: {
    fontSize: 13,
    color: "#555",
  },
  emptyMessage: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
});

export default RewardSeeAll;
