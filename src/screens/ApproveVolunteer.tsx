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

const ApproveVolunteer = () => {
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch communities from Firestore
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoading(true);
        const response = await firebase.firestore().collection("Communities").get();
        const fetchedCommunities = response.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCommunities(fetchedCommunities);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching communities:", error);
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  // Fetch volunteers for the selected community
  useEffect(() => {
    if (selectedCommunity) {
      const fetchVolunteers = async () => {
        try {
          setLoading(true);
          const response = await firebase
            .firestore()
            .collection("Communities")
            .doc(selectedCommunity.id)
            .collection("volunteerRequest")
            .get();

          const fetchedVolunteers = response.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setVolunteers(fetchedVolunteers);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching volunteers:", error);
          setLoading(false);
        }
      };

      fetchVolunteers();
    }
  }, [selectedCommunity]);

  // Approve a volunteer and add them to the "volunteer" section
  const approveVolunteer = async (volunteer) => {
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

      // Remove volunteer from the "approveVolunteer" section
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

      Alert.alert("Success", `${volunteer.name} has been approved!`);
      setLoading(false);
    } catch (error) {
      console.error("Error approving volunteer:", error);
      Alert.alert("Error", "Failed to approve volunteer.");
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
                  style={styles.approveButton}
                  onPress={() => approveVolunteer(item)}
                >
                  <Text style={styles.buttonText}>Approve</Text>
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

export default ApproveVolunteer;

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
  approveButton: {
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
