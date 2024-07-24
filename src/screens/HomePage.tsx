import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
  ImageSourcePropType,
  GestureResponderEvent,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";

import HeaderText from "../components/text_components/HeaderText";
import TextButton from "../components/TextButton";
import PrimaryText from "../components/text_components/PrimaryText";
import SecondaryText from "../components/text_components/SecondaryText";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import { useAppSelector } from "../hooks";
import { selectUserName } from "../features/userSlice";
import { NavigationProp } from "@react-navigation/native";
import {
  FirebaseFirestoreTypes,
  firebase,
} from "@react-native-firebase/firestore";
import ButtonText from "../components/text_components/ButtonText";
import Icon from "react-native-vector-icons/Ionicons";
import Ionicons from "react-native-vector-icons/Ionicons";

const HomePage = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "HomePage">) => {
  const [activePage, setActivePage] = useState("HomePage"); // initialize the navigation
  const name = useAppSelector(selectUserName);

  return (
    <>
      <HeaderSection name={name} navigation={navigation} />

      <View style={styles.listContainer}>
        <ScrollView>
          <CommunitiesListSection
            title={"Communities Around You"}
            navigation={navigation}
          />
          <RewardsListSection
            title={"Time Bank Rewards"}
            navigation={navigation}
          />
          {/* <HistoryListSection title={"History"} navigation={navigation} /> */}
        </ScrollView>
      </View>
    </>
  );
};

type NavigationItemProps = {
  itemSource: ImageSourcePropType;
  text: string;
  onPress: (event: GestureResponderEvent) => void;
  isActive: boolean;
};

// const NavigationItem = ({
//   itemSource,
//   text,
//   onPress,
//   isActive,
// }: NavigationItemProps) => {
//   return (
//     <Pressable
//       style={{
//         alignItems: "center",
//         height: "65%",
//       }}
//       onPress={onPress}
//     >
//       <Image source={itemSource} style={{ aspectRatio: 1, height: "65%" }} />
//       <Text style={{ fontSize: 14, color: "white", textAlign: "center" }}>
//         {text}
//       </Text>
//       {/* {isActive && (
//         <View
//           style={{
//             position: "absolute",
//             top: 0,
//             right: 0,
//             backgroundColor: "green",
//             width: 5,
//             height: 5,
//             borderRadius: 5,
//           }}
//         />
//       )} */}
//     </Pressable>
//   );
// };

// const NavigationBar = ({
//   navigation,
//   activePage,
// }: NativeStackScreenProps<RootStackParamList, "HomePage"> & {
//   activePage: string;
// }) => {
//   return (
//     <View style={styles.navigationBarContainer}>
//       <NavigationItem
//         itemSource={require("../assets/home-icon.png")}
//         text="Home"
//         onPress={() => {
//           navigation.navigate("HomePage");
//         }}
//         isActive={activePage == "HomePage"}
//       />
//       <NavigationItem
//         itemSource={require("../assets/history-icon.png")}
//         text={"History"}
//         onPress={() => { }}
//         isActive={activePage == "HistoryPage"}
//       />
//       <NavigationItem
//         itemSource={require("../assets/activity-icon.png")}
//         text={"Activity"}
//         onPress={() => { }}
//         isActive={activePage == "ActivityPage"}
//       />
//       {/* <NavigationItem
//         itemSource={require("../assets/time-icon.png")}
//         text="TimeBRewards"
//         onPress={() => {
//           navigation.navigate("TimeBankRewardsPage");
//         }}
//         isActive={activePage == "TimeBankRewardsPage"}
//       /> */}
//       <NavigationItem
//         itemSource={require("../assets/reward-icon.png")}
//         text="Rewards"
//         onPress={() => {
//           navigation.navigate("RewardsPage");
//         }}
//         isActive={activePage == "RewardsPage"}
//       />
//       <NavigationItem
//         itemSource={require("../assets/profile-picture.png")}
//         text="Account"
//         onPress={() => {
//           navigation.navigate("Profile");
//         }}
//         isActive={activePage == "Profile"}
//       />
//     </View>
//   );
// };

type ListSectionProps = {
  title: string;
  navigation: NavigationProp<RootStackParamList>;
};

type CommunityType = {
  name: string;
  description: string;
  logo: string;
  test: string;
};

// Display communities item that fetch from firebase
const renderCommunitiesItem = ({
  item,
  navigation,
}: {
  item: CommunityType;
  navigation: any;
}) => (
  
  <Pressable
    onPress={() => navigation.navigate("CommunityProfile", { item })}
  >

    <View style={styles.gridItem}>
      <View style={styles.imageBox}>
        <View style={styles.imageBox}>
          <Image
            source={{
              uri: item.logo,
            }}
            style={styles.image}
          />
        </View>
      </View>
      <View style={styles.text}>
        <Text style={styles.description}>{item.name}</Text>
        <Text style={styles.subDescription}>{item.description}</Text>
        <View style={styles.pointContainer}>
          <Text style={styles.point}>{item.test}</Text>
          {/* <Text style={styles.pointDesc}> points</Text> */}
        </View>
      </View>
    </View>
  </Pressable>
);

const CommunitiesListSection = ({ title, navigation }: ListSectionProps) => {
  const [communitiesData, setCommunitiesData] = useState<
    FirebaseFirestoreTypes.DocumentData[]
  >([]);

  useEffect(() => {
    // get communities data from firebase (query part - can be declared what data to show)
    const fetchCommunitiesData = async () => {
      try {
        const response = await firebase
          .firestore()
          .collection("Communities")
          .get();
        const fetchedCommunitiesData = response.docs.map((doc) => doc.data(
        ));
        setCommunitiesData(fetchedCommunitiesData);
      } catch (error) {
        console.error("Error fetching communities data:", error);
      }
    };

    fetchCommunitiesData();
  }, []);

  // to limit how many communities data to show in home page
  const limit = 5;
  const limitedCommunitiesData = communitiesData.slice(0, limit);

  // see all button
  const handleSeeAllPress = () => {
    // to see all available communities
    navigation.navigate("Communities");
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
        // data={communities}
        data={limitedCommunitiesData} // data from firebase
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => renderCommunitiesItem({ item, navigation })}
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

// const history = [
//   {
//     id: 1,
//     name: "History 1",
//     organization: "Organization 1",
//     pointprice: 100,
//   },
//   {
//     id: 2,
//     name: "History 2",
//     organization: "Organization 2",
//     pointprice: 150,
//   },
//   {
//     id: 3,
//     name: "History 3",
//     organization: "Organization 3",
//     pointprice: 250,
//   },
// ];

// type HistoryType = {
//   image: string;
//   name: string;
//   supplierName: string;
//   price: number;
// };

// Display rewards item that fetch from firebase
// const renderHistoryItem = ({
//   item,
//   navigation,
// }: {
//   item: HistoryType;
//   navigation: any;
// }) => (
//   <Pressable
//     onPress={() =>
//       navigation.navigate("TimeBankRewardsPage", { item })
//     }
//   >
//     <View style={styles.gridItem}>
//       <View style={styles.imageBox}>
//         <View style={styles.imageBox}>
//           <Image source={{ uri: item.image }} style={styles.image} />
//         </View>
//       </View>
//       <View style={styles.text}>
//         <Text style={styles.description}>{item.name}</Text>
//         <Text style={styles.subDescription}>{item.supplierName}</Text>
//         <View style={styles.pointContainer}>
//           <Text style={styles.point}>{item.price}</Text>
//           <Text style={styles.pointDesc}> points</Text>
//         </View>
//       </View>
//     </View>
//   </Pressable>
// );

// const HistoryListSection = ({ title, navigation }: ListSectionProps) => {
//   const [historyData, setHistoryData] = useState<
//     FirebaseFirestoreTypes.DocumentData[]
//   >([]);

//   useEffect(() => {
//     // get History data from firebase (query part - can be declared what data to show)
//     const fetchHistoryData = async () => {
//       try {
//         const response = await firebase.firestore().collection("Rewards").get();
//         const fetchedHistoryData = response.docs.map((doc) => doc.data());
//         setHistoryData(fetchedHistoryData);
//       } catch (error) {
//         console.error("Error fetching history data:", error);
//       }
//     };

//     fetchHistoryData();
//   }, []);

//   // to limit how many History data to show in home page
//   const limit = 5;
//   const limitedHistoryData = historyData.slice(0, limit);

//   // see all button
//   const handleSeeAllPress = () => {
//     // navigation.navigate("HistoryPage");
//   };
//   return (
//     <View>
//       <View style={styles.listHeader}>
//         <PrimaryText>{title}</PrimaryText>
//         <Pressable onPress={handleSeeAllPress}>
//           <ButtonText>See all</ButtonText>
//         </Pressable>
//       </View>

//       <FlatList
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         // data={history}
//         data={limitedHistoryData} // data from firebase
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => renderHistoryItem({ item, navigation })}
//         contentContainerStyle={{ paddingTop: 5, paddingRight: 25 }}
//         ListEmptyComponent={() => (
//           <Text
//             style={{
//               color: "red",
//               textAlign: "center",
//               marginBottom: 20,
//               marginLeft: 20,
//             }}
//           >
//             No data available
//           </Text>
//         )}
//       />
//     </View>
//   );
// };

type HeaderSectionProps = {
  name: string;
  navigation: NativeStackNavigationProp<RootStackParamList, "HomePage">;
};

const HeaderSection = ({ name, navigation }: HeaderSectionProps) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerInfo}>
        <Text style={styles.headerWelcomeText}>Hello, {name}</Text>
        <Pressable
          onPress={() => {
            navigation.navigate("ScanPage");
          }}
          style={styles.iconButton}
        >
          <Ionicons name="scan-outline" size={28} color="#FFF" />
        </Pressable>
      </View>
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 50,
    backgroundColor: "#FF8D13",
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
  },
  headerWelcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: "10%",
    paddingVertical: "4%",
  },
  iconButton: {
    // padding: 10,
  },

  listContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginLeft: 5,
  },

  // viewButton: {
  //   marginTop: "auto",
  //   width: "30%",
  //   minHeight: 25,
  //   backgroundColor: "#E3EAE7",
  // },
  // viewButtonText: {
  //   fontSize: 15,
  //   color: "black",
  // },
  // sectionItem: {
  //   backgroundColor: "#ED8356",
  //   marginHorizontal: 10,
  //   width: 200,
  //   height: 100,
  //   padding: "5%",
  //   borderRadius: 10,
  // },

  // navigationBarContainer: {
  //   flex: 0.13,
  //   backgroundColor: "#FF8D13",
  //   flexDirection: "row",
  //   justifyContent: "space-around", // 调整为 space-around
  //   alignItems: "center",
  //   // marginTop: 20,
  //   // borderTopRightRadius: 20,
  //   // borderTopLeftRadius: 20,
  // },

  //----------------------------------------------------------------

  BubbleContainer: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 20,
  },
  BackgroundStyle: {
    height: 150,
    width: "100%",
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
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    marginLeft: 25,
    width: 200,
    height: 200,
    marginBottom: 10,
    backgroundColor: "#F1CFA3",
    borderRadius: 20,
    borderColor: "#BDBDBD",
    // borderWidth: 1,
  },
  imageBox: {
    // alignSelf: "center",
    // height: "60%",
    // borderRadius: 20,
    // borderColor: "#BDBDBD",
  },
  image: {
    width: 200,
    height: 120,
    resizeMode: "stretch",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  text: {
    backgroundColor: "#FFFFFF",
    height: "40%",
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
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

  scrollViewContent: {
    // paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
