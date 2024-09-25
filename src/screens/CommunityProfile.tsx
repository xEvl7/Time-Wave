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
import ProfilePicture from "../components/ProfilePicture";
import ParagraphText from "../components/text_components/ParagraphText";
import { RootStackParamList } from "../Screen.types";
import {
  FirebaseFirestoreTypes,
  firebase,
} from "@react-native-firebase/firestore";
import'@react-native-firebase/firestore';
import { RouteProp, useRoute } from "@react-navigation/native";
import PrimaryText from "../components/text_components/PrimaryText";
import { useAppSelector } from "../hooks";
import { selectUserName } from "../features/userSlice";
import { NavigationProp } from "@react-navigation/native";
import ButtonText from "../components/text_components/ButtonText";
import HeaderText from "../components/text_components/HeaderText";
import TextButton from "../components/TextButton";
import { TextInput } from "react-native-paper";
import Navigation from "../Navigation";
import { Header } from "react-native/Libraries/NewAppScreen";

const CommunityProfile = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList,"CommunityProfile">) => {
  //const community = useAppSelector(selectCommunity);
  //const route = useRoute();
  const {item} = route.params;
  const docId = item.id;
  const userId = useAppSelector((state) => state.user.data?.uid) || {};

  const [isAdmin, setIsAdmin] = useState(false);
  const [editDescription, setEditDescription] = useState(item.description);
  const [editLogo, setEditLogo ]= useState(item.logo); //logo need to crop and update?
  const [editName, setEditName ] = useState(item.name); //handle name history


  const communityRequest = firebase.firestore().collection("Communities").doc(item.id).collection("requests");
  const update =  firebase.firestore().collection("Communities").doc(item.id);

  console.log("into community profile ");
  console.log("item",item);

  //divide community's section
  //setPageContent(item);
  //const {description} = pageContent;

  //check for user role
  useEffect(() => {
      console.log("checking is admin?");
      try{
        // console.log("inside try");
        console.log(item.admins);
        if(item.admins.includes(userId)){
          setIsAdmin(true);
          console.log("you are admin!");
        }
      } catch (error){
        console.error('Error checking admin status: ',error);
      } 
  }, []);

  //update edit
  const handleEdit = () =>{
    console.log("item");
    console.log(item.id);
    console.log("update.update ok");
    update.update({
      description: editDescription,//editDescription,
      logo: editLogo,
      name: editName,
    });
    
    


    Alert.alert('',"Content Updated Successfuly",[
      { text: 'OK', onPress: () => console.log('OK Pressed') },
    ],
      { cancelable: true }
    );

  };

  // const handleAdminProfile  = () => {
  //   // to see all available communities
  //   navigation.navigate("ActivitySeeAll", { item })
  // };

  const handlePressJoin = () => {
  //   const endTimestamp = firebase.firestore.Timestamp.fromDate(new Date('2024-09-15T11:30:00'));
  //   const startTimestamp = firebase.firestore.Timestamp.fromDate(new Date('2024-09-25T09:30:00'));

  // firebase.firestore().collection("Activities").doc("WmtWxKoLbeOfwxuZbGcE").update(
  //   {
  //     description:"Morbi nec felis at magna convallis porta. Suspendisse rhoncus blandit bibendum.",
  //     location: "Pantai Timur",
  //     name: "Sed ligula odio",
  //     TandC: "In addition, you can retrieve all documents in a collection by omitting the where() filter entirely:",
  //     contactInfo:	"Official M avacap",
  //     endTime:endTimestamp,
  //     startTime:startTimestamp,
  //     logo:	"https://firebasestorage.googleapis.com/v0/b/time-wave-88653.appspot.com/o/sewing%20machine.png?alt=media&token=f42e4f7e-ed65-441a-b05b-66f743a70554",
  //   })
    Alert.alert('',"Join Request Sent Successfuly",[
      { text: 'OK', onPress: () => console.log('OK Pressed') },
    ],
    { cancelable: true }
  );

  const reqDate = new Date();

  communityRequest.add({
    uid:userId,
    date:reqDate,
  })
  .then(() => {
    console.log('User added!');
  })
  .catch(error => {
    console.error('Error adding user: ', error);
  });
  };

  const handleSeeAllPress = () => {
    // to see all available communities
    navigation.navigate("ActivitySeeAll", { item })
  };

  // const descriptionEdited = item.description;

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
                {isAdmin? ( 
                  <TextInput 
                    style={styles.editingText}
                    value={editName}
                    onChangeText={setEditName}
                    placeholder="Enter your text here... "
                    placeholderTextColor={"#3F51B5"}
                  />
                ):(
                  <PrimaryText>{item.name}</PrimaryText>
                )}
              </View>

              <View style={styles.contentContainer}>
                <Text style={styles.subHeadertext}>About Our Community</Text>
                  <ScrollView>
                      {/* <ParagraphText>{route.params.description} </ParagraphText> */}
                    {isAdmin? (
                      <TextInput 
                        style={styles.editingText}
                        value={editDescription}
                        onChangeText={setEditDescription}
                        placeholder="Enter your text here... "
                        placeholderTextColor={"#3F51B5"}
                      />
                    ):(
                      <Text style={styles.descriptionText}> {item.description} </Text>
                    )}
                  </ScrollView>
              </View>     

              <View style={styles.listHeader}>
                <Text style={styles.subHeadertext} >Admins</Text>
                {/* <Header>Admins</Header> */}
                <Pressable onPress={handleSeeAllPress}>
                  <ButtonText>See all</ButtonText>
                </Pressable>
              </View>                  
              <View style={styles.listContainer}>  
                <AdminListSection navigation={navigation} item={item} isAdmin={isAdmin} docId={docId}/>
              </View>
                  
              <View style={styles.listHeader}>
                <Text style={styles.subHeadertext}>Volunteer Log History</Text>
                <Pressable onPress={handleSeeAllPress}>
                  <ButtonText>See all</ButtonText>
                </Pressable>
              </View>
              <View style={styles.listContainer}>
                <VolunteerListSection navigation={navigation} item={item} isAdmin={isAdmin} docId={docId}/>
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
          <View style={{
              position:"absolute",
              left:"26%",
              // flex: 1,
              bottom:"3%",
              // marginHorizontal: 25,
              // marginVertical: 300,
            }}>
            { isAdmin ?(
              <TextButton onPress={handleEdit}>         Save Changes        </TextButton>
            ):(
              <TextButton onPress={handlePressJoin}>     Join this community     </TextButton>
            )}
           
          </View>
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

type UserListProps ={
navigation: NavigationProp<RootStackParamList>;
item: any;
isAdmin: any;
docId: any;
};

type UserType = {
name: string;
logo: string;
isAdmin: any;
docId: any;
uid: any;
};


const renderAdminItems = ({
item,
navigation,
isAdmin,
docId,
}:{
item: UserType;
navigation: any;
isAdmin:any;
docId: any;
}) =>{

  const handleAdminProfile  = () => {
    navigation.navigate("ProfileInfo", { item });
    // Alert.alert(`About ${item.name} `,'',[
    //   { text: 'View Profile', onPress: () =>{console.log('View Pressed');navigation.navigate("ProfileInfo", { item }) }},
    //   { text: 'Remove Admin', onPress: handleRemoveAdmin},
    //   { text: 'Cancel', onPress: () => console.log('Cancel Pressed'),style:'cancel', },
    // ],
    //   { cancelable: true }
    // );
  };

  const adminToRemove = item.uid;//item.uid;
  const handleRemoveAdmin =() =>{
    Alert.alert('Caution',`You are going to remove ${item.name} `,[
      { text: 'Remove', onPress: () =>{
        console.log('Yes Pressed,docId,item : ',docId,adminToRemove);
        const removeAdmin = async () => {
          try {         
            firebase.firestore().collection("Communities").doc(docId).update({
              admins: firebase.firestore.FieldValue.arrayRemove(adminToRemove),
            });
          } catch (error) {
              console.error("Error removing admin", error);
          }
        };
        removeAdmin();
        }
      },
      { text: 'Cancel', onPress: () => console.log('Cancel Pressed'),style:'cancel', },
    ],
      { cancelable: true }
    );
  };

  return (
    <View>
      { isAdmin ?(
                <Pressable  
                  onPress={handleAdminProfile}
                  onLongPress={handleRemoveAdmin}
                >
                <View style={styles.peopleGrid}>
                  <View style={styles.profileImageBox}>
                      <Image source={{ uri: item.logo }} style={styles.profilepic} />
                    <Text style={styles.profileName} >{item.name}</Text>
                  </View> 
                </View> 
                </Pressable>
      ):(
                <Pressable  
                  onPress={() => navigation.navigate("ProfileInfo", { item })}
                >
                <View style={styles.peopleGrid}>
                  <View style={styles.profileImageBox}>
                    {/* <View style={styles.imageBox}> */}
                      <Image source={{ uri: item.logo }} style={styles.profilepic} />
                    {/* </View>  */}
                    <Text style={styles.profileName} >{item.name}</Text>
                  </View> 
                </View> 
                </Pressable>
              )}
    </View>
  );
};



const AdminListSection =({navigation,item,isAdmin, docId}:UserListProps) =>{
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
            // console.log("name ", fetchedUser);
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
        renderItem={({ item }) => renderAdminItems({ item, navigation, isAdmin, docId })}
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

// UserListSection
const renderVolunteerItems = ({
  item,
  navigation,
  }:{
  item: UserType;
  navigation: any;
  isAdmin:any;
  }) =>(
  <Pressable
    onPress={() => navigation.navigate("ProfileInfo", { item })}
  >
    <View style={styles.peopleGrid}>
      <View style={styles.profileImageBox}>
        {/* <View style={styles.imageBox}> */}
          <Image source={{ uri: item.logo }} style={styles.profilepic} />
        {/* </View>  */}
        <Text style={styles.profileName} >{item.name}</Text>
      </View> 
    </View> 
  </Pressable>
  );
  
  const VolunteerListSection =({navigation,item,isAdmin}:UserListProps) =>{
    const [user, setUserData] = useState<
          FirebaseFirestoreTypes.DocumentData[]
      >([]);
  
        useEffect(() => {
         // get activities data from firebase (query part - can be declared what data to show)
         const fetchVolunteerData = async () => {
         try {         
              const volunteerUser = await  firebase
                .firestore()
                .collection("Users")
                .where('uid', 'in', item.volunteer)
                .get();
                
              
              const fetchedUser = volunteerUser.docs.map((doc) => doc.data());
              setUserData(fetchedUser);
              // console.log("name ", fetchedUser);
         } catch (error) {
             console.error("Error fetching communities data:", error);
         }
         };    
  
         fetchVolunteerData();
     }, []);
  
    const limit = 5;
    const limitedVolunteerData = user.slice(0, limit);
  
  
  
    return (
      <View>
        <FlatList
        showsVerticalScrollIndicator={false}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={limitedVolunteerData} // data from firebase
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => renderAdminItems({ item, navigation, isAdmin })}
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
  name: string;
  description: string;
  logo: string;
  // test: string;
  // Date: firebase.firestore.Timestamp;
  startTime:firebase.firestore.Timestamp;
  endTime: firebase.firestore.Timestamp;
  TandC: string;
  contactInfo: string;
  location: string;
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
      {/* <View style={styles.imageBox}> */}
        <Image
          source={{
            uri: item.logo,  
          }}
          style={styles.image}
        />
      {/* </View> */}
    </View>
    <View style={styles.text}>
      <Text style={styles.description}>{item.name}</Text>
      <Text style={styles.subDescription}>{item.description}</Text>
      <View style={styles.pointContainer}>
        <Text style={styles.point}>{item.location}</Text>
      </View>
    </View>
  </View>
</Pressable>
);

const OngoingListSection = ({ title, navigation,item }: ListSectionProps) => {
  const [activitiesData, setActivitiesData] = useState<
    FirebaseFirestoreTypes.DocumentData[]
  >([]);

  useEffect(() => {
    // get activities data from firebase (query part - can be declared what data to show)
    const fetchActivitiesData = async () => {
      try {
        // console.log("item id: ",item.id);
          const communityResponds = await firebase
          .firestore()
          .collection("Activities")
          .where(firebase.firestore.FieldPath.documentId(), 'in', item.activities)
          .get();
          
          const fetchedActivitiesData = communityResponds.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          // console.log(fetchedActivitiesData.startTime);
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

  const  reqDate = new Date();
  console.log("endTime",activitiesData);
  // console.log("jsDate: ",item.endTime.toDate().toLocaleString());
  useEffect(() => {
    if(item.endTime<= reqDate){
      console.log("past activity !");
    }
    else{ 
      console.log("ongoing activity!");
    }
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
  {/* <View style={styles.imageBox}> */}
    <View style={styles.imageBox}>
      <Image
        source={{
          uri: item.logo,  
        }}
        style={styles.image}
      />
    {/* </View> */}
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
        // console.log("item id in pastA",item.id);
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
  subHeader1text:{
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
  editingText:{
    backgroundColor:'#FF8D1342',
    color:"#3D5A80",
    fontSize: 15,
    borderBottomWidth:1,
    borderBottomColor:'#954126',
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
      // marginLeft: 5,
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
      alignSelf: "center",
      flexDirection:"row",
      flex:1,
      height: "60%",
      borderRadius: 20,
      borderColor: "#BDBDBD",
    },
    profileImageBox: {
      marginLeft:2.5,
      width:115,
      alignItems:"center",
      height:96,
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
