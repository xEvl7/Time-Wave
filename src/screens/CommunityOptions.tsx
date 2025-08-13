import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput, 
  Button,
  Pressable,
  FlatList,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";

type CommunityOptionsProps = NativeStackScreenProps<RootStackParamList, "CommunityOptions">;

const options = [
  {
    title: "View Community Info",
    onNavigate: (navigation, community) =>
      navigation.navigate("CommunityInfo", { ...community }),
  },
  {
    title: "Approve Volunteers",
    onNavigate: (navigation, community) =>
      navigation.navigate("ActivitySeeAll", { item: community }),
  },
  {
    title: "Remove Volunteers",
    onNavigate: (navigation, community) =>
      navigation.navigate("VolunteerList", { communityId: community.id }),
  },
];

const CommunityOptions = ({ navigation, route }: CommunityOptionsProps) => {
  const community = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{community.name}</Text>
      <FlatList
        data={options}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <Pressable
            style={styles.optionButton}
            onPress={() => item.onNavigate(navigation, community)}
          >
            <Text style={styles.optionText}>{item.title}</Text>
          </Pressable>
        )}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 30,
    textAlign: "center",
  },
  flatListContainer: {
    paddingVertical: 20,
  },
  optionButton: {
    backgroundColor: "#F1CFA3",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: "center",
  },
  optionText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#604300",
  },
});

export default CommunityOptions;