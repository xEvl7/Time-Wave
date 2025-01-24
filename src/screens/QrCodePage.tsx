import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import SvgQRCode from "react-native-qrcode-svg";
import TextButton from "../components/TextButton";
import ContentContainer from "../components/ContentContainer";
import firestore, { firebase } from "@react-native-firebase/firestore";
import { checkUserAdmin } from "../features/communitySlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Picker } from "@react-native-picker/picker";

// Define the type for Activity
type Activity = {
  id: string;
  name: string;
};

const QrCodePage = () => {
  return (
    <ContentContainer style={styles.container}>
      <QrCodeSection title={"Check-in QR Code"} type="check-in" />
      <QrCodeSection title={"Check-out QR Code"} type="check-out" />
    </ContentContainer>
  );
};

type QrCodeSectionProps = {
  title: string;
  type: "check-in" | "check-out";
};

const QrCodeSection = ({ title, type }: QrCodeSectionProps) => {
  const [showQrCode, setShowQrCode] = useState(false);
  const [data, setData] = useState("");
  const [communities, setCommunities] = useState<Map<string, string>>(
    new Map()
  ); // Stores community ID and name
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(
    null
  );

  // Explicitly set the type to Activity[]
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [selectedActivityName, setSelectedActivityName] = useState<
    string | null
  >(null); // Store selected activity name

  const dispatch = useAppDispatch();
  const ownUserId = useAppSelector((state) => state.user.data?.uid);

  useEffect(() => {
    if (ownUserId) {
      dispatch(checkUserAdmin(ownUserId));
      fetchCommunitiesForUser(ownUserId);
    }
  }, [ownUserId, dispatch]);

  const fetchCommunitiesForUser = async (userId: string) => {
    try {
      const userDoc = await firestore().collection("Users").doc(userId).get();
      const userData = userDoc.data();
      if (userData && userData.adminOf) {
        const communityIds = userData.adminOf;
        const communitiesSnapshot = await firestore()
          .collection("Communities")
          .where(firebase.firestore.FieldPath.documentId(), "in", communityIds)
          .get();
        const communitiesMap = new Map<string, string>();
        communitiesSnapshot.forEach((doc) => {
          const communityData = doc.data();
          communitiesMap.set(doc.id, communityData.name);
        });
        setCommunities(communitiesMap);
        if (communityIds.length > 0) {
          setSelectedCommunity(communityIds[0]); // Set a default selected community
        }
      }
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
  };

  const fetchActivitiesForCommunity = async (communityId: string) => {
    try {
      const activitiesSnapshot = await firestore()
        .collection("Activities")
        .where("communityId", "==", communityId)
        .get();
      const activitiesList: Activity[] = activitiesSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name, // Assuming there's a 'name' field
      }));
      console.log("activitiesList: ", activitiesList);
      setActivities(activitiesList);
      if (activitiesList.length > 0) {
        setSelectedActivity(activitiesList[0].id); // Set default activity
        setSelectedActivityName(activitiesList[0].name); // Set default activity name
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const handlePressShowQRCode = async () => {
    if (!selectedActivity) {
      console.error("No activity selected.");
      return;
    }

    setShowQrCode(true);

    const malaysiaTime = firebase.firestore.Timestamp.now();
    const newData = {
      generateTime: malaysiaTime,
      communityId: selectedCommunity,
      activityId: selectedActivity,
      activityName: selectedActivityName,
      type: type, // "check-in" or "check-out"
    };
    console.log("qrCode generated info: ", newData);
    setData(JSON.stringify(newData));

    try {
      await firestore().collection("QRCodeData").add(newData);
      console.log("QR Code data stored successfully.");
    } catch (error) {
      console.error("Error storing QR Code data:", error);
    }
  };

  useEffect(() => {
    if (selectedCommunity) {
      fetchActivitiesForCommunity(selectedCommunity); // Fetch activities whenever community changes
    }
  }, [selectedCommunity]);

  if (showQrCode)
    return (
      <View style={styles.sectionContainer}>
        <Text style={[styles.text, { marginBottom: 20 }]}>{title}</Text>
        {/* Display the selected activity name */}
        <Text style={[styles.text, { marginBottom: 20 }]}>
          Activity: {selectedActivityName}
        </Text>
        <SvgQRCode size={200} value={data} />
      </View>
    );

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.text}>Show {title}</Text>
      <Text style={styles.instructionText}>
        Select your Activity to generate QR Code
      </Text>
      <Picker
        selectedValue={selectedActivity}
        onValueChange={(itemValue, itemIndex) => {
          setSelectedActivity(itemValue);
          setSelectedActivityName(activities[itemIndex].name); // Set the activity name
        }}
        style={styles.picker}
      >
        {activities.map((activity) => (
          <Picker.Item
            key={activity.id}
            label={activity.name}
            value={activity.id}
          />
        ))}
      </Picker>
      <TextButton
        style={{ paddingHorizontal: 20 }}
        onPress={handlePressShowQRCode}
        // disabled={!selectedActivity} // Disable if no activity selected
      >
        Show QR Code
      </TextButton>
    </View>
  );
};

export default QrCodePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  instructionText: {
    marginTop: 10,
    fontSize: 14,
    minHeight: 20,
    color: "#FF8D13",
  },
  text: {
    fontSize: 20,
    fontWeight: "500",
  },
  picker: {
    height: 50,
    width: 200,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#FF8D13",
    borderRadius: 5,
  },
});
