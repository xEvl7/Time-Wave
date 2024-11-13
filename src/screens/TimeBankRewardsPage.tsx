import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  FlatList,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FirebaseFirestoreTypes, firebase } from "@react-native-firebase/firestore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import { NavigationProp } from "@react-navigation/native";
import ButtonText from "../components/text_components/ButtonText";

type RewardType = {
  RID: string;
  image: string;
  name: string;
  supplierName: string;
  price: number;
};

let level = 3;
let points = 120;

export default function TimeBankRewardsPage({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "TimeBankRewardsPage">) {
  const [searchQuery, setSearchQuery] = useState<string>(""); // 搜索输入内容
  const [submittedQuery, setSubmittedQuery] = useState<string>(""); // 提交搜索时的内容
  const [RewardsData, setRewardsData] = useState<RewardType[]>([]); // 奖励数据

  useEffect(() => {
    const fetchRewardsData = async () => {
      try {
        const response = await firebase.firestore().collection("Rewards").get();
        const fetchedRewardsData = response.docs.map((doc) => doc.data());
        setRewardsData(fetchedRewardsData as RewardType[]);
      } catch (error) {
        console.error("Error fetching rewards data:", error);
      }
    };

    fetchRewardsData();
  }, []);

  // 仅在用户点击“搜索”按钮后过滤奖励数据
  const filteredRewards = RewardsData.filter((item) =>
    item.name.toLowerCase().includes(submittedQuery.toLowerCase())
  );

  return (
    <View>
      <View style={styles.BackgroundStyle}>
        <View>
          <Text style={styles.levelText}>Level {level} </Text>
          <Text style={styles.pointsText}>{points} Points</Text>
          <Pressable
            style={{ position: "absolute", top: 16, right: 0 }}
            onPress={() => navigation.navigate("ActiveRewardsPage")}
          >
            {/* <Image source={require("../assets/my-rewards.png")}></Image> */}
          </Pressable>
        </View>
      </View>

      <View style={styles.PressBackground}>
        <Pressable
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => navigation.navigate("RewardsPage")}
        >
          {/* <Image source={require("../assets/my-rewards-diamond.png")}></Image> */}
          <Text style={{ marginLeft: 5, fontSize: 19 }}> My Rewards Details </Text>
        </Pressable>
      </View>

      {/* 搜索框 */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Pressable
          style={styles.searchButton}
          onPress={() => setSubmittedQuery(searchQuery)} // 点击按钮时设置提交的查询
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </Pressable>
      </View>

      <ScrollView>
        {/* 根据搜索情况显示不同的 RewardsListSection */}
        {submittedQuery ? (
          // 当有搜索关键词时，显示匹配的奖励
          <RewardsListSection
            title="Search Results"
            navigation={navigation}
            rewards={filteredRewards} // 传递过滤后的奖励数据
          />
        ) : (
          <>
            <RewardsListSection
              title="Communities"
              navigation={navigation}
              rewards={RewardsData} // 默认显示全部奖励
            />
            <RewardsListSection
              title="Individual"
              navigation={navigation}
              rewards={RewardsData} // 默认显示全部奖励
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

type ListSectionProps = {
  title: string;
  navigation: NavigationProp<RootStackParamList>;
  rewards: RewardType[];
};

// 显示奖励项列表的部分
const RewardsListSection = ({ title, navigation, rewards }: ListSectionProps) => {
  const handleSeeAllPress = () => {
    navigation.navigate("TimeBankRewardsPage");
  };

  return (
    <View>
      <View style={styles.listHeader}>
        <Text>{title}</Text>
        <Pressable onPress={handleSeeAllPress}>
          <ButtonText>See all</ButtonText>
        </Pressable>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={rewards} // 使用奖励数据
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => renderRewardsItem({ item, navigation })}
        contentContainerStyle={{ paddingTop: 5, paddingRight: 25 }}
        ListEmptyComponent={() => (
          <Text style={{ color: "red", textAlign: "center", marginBottom: 20, marginLeft: 20 }}>
            No data available
          </Text>
        )}
      />
    </View>
  );
};

const renderRewardsItem = ({ item, navigation }: { item: RewardType; navigation: any }) => (
  <Pressable onPress={() => navigation.navigate("Reward", { item })}>
    <View style={styles.gridItem}>
      <View style={styles.imageBox}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </View>
      <View style={styles.text}>
        <Text style={styles.description}>{item.name}</Text>
        <Text style={styles.description}>{item.RID}</Text>
        <Text style={styles.subDescription}>{item.supplierName}</Text>
        <View style={styles.pointContainer}>
          <Text style={styles.point}>{item.price}</Text>
          <Text style={styles.pointDesc}> points</Text>
        </View>
      </View>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  BackgroundStyle: {
    height: 150,
    width: "100%",
    padding: 30,
    paddingTop: 40,
    backgroundColor: "#FF8D13",
  },
  PressBackground: {
    position: "absolute",
    top: 120,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-around",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  levelText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFFFFF",
    textShadowColor: "black",
    textShadowRadius: 1,
  },
  pointsText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#FFFFFF",
    textShadowColor: "black",
    textShadowRadius: 1,
    marginBottom: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    margin: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchButton: {
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FF8D13",
    borderRadius: 8,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  gridItem: {
    marginLeft: 25,
    width: 250,
    height: 250,
    marginBottom: 10,
    backgroundColor: "#F1CFA3",
    borderRadius: 20,
    borderColor: "#BDBDBD",
    borderWidth: 1,
  },
  imageBox: {
    alignSelf: "center",
    resizeMode: "cover",
    height: "60%",
  },
  image: {
    alignSelf: "center",
    resizeMode: "cover",
    marginTop: 10,
  },
  text: {
    backgroundColor: "#FFFFFF",
    height: "40%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  description: {
    fontSize: 16,
    textAlign: "left",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 1,
    fontWeight: "bold",
    color: "black",
  },
  subDescription: {
    fontSize: 14,
    textAlign: "left",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 1,
    fontWeight: "bold",
    color: "gray",
  },
  pointContainer: {
    flexDirection: "row",
    marginLeft: 10,
    marginTop: 5,
  },
  point: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  pointDesc: {
    fontSize: 16,
    color: "#FBC02D",
    marginTop: 3,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
});
