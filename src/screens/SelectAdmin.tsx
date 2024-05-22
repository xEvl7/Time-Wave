import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import React, { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import { Button, Checkbox } from "react-native-paper";
import TextButton from "../components/TextButton";
import PrimaryText from "../components/text_components/PrimaryText";
import SecondaryText from "../components/text_components/SecondaryText";

const SelectAdmin = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "SelectAdmin">) => {

  // test data
  const [admins, setAdmins] = useState([
    { id: 1, name: "User 1", selected: false, avatar: require("../assets/profile-picture.png") },
    { id: 2, name: "User 2", selected: false, avatar: require("../assets/profile-picture.png") },
    { id: 3, name: "User 3", selected: false, avatar: require("../assets/profile-picture.png") },
  ]);

  const handleAdminSelection = (adminId: number) => {
    const updatedAdmins = admins.map((admin) =>
      admin.id === adminId ? { ...admin, selected: !admin.selected } : admin
    );
    setAdmins(updatedAdmins);
  };

  const handleConfirmSelection = () => {
    const selectedAdmins = admins.filter((admin) => admin.selected);
    navigation.navigate("CreateCommunity", { selectedAdmins });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={admins}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.adminListItem}>
            <Image source={item.avatar} style={styles.avatar} />
            <SecondaryText>{item.name}</SecondaryText>
            <Checkbox
              status={item.selected ? "checked" : "unchecked"}
              onPress={() => handleAdminSelection(item.id)}
            />
          </View>
        )}
      />
      <TextButton onPress={handleConfirmSelection}>Confirm Selection</TextButton>
    </View>
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