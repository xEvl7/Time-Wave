import { 
  StyleSheet, 
  View ,
  Text,
  Image,
  FlatList,
  Pressable,
  ImageSourcePropType,
  GestureResponderEvent,
  ScrollView } 
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
import PrimaryText from "../components/text_components/PrimaryText";
import { useAppSelector } from "../hooks";
import { selectUserName } from "../features/userSlice";
import { NavigationProp } from "@react-navigation/native";
import ButtonText from "../components/text_components/ButtonText";


const Communities = ({
  navigation, route
}: NativeStackScreenProps<RootStackParamList, "Communities">) => {
  const [communitiesData, setCommunitiesData] = useState<
    FirebaseFirestoreTypes.DocumentData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const item = route.params;
  console.log("item", item);

  useEffect(() => {
    const fetchCommunitiesData = async () => {
      try {
        const response = await firebase.firestore().collection("Communities").get();
        const fetchedCommunitiesData = response.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCommunitiesData(fetchedCommunitiesData);
      } catch (error) {
        console.error("Error fetching communities data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunitiesData();
  }, []);

  const renderCommunityItem = ({ item }: { item: any }) => (
    <Pressable
      style={styles.gridItem}
      onPress={() => navigation.navigate("CommunityInfo", item)}
    >
      <View style={styles.imageBox}>
        <Image
          source={{ uri: item.logo }}
          style={styles.image}
        />
      </View>
      <View style={styles.text}>
        <Text style={styles.description}>{item.name}</Text>
        <Text style={styles.subDescription}>{item.description}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={communitiesData}
          keyExtractor={(item) => item.id}
          renderItem={renderCommunityItem}
          contentContainerStyle={{ padding: 10 }}
          ListEmptyComponent={() => (
            <Text style={styles.emptyMessage}>No communities available</Text>
          )}
        />
      )}
    </View>
  );
};

export default Communities;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
  gridItem: {
    marginVertical: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  imageBox: {
    height: 150,
    backgroundColor: "#eaeaea",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  text: {
    padding: 10,
    backgroundColor: "#fff",
  },
  description: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subDescription: {
    fontSize: 14,
    color: "#666",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
  emptyMessage: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "red",
  },
});


