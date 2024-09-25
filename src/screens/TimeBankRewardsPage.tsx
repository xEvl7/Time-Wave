import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import PrimaryText from "../components/text_components/PrimaryText";
import {
  FirebaseFirestoreTypes,
  firebase,
} from "@react-native-firebase/firestore";
import TextButton from "../components/TextButton";
import HeaderText from "../components/text_components/HeaderText";
import BackgroundImageBox from "../components/BackgroundImageBox";
import ContentContainer from "../components/ContentContainer";
import ValidatedTextInput from "../components/ValidatedTextInput";
import { useForm } from "react-hook-form";
import { fetchUserData } from "../features/userSlice";
import { NativeStackScreenProps,
  NativeStackNavigationProp,
 } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import { useAppDispatch, useAppSelector } from "../hooks";
import firestore from "@react-native-firebase/firestore";
import RightDrop from "../components/RightDrop";
import { selectUserName } from "../features/userSlice";
import { NavigationProp } from "@react-navigation/native";
import ButtonText from "../components/text_components/ButtonText";
import Icon from "react-native-vector-icons/Ionicons";
import Ionicons from "react-native-vector-icons/Ionicons";



//type UserProps={
type level = number;
type points = number;
//};
let level = 3;
let points = 120;
let NumberOfItems = 4;
let pointprice = 100;






export default function TimeBankRewardsPage({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "TimeBankRewardsPage">) {
  return (
    <View>
      <View style={styles.BackgroundStyle}>
        {/* <ContentContainer> */}
          <View>
            <Text
              style={{
                fontSize: 30,
                fontWeight: "bold",
                color: "#FFFFFF",
                textShadowColor: "black",
                textShadowRadius: 1,
              }}
            >
              Level {level}{" "}
            </Text>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "bold",
                color: "#FFFFFF",
                textShadowColor: "black",
                textShadowRadius: 1,
                marginBottom: 1,
              }}
            >
              {points} Points
            </Text>
            <Pressable
              style={{ position: "absolute", top: 16, right: 0 }}
              onPress={() => navigation.navigate("ActiveRewardsPage")}
            >
              {/* <Image 
                style={{borderRadius: 10, padding: 20,}} 
                source={require("../assets/my-rewards.png")}></Image> */}
            </Pressable>
          </View>
        {/* </ContentContainer> */}
      </View>

      <View style={styles.PressBackground}>
        <Pressable
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => navigation.navigate("RewardsPage")}
        >
          {/* <Image
            style={{ marginLeft: 29 }}
            source={require("../assets/my-rewards-diamond.png")}
          ></Image> */}
          <Text style={{ marginLeft: 5, fontSize: 19 }}>
            {" "}
            My Rewards Details{" "}
          </Text>
          {/* <Image
            style={{ marginLeft: "23%" }}
            source={require("../assets/arrow-right.png")}
          ></Image> */}
        </Pressable>
      </View>
        
      
      <ScrollView>
        <RewardsListSection
            title={"Communities"}
            navigation={navigation}
          />
        <RewardsListSection
            title={"Individual"}
            navigation={navigation}
          />
        
        {/* <HistoryListSection title={"History"} navigation={navigation} /> */}
      </ScrollView>
      
      
      


      {/* <View style={{marginTop:10,}}>
            <ScrollView horizontal={true} 
            contentContainerStyle={{ flexGrow: 1 }} >    
              <Text style={{fontSize:30,marginTop:80}}> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Text>
              
            </ScrollView>
          </View> */}
    </View>
  );
}

type ListSectionProps = {
  title: string;
  navigation: NavigationProp<RootStackParamList>;
};


type RewardType = {
  RID: string;
  image: string;
  name: string;
  supplierName: string;
  price: number;
};

// Display rewards item that fetch from firebase
const renderRewardsItem = ({
  item,
  navigation,
}: {
  item: RewardType;
  navigation: any;
}) => (
  <Pressable
    onPress={() => navigation.navigate("Reward", { item })}
  >
    <View style={styles.gridItem}>
      <View style={styles.imageBox}>
        <View style={styles.imageBox}>
          <Image source={{ uri: item.image }} style={styles.image} />
        </View>
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

const RewardsListSection = ({ title, navigation }: ListSectionProps) => {
  const [RewardsData, setRewardsData] = useState<
    FirebaseFirestoreTypes.DocumentData[]
  >([]);

  useEffect(() => {
    // get rewards data from firebase (query part - can be declared what data to show)
    const fetchRewardsData = async () => {
      try {
        const response = await firebase.firestore().collection("Rewards").get();
        const fetchedRewardsData = response.docs.map((doc) => doc.data());
        // console.log("fetchedRewardsData", fetchedRewardsData);
        setRewardsData(fetchedRewardsData);
      } catch (error) {
        console.error("Error fetching rewards data:", error);
      }
    };

    fetchRewardsData();
  }, []);

  // to limit how many rewards data to show in home page
  const limit = 5;
  const limitedRewardsData = RewardsData.slice(0, limit);

  // see all button
  const handleSeeAllPress = () => {
    navigation.navigate("TimeBankRewardsPage");
  };

  return (
    <View>
      <View style={styles.listHeader}>
        <PrimaryText>{title}</PrimaryText>
        <Pressable onPress={handleSeeAllPress}>
          <ButtonText>See all</ButtonText>
        </Pressable>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        // data={rewards}
        data={limitedRewardsData} // data from firebase
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => renderRewardsItem({ item, navigation })}
        contentContainerStyle={{ paddingTop: 5, paddingRight: 25 }}
        ListEmptyComponent={() => (
          <Text
            style={{
              color: "red",
              textAlign: "center",
              marginBottom: 20,
              marginLeft: 20,
            }}
          >
            No data available
          </Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  BubbleContainer: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 20,
  },
  BackgroundStyle: {
    height: 150,
    width: "100%",
    padding: 30,
    paddingTop: 40,
    backgroundColor: "#FF8D13",
    //alignItems: "center",
    //justifyContent: "center",
  },
  PressBackground: {
    position: "absolute",
    top: 120,
    left: 0,
    right: 0,
    height: 40,
    width: "100%",
    backgroundColor: "#FFFFFF",
    //alignItems: "center",
    justifyContent: "space-around",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    marginLeft: 25,
    width: 250, // 两个格子并排，留出一些间隙
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
    //position: 'absolute',
    //top: 0,
    //left: 0,
  },
  image: {
    alignSelf: "center",
    resizeMode: "cover",
    marginTop: 10,
    //position: 'absolute',
    //top: 0,
    //left: 0,
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
    marginTop: 1,
    marginLeft: 10,
    fontWeight: "bold",
  },
  subDescription: {
    fontSize: 13,
    textAlign: "left",
    marginLeft: 10,
  },
  point: {
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "left",
    marginLeft: 10,
    color: "#FF8D13",
  },
  pointDesc: {
    fontSize: 15,
    textAlign: "left",
  },
  pointContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginLeft: 5,
  },
  listContainer: {
    flex: 1,
    backgroundColor: "white",
  },

});

// const usersRef = ref(db, 'users');
// get(usersRef).then((snapshot) => {
//   if (snapshot.exists()) {
//     const userData = snapshot.val();
//     // 在这里处理从 Firebase 中提取的数据
//     // 将数据与 control 结合使用
//   } else {
//     console.log('No data available');
//   }
// }).catch((error) => {
//   console.error('Error getting data:', error);
// })
