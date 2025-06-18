import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  ImageSourcePropType,
  GestureResponderEvent,
  ScrollView,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import ContentContainer from "../components/ContentContainer";
import ParagraphText from "../components/text_components/ParagraphText";
import { RootStackParamList } from "../Screen.types";
import {
  FirebaseFirestoreTypes,
  firebase,
} from "@react-native-firebase/firestore";
import { RouteProp, useRoute } from "@react-navigation/native";
import PrimaryText from "../components/text_components/PrimaryText";
import { useAppSelector } from "../hooks";
import { selectUserName } from "../features/userSlice";
import { NavigationProp } from "@react-navigation/native";
import ButtonText from "../components/text_components/ButtonText";
import TextButton from "../components/TextButton";
import CreateActivity from "./CreateActivity";
  
  const ActivitySeeAll = ({
    navigation,
    route,
  }: NativeStackScreenProps<RootStackParamList, "ActivitySeeAll">) => {
    // const name = useAppSelector(selectUserName);
    // const {item} = route.params;
    const item = route.params;
    console.log("activityseeall item:",item);
    return (
      <>
        <ContentContainer>
          <View style={styles.listContainer}>
            <ScrollView>
              <ActivityListSection
                title={''}
                navigation={navigation}
                route={route}
                //item={item}
              />
            </ScrollView>
            <TextButton onPress={()=>navigation.navigate("CreateActivity", item )}> New Activity</TextButton>
          </View>
        </ContentContainer>
      </>
    );
  };

  type ListSectionProps = {
    title: string;
    navigation: NavigationProp<RootStackParamList>;
    route:any;
  };

    // Helper to safely format the date value
    const formatTimestamp = (timestamp: any) => {
      const options = {
        // weekday: "long",
        day: "numeric",
        year: "numeric",
        month: "long",

        // hour: "numeric",
        // minute: "numeric",
        hour12: true,
      };
      if (!timestamp) return "N/A";
      // If timestamp is a Firebase Timestamp, it has a toDate method
      if (typeof timestamp.toDate === "function") {
        return timestamp.toDate().toLocaleString("en-US", options);
      }
      // Otherwise, try parsing it as a regular date
      return new Date(timestamp).toLocaleString("en-US", options);
    };

  // type ActivityType = {
  //   Name: string;
  //   Description: string;
  //   logo: string;
  //   //test: string;
  // };

  // Display activities from firebase
  const renderActivtiesItem = ({
    item,
    navigation,
  }: {
    item: any;
    // route:any;
    navigation: any;
  }) => (
    <Pressable  onPress={() => navigation.navigate("ActivityInfo", { item, id: item.id })}>
      <View style={styles.gridItem}>
          <View style={styles.imageBox}>
            <Image
              source={{
                uri: item.logo,
              }}
              style={styles.image}
            />
          </View>
        {/* </View> */}
        <View style={styles.text}>
          <Text style={styles.description}>{item.name}</Text>
          <Text style={styles.subDescription}>{item.description}</Text>
          <View style={styles.pointContainer}>
            <Text style={styles.point}>{ formatTimestamp(item.endDate)}</Text>
            {/* <Text style={styles.point}>{item.test}</Text> */}
            {/* <Text style={styles.pointDesc}> points</Text> */}
          </View>
        </View>
      </View>
    </Pressable>
  );

  const ActivityListSection = ({ title, navigation,route }: ListSectionProps) => {
    const [activitiesData, setActivitiesData] = useState<
      FirebaseFirestoreTypes.DocumentData[]
    >([]);

    const item = route.params;

    useEffect(() => {
      // get communities data from firebase (query part - can be declared what data to show)
      //"coming data" path should be updated to fetch and filter from activity's collection
      const fetchActivityData = async () => {
        try {
          console.log("seeall id", route.params.id);
          const response = await firebase
            .firestore()
            .collection("Activities")
            .where("communityId", "==", item.item.id)
            .get();

          const fetchedActivityData = response.docs.map((doc) => doc.data());
          setActivitiesData(fetchedActivityData);
        } catch (error) {
          console.error("Error fetching communities data seeall:", error);
        }
      };
  
      fetchActivityData();
    }, []);
  
    return (
      <View>
        <FlatList
          //horizontal
          //showsHorizontalScrollIndicator={false}
          // data={communities}
          data={activitiesData} // data from firebase
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => renderActivtiesItem({ item, navigation })}
          contentContainerStyle={{ paddingTop: 5, paddingRight: 9, paddingLeft:9 }}
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
  
  export default ActivitySeeAll;
  
  const styles = StyleSheet.create({
    communityNameContainer: {
      justifyContent: "center",
      alignItems: "center",
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
  
    gridItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FFF3E0",
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: "#ddd",
      // flexDirection: "row",
      //   alignItems: "center",
      //   backgroundColor: "#FFF3E0",
      //   padding: 10,
      //   borderRadius: 10,
      //   marginBottom: 10,
    },
    imageBox: {
      flex:1,
      width: "100%",
      height:"60%",
      backgroundColor: "#F5DEB3",
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 15,
      padding: 1,
    },
    image: {
      // width: 50,
      // height: 50,
      marginRight: 1,
      width: "100%",
      height: "140%",
      resizeMode: "stretch",
      borderRadius: 5,
      // borderTopRightRadius: 5,

    },
    text: {
      flex: 1,
      // backgroundColor: "#fff0ff",
      height: "90%",
      // borderBottomLeftRadius: 20,
      // borderBottomRightRadius: 20,
    },
    description: {
      // fontSize: 19,
      textAlign: "left",
      // marginTop: 1,
      marginLeft: 10,
      // fontWeight: "bold",
      fontSize: 16,
      fontWeight: "bold",
    },
    subDescription: {
      fontSize: 14,
      textAlign: "left",
      marginLeft: 10,
    },
    point: {
      fontSize: 14,
      color: "#FF6F00",
      textAlign: "right",
      fontWeight: "bold",
    },
    pointDesc: {
      fontSize: 15,
      textAlign: "left",
    },
    pointContainer: {
      // flexDirection: "row",
      marginTop: 10,
    },

    scrollViewContent: {
      // paddingHorizontal: 16,
      paddingBottom: 16,
    },

  });
  
  
  