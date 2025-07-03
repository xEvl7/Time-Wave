import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import firestore from "@react-native-firebase/firestore";import {
    FirebaseFirestoreTypes,
    firebase,
  } from "@react-native-firebase/firestore";
  import "@react-native-firebase/firestore";
  import { CommunityProps } from "../features/communitySlice";

const RemoveVolunteer = () => {

  type Community = {
    id: string;
    name: string;
    admins: string[];
    // add other fields as needed
  };
  
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [volunteerCommunities, setVolunteerCommunities] = useState<Community[]>([]);  
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);

 const renderVolunteerItems = ({
  title,
  item,
  navigation,
  isAdmin,
  docId
}: {
  title: any;
  item: any; //UserType;
  navigation: any;
  isAdmin: any;
  docId: any;
}) => {
  const handleVolunteerProfile = () => {
    navigation.navigate("ProfileInfo", { item });
  };

  console.log("item", item);
  console.log("docId", docId);

  const volunteerToRemove = item.uid; 
  const handleRemoveVolunteer = () => {
    Alert.alert(
      "Caution",
      `You are going to remove ${item.name} `,
      [
        {
          text: "Remove",
          onPress: () => {
            console.log("Yes Pressed,docId,item : ", docId, volunteerToRemove);
            const removeVolunteer = async () => {
              try {
                firebase
                  .firestore()
                  .collection("Communities")
                  .doc(docId)
                  .update({
                    volunteers: firebase.firestore.FieldValue.arrayRemove(
                      volunteerToRemove
                    ),
                  });
              } catch (error) {
                console.error("Error removing volunteer", error);
              }
            };
            removeVolunteer();
          },
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

    return (
    <View>
      {isAdmin ? (
        <Pressable
          onPress={handleVolunteerProfile}
          onLongPress={handleRemoveVolunteer}
        >
          <View style={styles.peopleGrid}>
            <View style={styles.profileImageBox}>
              <Image source={{ uri: item.logo }} style={styles.profilepic} />
              <Text style={styles.profileName}>{item.name}</Text>
            </View>
          </View>
        </Pressable>
      ) : (
        <Pressable onPress={() => navigation.navigate("ProfileInfo", { item })}>
          <View style={styles.peopleGrid}>
            <View style={styles.profileImageBox}>
              <Image source={{ uri: item.logo }} style={styles.profilepic} />
              <Text style={styles.profileName}>{item.name}</Text>
            </View>
          </View>
        </Pressable>
      )}
    </View>
  ); 
};

const VolunteerListSection = ({
  title,
  navigation,
  item,
  isAdmin,
  docId,
}: UserListProps) => {
  const [userData, setUserData] = useState<
    FirebaseFirestoreTypes.DocumentData[]
  >([]);

  useEffect(() => {
    const fetchVolunteerData = async () => {
      try {
        const volunteerUser = await firebase
          .firestore()
          .collection("Users")
          .where("uid", "in", item.volunteers)
          .get();

        const fetchedUser = volunteerUser.docs.map((doc) => doc.data());
        setUserData(fetchedUser);
        console.log("name ", fetchedUser);
      } catch (error) {
        console.error("Error fetching communities data:", error);
      }
    };

    fetchVolunteerData();
  }, []);

  const limit = 5;
  const limitedVolunteerData = userData.slice(0, limit);
  
  const member = 0; //volunteer

  const handleSeeAllPress = () => {
    navigation.navigate("MemberSeeAll", { item, member });
    console.log("transfer see all ", item);
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
        showsVerticalScrollIndicator={false}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={limitedVolunteerData} // data from firebase
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) =>
          renderVolunteerItems({ title, item, navigation, isAdmin, docId })
        }
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

    const fetchedVolunteers = response.docs.map((doc) => {
      const volunteer = doc.data();
      return {
        id: doc.id,  // This is Firestore's document ID
        name: volunteer.name,  // Ensure you're fetching the correct fields
        email: volunteer.email,
        status: volunteer.status,
      };
    });

    fetchVolunteers();
  } else {
    // Clear the list if no community is selected
    setVolunteers([]);
  }
}, [selectedCommunity]);




  
  

  // Remove a volunteer and add them to the "volunteer" section
  const RemoveVolunteer = async (volunteer) => {
    try {
      setLoading(true);

      // Add volunteer to the "volunteer" section of the community
      await firebase
        .firestore()
        .collection("Communities")
        .doc(selectedCommunity.id)
        .collection("volunteers")
        .doc(volunteer.id)
        .set(volunteer);

      // Remove volunteer from the "RemoveVolunteer" section
      await firebase
        .firestore()
        .collection("Communities")
        .doc(selectedCommunity.id)
        .collection("volunteerRequest")
        .doc(volunteer.id)
        .delete();

      // Update local state
      setVolunteers((prevState) =>
        prevState.filter((v) => v.id !== volunteer.id)
      );

      Alert.alert("Success", `${volunteer.name} has been Removed!`);
      setLoading(false);
    } catch (error) {
      console.error("Error approving volunteer:", error);
      Alert.alert("Error", "Failed to Remove volunteer.");
      setLoading(false);
    }
  };

  return (
    <>
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#3498db" />}

      {/* Community Selection */}
      {!selectedCommunity ? (
        <FlatList
          data={communities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.communityItem}
              onPress={() => setSelectedCommunity(item)}
            >
              <Text style={styles.communityName}>{item.name}</Text>
            </Pressable>
          )}
          ListEmptyComponent={() => (
            <Text style={styles.emptyMessage}>No communities available</Text>
          )}
        />
      ) : (
        <>
          {/* Volunteer Approval Section */}
          <Text style={styles.header}>
            Volunteers for {selectedCommunity.name}
          </Text>
          <FlatList
            data={volunteers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.volunteerItem}>
                <Text style={styles.volunteerName}>{item.name}</Text>
                <Pressable
                  style={styles.RemoveButton}
                  onPress={() => RemoveVolunteer(item)}
                >
                  <Text style={styles.buttonText}>Remove</Text>
                </Pressable>
              </View>
            )}
            ListEmptyComponent={() => (
              <Text style={styles.emptyMessage}>No volunteers available</Text>
            )}
          />
          {/* Back Button */}
          <Pressable
            style={styles.backButton}
            onPress={() => setSelectedCommunity(null)}
          >
            <Text style={styles.buttonText}>Back to Communities</Text>
          </Pressable>
        </>
      )}
    </View>
    </>
  );
};

export default RemoveVolunteer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  communityItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#3498db",
    borderRadius: 5,
    alignItems: "center",
  },
  communityName: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  volunteerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  volunteerName: {
    fontSize: 16,
    color: "#333",
  },
  RemoveButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 20,
  },
  emptyMessage: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
    fontSize: 16,
  },
});
