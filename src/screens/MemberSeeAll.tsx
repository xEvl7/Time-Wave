import { 
    StyleSheet, 
    View ,
    Text,
    Image,
    FlatList,
    Pressable,
    ImageSourcePropType,
    GestureResponderEvent,
    ScrollView  } 
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
    const {item, member}    = route.params;
    // const {member}  = route.params; 
    console.log("member seeall item:", item);
    console.log("member state: ", member);
    const [selectedMember, setSelectedMember] = useState<FirebaseFirestoreTypes.DocumentData[]>([]);
    const [selectMode, setSelectMode] = useState(false);
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
    
    // //member?(admin):(volunteer);

    const handleSelect = () => {
      setSelectMode(true);
      console.log("selecting ! ");
    };

    const handleSelectMember = (uid) =>{
      if(selectedMember.includes(uid)){
        // setSelectedMember(selectedMember.filter(member))
      }
    };

    const handleRemoveAdmin =() =>{
      //update or add people from volunteer
    };

    const handleSelectAdmin =() =>{
      //take from volunteer list
      navigation.navigate("AddAdmin",{item,member});
    };
 
    return (
      <>
      <ContentContainer>
       <View style={styles.listContainer}>
          <ScrollView>
            <MemberListSection
              title={''}
              navigation={navigation}  
              item={item}
              member={member}
              handleSelect={handleSelect}
            />
          </ScrollView>
        </View>
        <View>
                {isAdmin?(
                    selectMode?(
                        <TextButton onPress={handleRemoveAdmin}>    Remove Admin(s)     </TextButton>
                    ):(
                        <TextButton onPress={handleSelectAdmin}>    Add Admin(s)     </TextButton>
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
    handleSelect:any,
  };
  
  type MemberType = {
    name: string;
    description: string;
    logo: string;
  };

  
  // Display communities item that fetch from firebase
  const renderMemberItem = ({
    item, 
    navigation,
    handleSelect,
    // member,
  }: {
    item: MemberType;
    navigation: any;
    handleSelect:any,
  }) => (
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
  );
  
  const MemberListSection = ({ title, navigation, item, member,handleSelect }: ListSectionProps) => {
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
          renderItem={({ item }) => renderMemberItem({ item, navigation, handleSelect })}
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
  
  
  