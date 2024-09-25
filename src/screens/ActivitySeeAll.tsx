import { 
    StyleSheet, 
    View ,
    Text,
    Image,
    FlatList,
    Pressable,
    ImageSourcePropType,
    GestureResponderEvent,
    ScrollView,
    Alert } 
  from "react-native";
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
  
  const ActivitySeeAll = ({
    navigation,
    route,
  }: NativeStackScreenProps<RootStackParamList, "ActivitySeeAll">) => {
    // const name = useAppSelector(selectUserName);
    const {item} = route.params;
    console.log("activityseeall item:",item);

    const handlePressJoin =() => {
      navigation.navigate("ActivityEdit", { item })
      //   Alert.alert('',"Join Request Sent Successfuly",[
      //     { text: 'OK', onPress: () => console.log('OK Pressed') },
      //   ],
      //   { cancelable: true }
      // );
    };

    return (
      <>
        <View style={styles.listContainer}>
          <ContentContainer>
            <ScrollView>
              <ActivityListSection
                title={''}
                navigation={navigation}  
                item={item}
              />
            </ScrollView>
            <TextButton onPress={handlePressJoin}> New Activity </TextButton>
          
          </ContentContainer>
        </View>
      </>
    );
  };
  
  type ListSectionProps = {
    title: string;
    navigation: NavigationProp<RootStackParamList>;
    item:any,
  };
  
  type ActivityType = {
    Name: string;
    Description: string;
    logo: string;
    //test: string;
  };
  
  // Display communities item that fetch from firebase
  const renderActivtiesItem = ({
    item, 
    navigation,
  }: {
    item: ActivityType;
    navigation: any;
  }) => (
    <Pressable  onPress={() => navigation.navigate("ActivityInfo", { item })}>
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
            {/* <Text style={styles.point}>{item.test}</Text> */}
            {/* <Text style={styles.pointDesc}> points</Text> */}
          </View>
        </View>
      </View>
    </Pressable>
  );
  
  const ActivityListSection = ({ title, navigation, item }: ListSectionProps) => {
    const [activitiesData, setActivitiesData] = useState<
      FirebaseFirestoreTypes.DocumentData[]
    >([]);
  
    useEffect(() => {
      // get communities data from firebase (query part - can be declared what data to show)
      const fetchActivityData = async () => {
        try {
          console.log("seeall id", item.id);
          const response = await firebase
            .firestore()
            .collection("Activities")
            .where(firebase.firestore.FieldPath.documentId(), 'in', item.activities)
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
      marginTop:17,
      // marginLeft: "4%",
      width:"100%",
      height: 200,
      flexDirection:"column",
      flex:1,
      marginBottom: 2,
      backgroundColor: "black",
      borderRadius: 20,
      borderColor: "#BDBDBD",
      borderWidth: 1.6,
    },
    imageBox: {
      // alignSelf: "center",
      height: "60%",
      borderRadius: 20,
      // borderColor: "#BDBDBD",
    },
    image: {
      width: "100%",
      height: "140%",
      resizeMode: "stretch",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    text: {
      backgroundColor: "#fff0ff",
      height: "40%",
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    description: {
      fontSize: 19,
      textAlign: "left",
      marginTop: 1,
      marginLeft: 10,
      fontWeight: "bold",
    },
    subDescription: {
      fontSize: 14,
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
  
  
  