import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  LayoutAnimation,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import { MaterialIcons } from "@expo/vector-icons"; // Assuming you're using Expo, if not, use 'react-native-vector-icons/MaterialIcons'
import RightDrop from "../components/RightDrop"; // Assuming you have this component
import firestore from "@react-native-firebase/firestore";
import {
  FirebaseFirestoreTypes,
  firebase,
} from "@react-native-firebase/firestore";
import "@react-native-firebase/firestore";
// import "firebase/compat/firestore";
// import "firebase/compat/auth";
import { useAppSelector, useAppDispatch } from "../hooks";

const AdminControl = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "AdminControl">) => {
  const [list] = useState([
    { id: 1, name: "Your Community" },
    { id: 2, name: "Approve Volunteer" },
    { id: 3, name: "Remove Volunteer" },
  ]);

  const userId = useAppSelector((state) => state.user.data?.uid) || "";

  const [expanded, setExpanded] = useState(false);
  // const [communityData, setCommunityData] = useState<any>(null);
  // const [communityRefId, setCommunityRefId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [communityList, setCommunityList] = useState<any[]>([]);

useEffect(() => {
  const fetchAdminCommunities = async () => {
    try {
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) throw new Error("User not logged in");

      // Get user document
      const querySnapshot = await firebase
        .firestore()
        .collection("Users")
        .where("uid", "==", userId)
        .limit(1)
        .get();

        if (querySnapshot.empty) {
          console.log("No user found with that UID.");
          return null;
        }

      const userDoc = querySnapshot.docs[0];

        console.log("AdminControl : userDoc", userDoc.data());

        const adminOf: string[] = userDoc.data()?.adminOf || [];

        const communityDocs = await Promise.all(
          adminOf.map((id) =>
            firebase.firestore().collection("Communities").doc(id).get()
          )
        );

        console.log("AdminControl : communityDocs", communityDocs);

        const communityData = communityDocs
          .filter((doc) => doc.exists)
          .map((doc) => ({ id: doc.id, ...doc.data() }));

        setCommunityList(communityData);
        console.log("AdminControl : communityList", communityList);
      } catch (err) {
        console.error("Error loading communities", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminCommunities();
  }, []);

  console.log("AdminControl : communityList", communityList);
  console.log("AdminControl : communityData", communityData);

    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="orange" />
        </View>
      );
    }

  console.log("CommunityInfo : communityData", communityData);

  const navigationItems = [
    {
      title: "Your Community",
      onNavigate: () => navigation.navigate("CommunityInfo", communityData), //, id: communityRefId }),
      
    },
    {
      title: "Approve Volunteer",
      onNavigate: () => navigation.navigate("ApproveVolunteer", { ...communityData}), // id: communityRef }),
    },
    {
      title: "Remove Volunteer",
      onNavigate: () => navigation.navigate("RemoveVolunteer", { ...communityData}), //, id: communityRef }), // communityRef.id 
    },
  ];

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.navigate("QrCodePage")}
      >
        <MaterialIcons name="qr-code" size={40} color="orange" />
      </TouchableOpacity>
{/* 
      <FlatList
        data={navigationItems}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <RightDrop
            onNavigate={item.onNavigate}
            title={item.title}
            children={item.subtitle}
            subItems={item.subItems}
          />
        )}
        contentContainerStyle={styles.flatListContainer}
      /> */}
     
     {expanded &&
        communityList.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.subRow}
            onPress={() => navigation.navigate("CommunityInfo",  item )}
          >
            <Text style={styles.subTitle}>{item.name}</Text>
            <MaterialIcons name="chevron-right" size={24} color="orange" />
          </TouchableOpacity>
        ))} 

      {/* --- Other Admin Actions --- */}
      <TouchableOpacity
        style={styles.row}
        onPress={() => navigation.navigate("ApproveVolunteer", )}
      >
        <Text style={styles.title}>Approve volunteer</Text>
        <MaterialIcons name="chevron-right" size={24} color="orange" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.row}
        onPress={() => navigation.navigate("RemoveVolunteer")}
      >
        <Text style={styles.title}>Remove volunteer</Text>
        <MaterialIcons name="chevron-right" size={24} color="orange" />
      </TouchableOpacity>
    </View>
  );
};

export default AdminControl;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    paddingHorizontal: 20,
  },
  iconButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10, // Ensures the button is on top
    elevation: 10, // For Android to ensure the button is on top
  },
    row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  subRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  subTitle: {
    fontSize: 15,
    color: "#333",
  },
});
