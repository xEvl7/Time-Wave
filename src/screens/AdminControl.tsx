import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import { MaterialIcons } from "@expo/vector-icons"; // Assuming you're using Expo, if not, use 'react-native-vector-icons/MaterialIcons'
import RightDrop from "../components/RightDrop"; // Assuming you have this component

const AdminControl = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "AdminControl">) => {
  const [list] = useState([
    { id: 1, name: "Your Community" },
    { id: 2, name: "Approve Volunteer" },
    { id: 3, name: "Remove Volunteer" },
  ]);

  const navigationItems = [
    {
      title: "Your Community",
      onNavigate: () => navigation.navigate("CommunityInfo"),
    },
    {
      title: "Approve Volunteer",
      onNavigate: () => navigation.navigate("ApproveVolunteer"),
    },
    {
      title: "Remove Volunteer",
      onNavigate: () => navigation.navigate("RemoveVolunteer"),
    },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.navigate("QrCodePage")}
      >
        <MaterialIcons name="qr-code" size={40} color="orange" />
      </TouchableOpacity>

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
      />
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
});
