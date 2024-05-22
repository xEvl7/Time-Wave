import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import React, { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import { Button, Checkbox } from "react-native-paper";
import TextButton from "../components/TextButton";

const AdminControl = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "AdminControl">) => {
  const [list, setList] = useState([
    { id: 1, name: "Your Community" },
    { id: 2, name: "Approve Volunteer" },
    { id: 3, name: "Remove Volunteer" },
  ]);

  // const handleAdminSelection = (adminId: number) => {
  //   const updatedAdmins = admins.map((admin) =>
  //     admin.id === adminId ? { ...admin, selected: !admin.selected } : admin
  //   );
  //   setAdmins(updatedAdmins);
  // };

  // const handleConfirmSelection = () => {
  //   const selectedAdmins = admins.filter((admin) => admin.selected);
  //   navigation.navigate("CreateCommunity", { selectedAdmins });
  // };

  return (
    <View style={styles.container}>
      <TextButton
        style={{ marginHorizontal: 20, marginTop: 100 }}
        onPress={() => navigation.navigate("QrCodePage")}
      >
        Show QR Code
      </TextButton>
    </View>
    
  //   <FlatList
  //   data={list}
  //   keyExtractor={(item) => item.id.toString()}
  //   renderItem={({ item }) => (
  //     <View style={styles.listItem}>
  //       {/* <Image source={item.avatar} style={styles.avatar} /> */}
  //       <Text>{item.name}</Text>
  //       {/* <Image source={} /> */}
  //     </View>
  //   )}
  // />
  );
};

export default AdminControl;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
  },
});