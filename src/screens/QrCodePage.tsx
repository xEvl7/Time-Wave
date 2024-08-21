import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";

import SvgQRCode from "react-native-qrcode-svg";
import TextButton from "../components/TextButton";
import ContentContainer from "../components/ContentContainer";
import { DateTime } from "luxon";
import firestore, { firebase } from "@react-native-firebase/firestore";
import { checkUserAdmin } from "../features/communitySlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useSelector } from "react-redux";
import { RootState } from "../store";

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

  const handlePressShowQRCode = async () => {
    if (!selectedCommunity) {
      console.error("No community selected.");
      return;
    }

    setShowQrCode(true);

    // Get the current time in Malaysia timezone including minutes and seconds
    const malaysiaTime = firebase.firestore.Timestamp.now();
    console.log("malaysiaTime", malaysiaTime);

    const newData = {
      generateTime: malaysiaTime,
      communityId: selectedCommunity,
      type: type, // "check-in" or "check-out"
    };

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
        <SvgQRCode size={200} value={data} />
      </View>
    );

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.text}>Show {title}</Text>
      <Text style={styles.instructionText}>
        Enter your Community PIN to generate QR Code
      </Text>
      <TextButton
        style={{ paddingHorizontal: 50 }}
        onPress={handlePressShowQRCode}
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
});
