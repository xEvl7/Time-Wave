import { StyleSheet, Text, View, FlatList, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import { Button, Checkbox, ListSectionProps } from "react-native-paper";
import TextButton from "../components/TextButton";
import PrimaryText from "../components/text_components/PrimaryText";
import SecondaryText from "../components/text_components/SecondaryText";
import ContentContainer from "../components/ContentContainer";
import { FirebaseFirestoreTypes, firebase } from "@react-native-firebase/firestore";
import { useAppSelector } from "../hooks";
// import styles from "../styles";

type AdminType = {
  uid: string; // Assuming id from Firestore is a string
  name: string;
  selected: boolean;
  avatar: string;
};

const SelectAdmin = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "SelectAdmin">) => {

  const ownUserId = useAppSelector((state) => state.user.data?.uid);
  // test data
  const [admins, setAdmins] = useState<AdminType[]>([
    { uid: "1", name: "User 1", selected: false, avatar: require("../assets/profile-picture.png") },
    { uid: "2", name: "User 2", selected: false, avatar: require("../assets/profile-picture.png") },
    { uid: "3", name: "User 3", selected: false, avatar: require("../assets/profile-picture.png") },
  ]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await firebase.firestore().collection("Users").get();
        const fetchedAdmins = response.docs
          .map((doc) => {
            const data = doc.data();
            return {
              uid: data.uid,
              name: data.name,
              selected: false,
              avatar: data.avatar || require("../assets/profile-picture.png"),
            };
          })
          .filter((admin) => admin.uid !== ownUserId); // Filter out current user
        setAdmins(fetchedAdmins);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [ownUserId]);

  const handleAdminSelection = (adminUid: string) => {
    const updatedAdmins = admins.map((admin) =>
      admin.uid === adminUid ? { ...admin, selected: !admin.selected } : admin
    );
    setAdmins(updatedAdmins);
  };

  const handleConfirmSelection = () => {
    const selectedAdmins = admins.filter((admin) => admin.selected);
    navigation.navigate("CreateCommunity", { selectedAdmins });
  };

  return (
    <ContentContainer style={{}}>
      <View style={styles.container}>
        <FlatList
          data={admins}
          keyExtractor={(item) => item.uid.toString()}
          renderItem={({ item }) => (
            <View style={styles.adminListItem}>
              <Image source={item.avatar} style={styles.avatar} />
              <SecondaryText>{item.name}</SecondaryText>
              <Checkbox
                status={item.selected ? "checked" : "unchecked"}
                onPress={() => handleAdminSelection(item.uid)}
              />
            </View>
          )}
        />
        <TextButton onPress={handleConfirmSelection}>Confirm Selection</TextButton>
      </View>
    </ContentContainer>
  );
};

export default SelectAdmin;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  adminListItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 20,
    marginRight: 10,
  },
});

function fetchCommunitiesData() {
  throw new Error("Function not implemented.");
}
