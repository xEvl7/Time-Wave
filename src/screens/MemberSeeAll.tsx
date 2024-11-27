import { 
  StyleSheet, 
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  ScrollView,
  Alert  
} from "react-native";
import { Button, Checkbox } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";  
import React, { useEffect, useState } from "react";

import ContentContainer from "../components/ContentContainer";
// import ParagraphText from "../components/text_components/ParagraphText";
import { RootStackParamList } from "../Screen.types";
import {
  FirebaseFirestoreTypes,
  firebase,
} from "@react-native-firebase/firestore";
import { RouteProp, useRoute } from "@react-navigation/native";
// import PrimaryText from "../components/text_components/PrimaryText";
import { useAppSelector } from "../hooks";
import { selectUserName } from "../features/userSlice";
import { NavigationProp } from "@react-navigation/native";
import ButtonText from "../components/text_components/ButtonText";
import TextButton from "../components/TextButton";

const MemberSeeAll = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "MemberSeeAll">) => {
  const { item, member } = route.params; // member?(admin):(volunteer);
  console.log("member seeall item:", item);
  console.log("member state: ", member);
  
  const [selectedMember, setSelectedMember] = useState<FirebaseFirestoreTypes.DocumentData[]>([]);
  const [selectMode, setSelectMode] = useState(false); // 1=selecting, 0=normal
  const [isAdmin, setIsAdmin] = useState(false);
  const userId = useAppSelector((state) => state.user.data?.uid) || "";

  // Check for user role
  useEffect(() => {
    console.log("checking is admin?");
    try {
      console.log(item.admins);
      if (item.admins.includes(userId)) {
        setIsAdmin(true);
        console.log("you are admin!");
      }
    } catch (error) {console.error('Error checking admin status: ', error);} 
  }, [item.admins, userId]);

  const handleSelect = () => {
    console.log("selecting!");
    setSelectMode(true); 
  };

  const handleSelectMember = (uid: any) => {
    if (selectedMember.includes(uid)) {
      setSelectedMember(selectedMember.filter(memberId => memberId !== uid));
    } else {
      setSelectedMember([...selectedMember, uid]);
    }
    console.log("selected member", selectedMember);
  };

  const handleNewMember = () => {
    const selectedAdmins = selectedMember.filter((admin) => admin.selected);
    navigation.navigate("CreateCommunity", { selectedAdmins });
  };

  // Remove admin from Firebase
  const handleRemoveAdmin = () => {
    Alert.alert(
      'Caution',
      `You are going to remove ${selectedMember.join(", ")}`,
      [ 
        { 
          text: 'Remove', 
          onPress: () => {
            console.log('Yes Pressed, docId, item:', selectedMember);
            
            const removeAdmin = async () => {
              try {         
                await firebase.firestore().collection("Communities").doc(item.id).update({
                  admins: firebase.firestore.FieldValue.arrayRemove(...selectedMember),                
                });
              } catch (error) {
                console.error("Error removing admin", error);
              }
            };

            const removeVolunteer = async () => {
              try {         
                await firebase.firestore().collection("Communities").doc(item.id).update({
                  volunteer: firebase.firestore.FieldValue.arrayRemove(...selectedMember),                
                });
              } catch (error) {
                console.error("Error removing volunteer", error);
              }
            };
            member ? removeAdmin() : removeVolunteer();
          }
        },
        { 
          text: 'Cancel', 
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  // Add admin from volunteer list
  const handleSelectAdmin = () => {
    navigation.navigate("AddAdmin", { item, member });
  };

  // Cancel selecting
  const handleCancelSelect = () => {
    setSelectMode(false);
    console.log("select mode ends");
  };

  return (
    <ContentContainer>
      {selectMode ? (
        <Pressable onPress={handleCancelSelect}>
          <Text>Cancel</Text>
        </Pressable>
      ) : ( 
        <Pressable onPress={handleSelect}>
          {member ? <Text>Select Admins</Text> : <Text>Select Volunteers</Text>}
        </Pressable>
      )}
      <View style={styles.listContainer}>
        <ScrollView>
          <MemberListSection
            title=""
            navigation={navigation}  
            item={item}
            member={member}
            isAdmin={isAdmin}
            selectMode={selectMode}
            selectedMember={selectedMember}
            handleSelect={handleSelect}
            handleSelectMember={handleSelectMember}
            handleNewMember={handleNewMember}
          />
        </ScrollView>
      </View>
      <View>
        {isAdmin && (
          member ? (
            selectMode ? (
              <TextButton onPress={handleRemoveAdmin}>Remove Admin(s)</TextButton>
            ) : (
              <TextButton onPress={handleSelectAdmin}>Add Admin(s)</TextButton>
            )
          ) : (
            <TextButton onPress={handleNewAdmin}>Add New Admins</TextButton>
          )
        )}
      </View>  
    </ContentContainer>
  );
};

type ListSectionProps = {
  title: string;
  navigation: NavigationProp<RootStackParamList>;
  item: any;
  member: any;
  isAdmin: boolean;
  selectedMember: string[];
  selectMode: boolean;
  handleSelect: () => void;
  handleSelectMember: (uid: string) => void;
  handleNewMember:() => void;
};

type MemberType = {
  name: string;
  description: string;
  logo: string;
  uid: string;
};

// Display communities item that fetch from Firebase
const renderMemberItem = ({
  item, 
  navigation,
  isAdmin,
  selectMode,
  selectedMember,
  handleSelectMember,
  handleNewMember,
  handleSelect,    
}: {
  isAdmin: boolean;
  selectMode: boolean;
  selectedMember: string[];
  item: MemberType;
  navigation: NavigationProp<RootStackParamList>;
  handleSelect: () => void;
  handleSelectMember: (uid: string) => void;
  handleNewMember: () => void;
}) => (
  <>
    {isAdmin ? (
      selectMode ? (
        <> 
        <View >
        <Pressable  
          onPress={() => handleSelectMember(item.uid)} // Corrected
          style={[
            styles.gridItem,
            selectedMember.includes(item.uid) && styles.selectedGrid, // Corrected
          ]}
        >
          <View style={styles.imageBox}>
            <Image
              source={{ uri: item.logo }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
          <View style={styles.text}>
            <Text style={styles.description}>{item.name}</Text>
            <Text style={styles.subDescription}>{item.description}</Text>
            <Text style={styles.date}></Text>
          </View>
          <View style={styles.checkbox}>
            <Checkbox
            status={item.selected ? "checked" : "unchecked"}
            onPress={() => handleSelectMember(item.uid)}
          />
          </View>          
        </Pressable>
          
          </View>
        </>
      ) : (
        <Pressable  
          onPress={() => navigation.navigate("ProfileInfo", { item })}
          onLongPress={handleSelect}
        >
          <View style={styles.gridItem}>
            <View style={styles.imageBox}>
              <Image
                source={{ uri: item.logo }}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
            <View style={styles.text}>
              <Text style={styles.description}>{item.name}</Text>
              <Text style={styles.subDescription}>{item.description}</Text>
              <Text style={styles.date}></Text>
            </View>
          </View>
          <View style={styles.checkbox}></View>
        </Pressable>
      )
    ) : (
      <Text>Not Admin</Text>
    )}
  </>
);

const MemberListSection = ({ 
  title, 
  navigation, 
  item, 
  member, 
  selectedMember, 
  isAdmin, 
  selectMode, 
  handleSelectMember, 
  handleNewMember,
  handleSelect 
}: ListSectionProps) => {
  const [memberData, setMemberData] = useState<FirebaseFirestoreTypes.DocumentData[]>([]);

  const memberType = member ? item.admins : item.volunteer;
  console.log("member type is?", memberType);
  
  // Fetch members data from Firebase
  useEffect(() => {    
    const fetchMemberData = async () => {
      try {
        console.log("seeall id", item.id);
        const response = await firebase
          .firestore()
          .collection("Users")
          .where('uid', 'in', memberType)
          .get();

        const fetchedMemberData = response.docs.map((doc) => doc.data());
        // .filter((admin) => admin.uid !== ownUserId); // Filter out current user;
        setMemberData(fetchedMemberData);
      } catch (error) {
        console.error("Error fetching communities member data:", error);
      }
    };

    if (memberType.length > 0) { // Ensure the array is not empty
      fetchMemberData();
    } else {
      setMemberData([]);
    }
  }, [item.id, memberType]);

  console.log("member Data:", memberData);

  return (
    <View>
      <FlatList
        data={memberData} // Data from Firebase
        keyExtractor={(item, index) => item.uid || index.toString()} // Prefer unique keys
        renderItem={({ item }) => renderMemberItem({ 
          item, 
          navigation, 
          isAdmin, 
          selectMode, 
          selectedMember, 
          handleSelectMember, 
          handleSelect 
        })}
        contentContainerStyle={{ padding: 10 }}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>
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
    flex: 4,
    backgroundColor: "white",
    height: "100%",
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
    alignItems: 'center',
    padding: 10,
    elevation: 2,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    minHeight: 25,
  },
  selectedGrid: {
    backgroundColor: "#FF7A00",
  },
  imageBox: {
    flex: 0.8,
    height: 46,
    width: 46,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
  image: {
    height: "140%",
    width: "80%",
    borderRadius: 120,
    borderColor: "#757575",      
  },
  text: {
    flex: 2,
    marginLeft: 10,
  },
  description: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subDescription: {
    fontSize: 14,
    color: "#555555",
  },
  date: {
    fontSize: 14,
    color: "#FF8D13",
  },
  pointContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  scrollViewContent: {
    paddingBottom: 16,
  },
  emptyText: { // Added for better styling
    color: "red",
    textAlign: "center",
    marginBottom: 20,
    marginLeft: 20,
    fontSize: 18, // Reduced font size for better UI
  },
  checkbox:{
    flex:0.5,
  }
});
