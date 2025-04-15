// import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";

// import ContentContainer from "../components/ContentContainer";
import HeaderText from "../components/text_components/HeaderText";
import TextButton from "../components/TextButton";
import PrimaryText from "../components/text_components/PrimaryText";
import SecondaryText from "../components/text_components/SecondaryText";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import { useAppSelector } from "../hooks";
import firebase from "@react-native-firebase/firestore";
import ContentContainer from "../components/ContentContainer";

const ActivityInfo = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "ActivityInfo">) => {
  const { item } = route.params;
  const [isAdmin, setIsAdmin] = useState(false);
  const [editable, setEditable] = useState(false);
  const [editedItem, setEditedItem] = useState(item);

  const userId = useAppSelector((state) => state.user.data?.uid) || "";

  console.log("item", item);

  useEffect(() => {
    if (item.admins && item.admins.includes(userId)) {
      setIsAdmin(true);
    }
  }, [item.admins, userId]);

  // Update handler remains the same
  const handleInputChange = (field: string, value: string) => {
    setEditedItem((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleEdit = () => {
    setEditable(true);
  };

  const handleSave = async () => {
    try {
      await firebase()
        .collection("activities")
        .doc(item.id)
        .update(editedItem);
      setEditable(false);
    } catch (error) {
      console.error("Error updating activity: ", error);
    }
  };

  const renderEditableField = (
    field: string,
    value: string,
    multiline: boolean = false
  ) => {
    const textStyle =
      field === "name"
        ? [styles.textDetails, styles.nameText]
        : styles.textDetails;
    const inputStyle =
      field === "name"
        ? [styles.editingText, styles.nameText]
        : styles.editingText;
    return editable ? (
      <TextInput
        style={inputStyle}
        value={value}
        onChangeText={(text) => handleInputChange(field, text)}
        multiline={multiline}
      />
    ) : (
      <Text style={textStyle}>{value}</Text>
    );
  };

  // Helper to safely format the date value
  const formatTimestamp = (timestamp: any) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    if (!timestamp) return "N/A";
    // If timestamp is a Firebase Timestamp, it has a toDate method
    if (typeof timestamp.toDate === "function") {
      return timestamp.toDate().toLocaleString("en-US", options);
    }
    // Otherwise, try parsing it as a regular date
    return new Date(timestamp).toLocaleString("en-US", options);
  };

  return (
    <ScrollView>
      <Image style={styles.iconImage} source={{ uri: editedItem.logo }} />
      <ContentContainer>
        <View style={styles.nameContainer}>
          {renderEditableField("name", editedItem.name)}
        </View>

        <View style={styles.LDcontainer}>
          <View style={styles.LDItem}>
            <Text style={styles.LDtitle}>Location</Text>
            {renderEditableField("location", editedItem.location)}
          </View>
          <View style={styles.line1} />
          <View style={styles.LDItem}>
            <Text style={styles.LDtitle}>Date</Text>
            <Text style={styles.textDetails}>
              {formatTimestamp(editedItem.endDate)}
            </Text>
          </View>
        </View>
        <View style={styles.line2} />

        <View style={styles.detailsContainer}>
          <Text style={styles.textTitle}>Description</Text>
          {renderEditableField("description", editedItem.description, true)}
          {/* <Text style={styles.textTitle}>Terms & Condition</Text> <View style={styles.detailsContainer}>
          {renderEditableField("TandC", editedItem.TandC, true)} */}
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.textTitle}>Contact Info</Text>
          {renderEditableField("contactInfo", editedItem.contactInfo)}
        </View>
      </ContentContainer>

      {isAdmin && (
        <Pressable
          style={styles.button}
          onPress={editable ? handleSave : handleEdit}
        >
          <Text style={styles.buttonText}>
            {editable ? "Save" : "Edit"}
          </Text>
        </Pressable>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  iconImage: {
    minHeight: 200,
    flexDirection: "row",
    flex: 1,
    backgroundColor: "#FF8D1342",
  },
  nameContainer: {
    alignSelf: "center",
    marginBottom: 5,
  },
  activityName: {
    alignContent: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  LDcontainer: {
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 8,
    height: 112,
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
  LDdetails: {
    fontWeight: "bold",
    fontSize: 18,
  },
  textTitle: {
    marginTop: 18,
    fontSize: 18,
    // fontWeight: "bold",
  },
  textDetails: {
    // marginLeft: 2,
    marginTop: 3.5,
    fontSize: 16,
    color: "grey",
  },
  nameText: {
    fontWeight: "600",

    fontSize: 38,
  },
  line1: {
    alignSelf: "center",
    height: "97%",
    width: 1.4,
    backgroundColor: "#ababab",
  },
  line2: {
    marginTop: 13,
    alignSelf: "center",
    width: "100%",
    height: 1.4,
    backgroundColor: "#ababab",
  },
  detailsContainer: {
    marginTop: 8,
  },
  editingText: {
    backgroundColor: "#FF8D1342",
    color: "#3D5A80",
    fontSize: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#954126",
    marginLeft: 10,
    marginTop: 6,
  },
  button: {
    backgroundColor: "#3498db",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default ActivityInfo;
