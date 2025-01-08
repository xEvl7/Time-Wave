import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import ContentContainer from "../components/ContentContainer";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";

const RewardsDetailsPage = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "RewardsDetailsPage">) => {
  const { item } = route.params;
  const [searchQuery, setSearchQuery] = useState("");
  console.log('hi,this way');

  // 过滤内容
  const filteredContent = (field: string) =>
    field.toLowerCase().includes(searchQuery.toLowerCase());

  return (
    <View>
      

      <ScrollView>
      <TextInput
        style={styles.searchInput}
        placeholder="搜索内容..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
        {/* Image Part */}
        <View>
          <Image style={styles.iconImage} source={{ uri: item.logo }} />
        </View>
        
        {/* Name and description part */}
        <ContentContainer>
          {filteredContent(item.name) && (
            <View style={styles.nameContainer}>
              <Text style={styles.activityName}>{item.name}</Text>
            </View>
          )}
          
          <View style={styles.LDcontainer}>
            <View style={styles.LDItem}>
              <Text style={styles.LDtitle}>Location</Text>
              {filteredContent(item.location) && (
                <Text style={styles.textTitle}>{item.location}</Text>
              )}
            </View>
            <View style={styles.line1}></View>

            <View style={styles.LDItem}>
              <Text style={styles.LDtitle}>Date</Text>
              {filteredContent(item.date) && (
                <Text style={styles.textTitle}>{item.date}</Text>
              )}
            </View>
            <View style={styles.line2}></View>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.textTitle}>Description</Text>
            {filteredContent(item.description) && (
              <Text style={styles.textDetails}>{item.description}</Text>
            )}
            <Text style={styles.textTitle}>Terms & Condition</Text>
            {filteredContent(item.TandC) && (
              <Text style={styles.textDetails}>{item.TandC}</Text>
            )}
            <Text style={styles.textTitle}>Contact Info</Text>
            {filteredContent(item.contactinfo) && (
              <Text style={styles.textDetails}>{item.contactinfo}</Text>
            )}
          </View>
        </ContentContainer>
      </ScrollView>
    </View>
  );
};

export default RewardsDetailsPage;

const styles = StyleSheet.create({
  iconImage: {
    minHeight: 200,
    flexDirection: "row",
    flex: 1,
    backgroundColor: "light-grey",
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    margin: 10,
  },
  nameContainer: {
    alignSelf: "center",
    marginBottom: 5,
  },
  activityName: {
    alignContent: "center",
    fontSize: 28,
    fontWeight: "300",
  },
  LDcontainer: {
    marginTop: 4,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 8,
    height: 72,
  },
  LDtitle: {
    fontSize: 18,
  },
  LDItem: {
    marginLeft: 18,
    width: "20%",
    height: "100%",
    marginTop: 10,
    flex: 1,
  },
  textTitle: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "bold",
  },
  textDetails: {
    marginTop: 2,
    fontSize: 16,
    color: "grey",
  },
  line1: {
    alignSelf: "center",
    height: "97%",
    width: 1.4,
    backgroundColor: "#ababab",
  },
  line2: {
    alignSelf: "center",
    width: "100%",
    height: 1.4,
    backgroundColor: "#ababab",
  },
  detailsContainer: {
    marginTop: 8,
  },
});
