import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import SvgQRCode from "react-native-qrcode-svg";
import TextButton from "../components/TextButton";
import ContentContainer from "../components/ContentContainer";
import firestore, { firebase } from "@react-native-firebase/firestore";
import { checkUserAdmin } from "../features/communitySlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Picker } from "@react-native-picker/picker";

type Activity = {
  id: string;
  name: string;
};

type Community = {
  id: string;
  name: string;
};

const QrCodePage = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(
    null
  );

  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const ownUserId = useAppSelector((state) => state.user.data?.uid);
  const emailAddress = useAppSelector((state) => state.user.data?.emailAddress);

  useEffect(() => {
    if (ownUserId && emailAddress) {
      dispatch(checkUserAdmin(ownUserId));
      fetchCommunitiesForUser(emailAddress);
    }
  }, [emailAddress, dispatch]);

  const fetchCommunitiesForUser = async (emailAddress: string) => {
    try {
      const querySnapshot = await firestore()
        .collection("Users")
        .where("emailAddress", "==", emailAddress)
        .get();

      if (querySnapshot.size !== 1) {
        throw new Error(
          `${emailAddress} Either has no data or more than 1 data.`
        );
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      if (userData?.adminOf?.length) {
        const communitiesSnapshot = await firestore()
          .collection("Communities")
          .where(
            firebase.firestore.FieldPath.documentId(),
            "in",
            userData.adminOf
          )
          .get();

        const communitiesList: Community[] = communitiesSnapshot.docs.map(
          (doc) => ({
            id: doc.id,
            name: doc.data().name,
          })
        );

        setCommunities(communitiesList);
        setSelectedCommunity(communitiesList[0] || null); // 直接选第一个社区
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
        name: doc.data().name,
      }));

      setActivities(activitiesList);
      setSelectedActivity(activitiesList[0]?.id || null); // 直接选第一个活动
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  useEffect(() => {
    if (selectedCommunity) {
      fetchActivitiesForCommunity(selectedCommunity.id);
    }
  }, [selectedCommunity]);

  return (
    <ContentContainer style={styles.container}>
      <QrCodeSection
        title="Check-in QR Code"
        type="check-in"
        communities={communities}
        selectedCommunity={selectedCommunity}
        onCommunityChange={setSelectedCommunity}
        activities={activities}
        selectedActivity={selectedActivity}
        onActivityChange={setSelectedActivity}
      />
      <QrCodeSection
        title="Check-out QR Code"
        type="check-out"
        communities={communities}
        selectedCommunity={selectedCommunity}
        onCommunityChange={setSelectedCommunity}
        activities={activities}
        selectedActivity={selectedActivity}
        onActivityChange={setSelectedActivity}
      />
    </ContentContainer>
  );
};

type QrCodeSectionProps = {
  title: string;
  type: "check-in" | "check-out";
  communities: Community[];
  selectedCommunity: Community | null;
  onCommunityChange: (community: Community | null) => void;
  activities: Activity[];
  selectedActivity: string | null;
  onActivityChange: (activityId: string | null) => void;
};

const QrCodeSection = ({
  title,
  type,
  communities,
  selectedCommunity,
  onCommunityChange,
  activities,
  selectedActivity,
  onActivityChange,
}: QrCodeSectionProps) => {
  const [showQrCode, setShowQrCode] = useState(false);
  const [data, setData] = useState("");

  const handlePressShowQRCode = async () => {
    if (!selectedActivity || !selectedCommunity) {
      console.error("No activity or community selected.");
      return;
    }

    setShowQrCode(true);

    const newData = {
      generateTime: firebase.firestore.Timestamp.now(),
      communityId: selectedCommunity.id,
      communityName: selectedCommunity.name,
      activityId: selectedActivity,
      activityName: activities.find((a) => a.id === selectedActivity)?.name,
      type,
    };

    console.log("QR Code generated info: ", newData);
    setData(JSON.stringify(newData));

    try {
      await firestore().collection("QRCodeData").add(newData);
      console.log("QR Code data stored successfully.");
    } catch (error) {
      console.error("Error storing QR Code data:", error);
    }
  };

  if (showQrCode)
    return (
      <View style={styles.sectionContainer}>
        <Text style={[styles.text, { marginBottom: 20 }]}>{title}</Text>
        <Text style={[styles.text, { marginBottom: 20 }]}>
          Activity: {activities.find((a) => a.id === selectedActivity)?.name}
        </Text>
        <SvgQRCode size={200} value={data} />
      </View>
    );

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.text}>Show {title}</Text>
      <Text style={styles.instructionText}>Select your Community</Text>
      <Picker
        selectedValue={selectedCommunity?.id}
        onValueChange={(itemValue) => {
          const selected = communities.find((c) => c.id === itemValue) || null;
          onCommunityChange(selected);
        }}
        style={styles.picker}
      >
        {communities.map((community) => (
          <Picker.Item
            key={community.id}
            label={community.name}
            value={community.id}
          />
        ))}
      </Picker>

      <Text style={styles.instructionText}>Select your Activity</Text>
      <Picker
        selectedValue={selectedActivity}
        onValueChange={(itemValue) => onActivityChange(itemValue)}
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
      >
        Show QR Code
      </TextButton>
    </View>
  );
};

export default QrCodePage;

const styles = StyleSheet.create({
  container: { flex: 1 },
  sectionContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  instructionText: { marginTop: 10, fontSize: 14, color: "#FF8D13" },
  text: { fontSize: 20, fontWeight: "500" },
  picker: { height: 50, width: 200, marginVertical: 10 },
});
