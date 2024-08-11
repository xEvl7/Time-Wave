import { 
  StyleSheet, 
  View ,
  Text,
  Image,
  FlatList,
  Pressable,
  ImageSourcePropType,
  GestureResponderEvent,
  ScrollView } 
from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import React, { useEffect, useState } from "react";
import ContentContainer from "../components/ContentContainer";
import ProfilePicture from "../components/ProfilePicture";
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
import HeaderText from "../components/text_components/HeaderText";
import TextButton from "../components/TextButton";

const CommunityProfile = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList,"CommunityProfile">) => {
  //const community = useAppSelector(selectCommunity);
  //const route = useRoute();
  const {item} = route.params;
  const docId = item.id;

  const handlePressJoin = () => {

    //navigation.navigate("HomePage");

    };

  return(
      <>
      <View>
          <ScrollView>
              <View style={styles.pictureContainer}>
                  <Image       
                      source={{
                          uri: item.logo,
                      }}
                  style={styles.iconImage}/>   
                  {/* <Text style ={styles.descriptionText}>a cover photo</Text>              */}
              </View>
              <ContentContainer>
                  <View style={styles.Header}>
                      <PrimaryText>{item.name}</PrimaryText>
                  </View>

                  <View style={styles.contentContainer}>
                      <Text style={styles.subHeadertext}>About Our Community</Text>
                      <ScrollView>
                          {/* <ParagraphText>{route.params.description} </ParagraphText> */}
                          <Text style={styles.descriptionText}> {item.description} </Text>
                      </ScrollView>
                  </View>
                  
                  <Text style={styles.subHeadertext} >Admins</Text>
                  <View style={styles.listContainer}>                        
                      {/* <ScrollView> */}
                        <AdminListSection navigation={navigation} item={item}/>
                      {/* </ScrollView> */}
                  </View>
                  
                  <Text style={styles.subHeadertext}>Volunteer Log History</Text>
                  <View style={styles.listContainer}>
                      
                  </View>

                  {/* activities */}
                  {/* <View style={styles.listContainer}> */}
                  <View>
                      {/* <ScrollView> */}
                      <OngoingListSection
                          title={"Ongoing Activities"}
                          navigation={navigation}
                          item={item}
                      />
                      <PastListSection 
                        title={"Past Activities"} 
                        navigation={navigation} 
                        item={item}
                      />
                      {/* </ScrollView> */}
                  </View>
              </ContentContainer>                          
          
            {/* <CommunitiesProfile/> */}
          </ScrollView>
      </View> 
          

      <View style={{
        //flex: 1,
        marginHorizontal: 25,
        marginVertical: 15,
      }}><TextButton onPress={handlePressJoin}>Join this community</TextButton></View>
      </>
  );
};

type NavigationItemProps = {
  itemSource: ImageSourcePropType;
  text: string;
  onPress: (event: GestureResponderEvent) => void;
  isActive: boolean;
};

const NavigationItem = ({
  itemSource,
  text,
  onPress,
  isActive,
}: NavigationItemProps) => {
  return (
    <Pressable
      style={{
        alignItems: "center",
        height: "65%",
      }}
      onPress={onPress}
    >
      <Image source={itemSource} style={{ aspectRatio: 1, height: "65%" }} />
      <Text style={{ fontSize: 14, color: "white", textAlign: "center" }}>
        {text}
      </Text>
    </Pressable>
  );
};

{/* const AdminListSection */}

type AdminListProps ={
navigation: NavigationProp<RootStackParamList>;
item: any;
};

type AdminType = {
name: string;
logo: string;
};

const renderAdminItems = ({
item,
navigation,
}:{
item: AdminType;
navigation: any;
}) =>(
<Pressable
  onPress={() => navigation.navigate("ActivityInfo", { item })}
>
  <View style={styles.peopleGrid}>
    <View style={styles.imageBox}>
      {/* <View style={styles.imageBox}> */}
        <Image source={{ uri: item.logo }} style={styles.profilepic} />
      {/* </View>  */}
      <Text style={styles.profileName} >{item.name}</Text>
    </View> 
  </View> 
</Pressable>
);

const AdminListSection =({navigation,item}:AdminListProps) =>{
  const [user, setUserData] = useState<
        FirebaseFirestoreTypes.DocumentData[]
    >([]);

      useEffect(() => {
       // get activities data from firebase (query part - can be declared what data to show)
       const fetchAdminData = async () => {
       try {         
            const adminUser = await  firebase
              .firestore()
              .collection("Users")
              .where('uid', 'in', item.admins)
              .get();
              
            
            const fetchedUser = adminUser.docs.map((doc) => doc.data());
            setUserData(fetchedUser);
            console.log("name ", fetchedUser);
       } catch (error) {
           console.error("Error fetching communities data:", error);
       }
       };    

       fetchAdminData();
   }, []);

  const limit = 5;
  const limitedAdminData = user.slice(0, limit);



  return (
    <View>
      <FlatList
      showsVerticalScrollIndicator={false}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={limitedAdminData} // data from firebase
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => renderAdminItems({ item, navigation })}
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





type ListSectionProps ={
  title: string;
  navigation: NavigationProp<RootStackParamList>;
  item: any;
};

type ActivityType = {
  Name: string;
  Description: string;
  logo: string;
  test: string;
  Date: firebase.firestore.Timestamp;
  startTime:firebase.firestore.Timestamp;
  endTime: firebase.firestore.Timestamp;
  TandC: string;
  contactInfo: string;
  Location: string;
};

const renderOngoingItems = ({
  item,
  navigation,
}:{
  item: ActivityType;
  navigation: any;
}) =>(
  <Pressable
  onPress={() => navigation.navigate("ActivityInfo", { item })}
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
      <Text style={styles.description}>{item.Name}</Text>
      <Text style={styles.subDescription}>{item.Description}</Text>
      <View style={styles.pointContainer}>
        <Text style={styles.point}>{item.test}</Text>
      </View>
    </View>
  </View>
</Pressable>
);

const OngoingListSection = ({ title, navigation,item }: ListSectionProps) => {
  const [activitiesData, setActivitiesData] = useState<
    FirebaseFirestoreTypes.DocumentData[]
  >([]);
  const name = item.id;
  // const na = item

  // const querySnapshot = await firebase.firestore().collection('Communities').where('fieldName', '==', 'fieldValue').get();

  useEffect(() => {
    // get activities data from firebase (query part - can be declared what data to show)
    const fetchActivitiesData = async () => {
      try {
          const communityResponds = await firebase
          .firestore()
          .collection("Communities")
          .doc(item.id)
          .collection("Coming Activities")
          .get();
          
          // const comingResponds = await communityResponds

          // .collection("Coming Activities")
          // .get();
          
          const fetchedActivitiesData = communityResponds.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // const response = communityResponds.docs.map(async communityDoc => {
        //   const activitiesQuerySnapshot = await communityDoc.ref
        //   .collection("Past Activities")
        //   .get();
        // }

        // )
        //const response = await firebase.firestore().collection("Rewards").get();
        //const fetchedActivitiesData = response.docs.map((doc) => doc.data());
        setActivitiesData(fetchedActivitiesData);
      } catch (error) {
        console.error("Error fetching communities data:", error);
      }
    };

    fetchActivitiesData();
  }, []);

  // to limit how many communities data to show in home page
  const limit = 5;
  const limitedActivitiesData = activitiesData.slice(0, limit);

  const handleSeeAllPress = () => {
    // to see all available communities
    navigation.navigate("ActivitySeeAll", { item })
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
        data={limitedActivitiesData} // data from firebase
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => renderOngoingItems({ item, navigation })}
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

const renderPastItems = ({
item,
navigation,
}:{
item: ActivityType;
navigation: any;
}) =>(
<Pressable
onPress={() => navigation.navigate("ActivityInfo", { item })}
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
    <Text style={styles.description}>{item.Name}</Text>
    <Text style={styles.subDescription}>{item.Description}</Text>
    <View style={styles.pointContainer}>
      <Text style={styles.point}>{item.test}</Text>
    </View>
  </View>
</View>
</Pressable>
);


const PastListSection = ({ title, navigation,item }: ListSectionProps) => {
  const [activitiesData, setActivitiesData] = useState<
      FirebaseFirestoreTypes.DocumentData[]
  >([]);
  //const ID = item.id;

  // const querySnapshot = await firebase.firestore().collection('Communities').where('fieldName', '==', 'fieldValue').get();
  
  useEffect(() => {
      // get activities data from firebase (query part - can be declared what data to show)
      const fetchActivitiesData = async () => {
      try {
          // const response = await firebase
          // .firestore()
          // .collection("Communities")
          // .where( 'name', '==',{ID} )
          // .get();
          //const response = await firebase.firestore().collection("Rewards").get();

          const response = await firebase
          .firestore()
          .collection("Communities")
          .doc(item.id)
          .collection("Past Activities")
          .get();
          
          //const fetchedRewardsData = response.docs.map((doc) => doc.data());
          const fetchedActivitiesData = response.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setActivitiesData(fetchedActivitiesData);
      } catch (error) {
          console.error("Error fetching communities data:", error);
      }
      };
  
      fetchActivitiesData();
  }, []);
  
  // to limit how many communities data to show in home page
  const limit = 5;
  const limitedActivitiesData = activitiesData.slice(0, limit);
  
  // see all button
  const handleSeeAllPress = () => {
      // to see all available communities
      navigation.navigate("ActivitySeeAll", { item })
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
          data={limitedActivitiesData} // data from firebase
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => renderPastItems({ item, navigation })}
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


// type people = {
//     name: string;
//     logo: string;
// };

// //type Activities = {
// //  
// //};

// //Display people from firebase
// const renderCommunitiesPeople = ({
//     item,
//     navigation,
// }:{
//     item: people;
//     navigation: any;
// }) => (   
//         <View style={styles.peopleGrid}>
//             <Image
//             source={{
//                 uri: item.logo,
//             }}
//             style = {styles.icon}
//             />
//             <Text style={styles.names}>{item.name}</Text>
//         </View>
// );

// const CommunitiesProfile = ({ title, navigation }: ListSectionProps) =>{
//     const [communitiesData, setCommunitiesData] = useState<
//         FirebaseFirestoreTypes.DocumentData[]
//     >([]);

//     useEffect(() => {
//         const fetchCommunitiesData = async () => {
//             try{
//                 const response = await firebase
//                     .firestore()
//                     .collection("Communities")
//                     .get();
//                 const fetchedCommunitiesData = response.docs.map((doc) => doc.data());
//                 setCommunitiesData(fetchedCommunitiesData);
//             } catch (error) {
//                 console.error("Error fetching communities data:", error);
//             }
//         };

//         fetchCommunitiesData();
//     },[]);

//     // const limit = 3;
//     // const limitedPeopleData = communitiesData.slice(0,limit);
 
//     return(
//         <View>
//             <FlatList
//             data={communitiesData}
//             keyExtractor={(item)}
//         </View>
//     )

// };

export default CommunityProfile;


const styles = StyleSheet.create({
  pictureContainer:{
      //height: "30%",
      minHeight: 200,
      flexDirection: "row",
      flex:4,
      backgroundColor:"light-grey",
      
  },
  Header:{
      fontSize: 20,
      fontWeight:"bold",
  },
  contentContainer:{
      borderColor:"#BDBDBD",
      borderRadius:10,
      height: 200,
      borderWidth:1,      
      marginTop:7,
      flex:3,
  },
  subHeadertext:{
      fontSize: 18,
      fontWeight: "bold",
      marginLeft:10,
      marginTop: 16,
      marginBottom:4,
  },
  descriptionText:{
      color:"#7f8199",
      fontSize: 15,
      marginLeft:10,
      marginTop: 6,
  },
  listContainer: {
      flex: 1,
      //backgroundColor: "white",
      borderColor:"#BDBDBD",
      borderRadius:10,
      height: 110,
      borderWidth:1,      
      //marginTop:7,
  },
  listHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 10,
      marginLeft: 5,
  },

  viewButton: {
      marginTop: "auto",
      width: "30%",
      minHeight: 25,
      backgroundColor: "#E3EAE7",
  },
  viewButtonText: {
      fontSize: 15,
      color: "black",
  },
  sectionItem: {
      backgroundColor: "#ED8356",
      marginHorizontal: 10,
      width: 200,
      height: 100,
      padding: "5%",
      borderRadius: 10,
  },
  peopleGrid:{
      // height: "80%",
      // marginBottom: 10,
      borderRadius: 20,
      borderColor: "#BDBDBD",
      // width:"100%",
  },
  icon:{
      borderRadius:50,
      width:30,
      height:30,
  },
  names:{
      fontSize: 16,
      textAlign: "justify",
      marginTop:1,
  },
  people:{
      marginLeft:6,
      marginTop:3,
      marginBottom:3,
  },
  details: {
      marginLeft:"10%",
      width: "95&",
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
      marginLeft:2.5,
      width:115,
      // backgroundColor:"grey",
      alignItems:"center",
      // verticalAlign:"middle",
      height:96,
      // alignSelf: "center",
      // flexDirection:"row",
      // flex:1,
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
    iconImage:{
      width: "100%",
      height: "100%",
      resizeMode: "stretch",
    },
    profilepic:{
      marginTop:2.3,
      width:80,
      height:"77%",
      borderRadius:100,
    },
    profileName:{
      fontWeight:"400",
      fontSize:17,

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
    joinButton:{
      flex: 1,
      marginHorizontal: 25,
      marginVertical: 15,
  

    },

});
