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
import ButtonText from "../../components/text_components/ButtonText";
import HeaderText from "../../components/text_components/HeaderText";
import SecondaryText from "../../components/text_components/SecondaryText";
import ParagraphText from "../../components/text_components/SecondaryText";
import PrimaryText from "../../components/text_components/SecondaryText";
import styles from "../../styles";


const RewardSeeAll = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, "RewardSeeAll">) => {
  // 檢查 route.params 是否為 undefined 或空數據
  const { data } = route.params ?? {}; // 使用 `??` 避免 undefined 情況

  if (!data || data.length === 0) {
    // 如果沒有獲得有效數據，顯示空的提示消息
    return (
      <View style={seeallstyles.container}>
        <Text style={seeallstyles.emptyMessage}>No rewards available at the moment!</Text>
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
    style={styles.myRewardGridItem}
    onPress={() => navigation.navigate("RewardDetails", { item})}
  >
    
      <View style={styles.verticalImageBox}>
        <Image source={{ uri: item.image }} style={styles.verticalImage} />
      </View>
      <View style={styles.verticalTextContainer}>
        <PrimaryText>{item.name}</PrimaryText>
        <SecondaryText style={styles.itemSubTitle}>{item.supplierName}</SecondaryText>
        <Text> </Text>
        <Text>
        <ButtonText>{item.price} points</ButtonText>
        </Text>
      </View>
    
  </Pressable>
    );
  };

  return (
    <View style={seeallstyles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item?.RID?.toString() ?? "default_key"} // 確保 item.RID 始終是有效的字符串
        renderItem={renderRewardItem}
        contentContainerStyle={{ padding: 10 }}
        ItemSeparatorComponent={() => <View style={seeallstyles.separator} />}
        ListEmptyComponent={() => (
          <Text style={seeallstyles.emptyMessage}>No rewards available at the moment!</Text>
        )}
      />
    </View>
  );
};

const seeallstyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  gridItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    
  },
  
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  
  imageBox: {
    flex: 9, // 佔 40%
    backgroundColor: "#F1CFA3",  // 背景框顏色
    padding: 10,
    borderRadius: 10,
    marginRight: 12,
    justifyContent: "center",
  alignItems: "center",
  },
  
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  
  text: {
    flex: 11,
  },
  
  description: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  point: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "left",
    marginLeft: 10,
    color: "#FF8D13",
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
  separator: {
    height: 1,
    backgroundColor: "black",
    marginVertical: 8,
  },
});

export default RewardSeeAll;
