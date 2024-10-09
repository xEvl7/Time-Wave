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
    Alert  } 
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
  
  const MemberSeeAll = ({
    navigation,
    route,
  }: NativeStackScreenProps<RootStackParamList, "MemberSeeAll">) => {
    // const name = useAppSelector(selectUserName);
    const {item, member}    = route.params;                 //member?(admin):(volunteer);
    console.log("member seeall item:", item);
    console.log("member state: ", member);
    const [selectedMember, setSelectedMember] = useState<FirebaseFirestoreTypes.DocumentData[]>([]);
    const [selectMode, setSelectMode] = useState(false);    //1=selecting,0=normal
    const [isAdmin, setIsAdmin] = useState(false);
    const userId = useAppSelector((state) => state.user.data?.uid) || {};
    //isadmin, can delete, add from volunteer
    //for volunteer, no button?

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
    
    

    const handleSelect = () => {
      setSelectMode(true);
      console.log("selecting ! ");
    };

    
    const handleSelectMember = (uid) =>{
      // member?(admins: firebase.firestore.FieldValue.arrayRemove(selectedMember),):(volunteer: firebase.firestore.FieldValue.arrayRemove(selectedMember),)
      if(selectedMember.includes(uid)){
        setSelectedMember(selectedMember.filter(memberId =>memberId !== uid));
      }
      else{
        setSelectedMember([...selectedMember, uid]);
      }

    };

    //remove admin from firebase
    const handleRemoveAdmin =() =>{
      //update or add people from volunteer
      Alert.alert('Caution',`You are going to remove ${selectedMember} `,
        [{ 
          text: 'Remove', onPress: () =>{
            console.log('Yes Pressed,docId,item : ',selectedMember);
          
          const removeAdmin = async () => {
            try {         
              firebase.firestore().collection("Communities").doc(item.id).update({
                admins: firebase.firestore.FieldValue.arrayRemove(selectedMember),                
              });
            } catch (error) {
                console.error("Error removing admin", error);
            }
          };
          const removeVolunteer = async () => {
            try {         
              firebase.firestore().collection("Communities").doc(item.id).update({
                volunteer: firebase.firestore.FieldValue.arrayRemove(selectedMember),                
              });
            } catch (error) {
                console.error("Error removing volunteer", error);
            }
          };
          removeAdmin();
          member?(removeAdmin()):(removeVolunteer());
          // removeAdmin();
          }
        },
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'),style:'cancel', },
      ],
        { cancelable: true }
      );
    };

    //add admin from volunteer list
    const handleSelectAdmin =() =>{
      //take from volunteer list
      navigation.navigate("AddAdmin",{item,member});
    };

    //cancel selecting
    const handleCancelSelect =() =>{
      setSelectMode(false);
      console.log(" select mode ends");
    };
 
    return (
      <>
      <ContentContainer>
        { selectMode?
          ( <Pressable onPress={handleCancelSelect}>
              <Text> Cancel </Text>
            </Pressable>         
          ):( 
            <Pressable onPress={handleSelect}>
              {member?(<Text>Select Admins</Text>):(<Text>Select Volunteers</Text>)}
            </Pressable>
            
          )}
        <View style={styles.listContainer}>
          <ScrollView>
            <MemberListSection
              title={''}
              navigation={navigation}  
              item={item}
              member={member}
              isAdmin={isAdmin}
              selectMode={selectMode}
              selectedMember={selectedMember}
              handleSelect={handleSelect}
              handleSelectMember={handleSelectMember}
            />
          </ScrollView>
        </View>
        <View>
                {isAdmin?(
                  member?(
                    selectMode?(
                        <TextButton onPress={handleRemoveAdmin}>    Remove Admin(s)     </TextButton>
                    ):(
                        <TextButton onPress={handleSelectAdmin}>    Add Admin(s)     </TextButton>
                    )  
                  ):(
                    <TextButton onPress={handleRemoveAdmin}>    Approve Requests     </TextButton>
                  )                     
                ):(
                    <></>
                )}
            </View>  
        </ContentContainer>
      </>
    );
  };
  
  type ListSectionProps = {
    title: string;
    navigation: NavigationProp<RootStackParamList>;
    item:any,
    member:any,
    isAdmin:any,
    selectedMember:any,
    selectMode:any,
    handleSelect:any,
    handleSelectMember:any,
  };
  
  type MemberType = {
    name: string;
    description: string;
    logo: string;
    uid:string;
  };

  
  // Display communities item that fetch from firebase
  const renderMemberItem = ({
    item, 
    navigation,
    isAdmin,
    selectMode,
    selectedMember,
    handleSelect,    
    handleSelectMember,
    // member,
  }: {
    isAdmin:any,
    selectMode:any,
    selectedMember:any,
    item: MemberType;
    navigation: any;
    handleSelect:any,
    handleSelectMember:any,
  }) => (
  <>
    {isAdmin?(
        selectMode?(
          <Pressable  
            onPress={handleSelectMember(item.uid)}
            style={[
              styles.gridItem,
              selectedMember === item.uid && styles.selectedGrid,
            ]}
            // onLongPress={handleSelect}
          >
            {/* <View style={styles.gridItem}> */}
              <View style={styles.imageBox}>
                <Image
                  source={{
                    uri: item.logo,
                  }}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>
              {/* </View> */}
              <View style={styles.text}>
                <Text style={styles.description}>{item.name}</Text>
                <Text style={styles.subDescription}>{item.description}</Text>
                <Text style={styles.date}></Text>
              </View>
            {/* </View> */}
          </Pressable>
        ):(
          <Pressable  
            onPress={() => navigation.navigate("ProfileInfo", { item })}
            onLongPress={handleSelect}
          >
            <View style={styles.gridItem}>
              <View style={styles.imageBox}>
                <Image
                  source={{
                    uri: item.logo,
                  }}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>
              {/* </View> */}
              <View style={styles.text}>
                <Text style={styles.description}>{item.name}</Text>
                <Text style={styles.subDescription}>{item.description}</Text>
                <Text style={styles.date}></Text>
              </View>
            </View>
        </Pressable>
        )     
      ):(
          <Text> Not Admin </Text>
      )
    }
    <Pressable  
      onPress={() => navigation.navigate("ProfileInfo", { item })}
      onLongPress={handleSelect}
    >
      <View style={styles.gridItem}>
        <View style={styles.imageBox}>
          <Image
            source={{
              uri: item.logo,
            }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        {/* </View> */}
        <View style={styles.text}>
          <Text style={styles.description}>{item.name}</Text>
          <Text style={styles.subDescription}>{item.description}</Text>
          <Text style={styles.date}></Text>
        </View>
      </View>
    </Pressable>
    </>
  );
  
  const MemberListSection = ({ title, navigation, item, member, selectedMember, isAdmin, selectMode, handleSelectMember ,handleSelect }: ListSectionProps) => {
    const [memberData, setMemberData] = useState<
      FirebaseFirestoreTypes.DocumentData[]
    >([]);

    const memberType = member?(item.admins):(item.volunteer);
    console.log("member type is ?", memberType);
    // setMemberData(member);
  
    useEffect(() => {
      // get communities data from firebase (query part - can be declared what data to show)
      const fetchMemberData = async () => {
        try {
          console.log("seeall id", item.id);
          const response = await firebase
          .firestore()
          .collection("Users")
          .where('uid', 'in', memberType)
          .get();

          const fetchedMemberData = response.docs.map((doc) => doc.data());
          setMemberData(fetchedMemberData);
        } catch (error) {
          console.error("Error fetching communities member data :", error);
        }
      };
  
      fetchMemberData();
    }, []);

    console.log("member Data: ", memberData)
  
    return (
      <View>
        <FlatList
          data={memberData} // data from firebase
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => renderMemberItem({ item, navigation, isAdmin, selectMode, selectedMember, handleSelectMember, handleSelect})}
          contentContainerStyle={{ padding:10 }}
          ListEmptyComponent={() => (
            <Text
              style={{
                color: "red",
                textAlign: "center",
                marginBottom: 20,
                marginLeft: 20,
                fontSize: 30,
              }}
            >
              No data available
            </Text>
          )}
        />
      </View>
    );
  };
  
  export default MemberSeeAll;
  
  const styles = StyleSheet.create({
    communityNameContainer: {
      justifyContent: "center",
      alignItems: "center",
    },
  
    listContainer: {
      flex: 1,
      backgroundColor: "white",
      height:"100%",
    },
    listHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 10,
      marginLeft: 5,
    },  
    gridItem: {
      flexDirection:"row",
      alignItems:'center',
      padding:15,
      elevation:2,
      backgroundColor: "#fff",
      borderRadius: 10,
      marginBottom: 15,
      shadowColor:"#000",
      shadowOffset:{width:0, height:1},
      shadowOpacity:0.2,
      shadowRadius:1.41,
      minHeight:130,
    },
    selectedGrid:{
      backgroundColor:"#FF7A00",
    },
    imageBox: {
      flex:1,
      height:76,
      width:76,
      justifyContent:"center",
      alignItems:"center",
      borderRadius: 100,
      // color: "#BDBDBD",
    },
    image: {
      height:"140%",
      width:"80%",
      borderRadius:120,
      borderColor:"#757575",      
    },
    text: {
      flex:1.2,
      marginLeft: 10,
    },
    description: {
      fontSize: 16,
      fontWeight: "bold",
    },
    subDescription: {
      fontSize: 14,
      color:"#555555",
    },
    point: {
      fontWeight: "bold",
      fontSize: 15,
      textAlign: "left",
      marginLeft: 10,
      color: "#FF8D13",
    },
    date: {
      fontSize: 14,
      color:"#FF8D13",
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
  
  
  