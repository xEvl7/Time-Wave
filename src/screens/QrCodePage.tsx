import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";

import SvgQRCode from "react-native-qrcode-svg";
import TextButton from "../components/TextButton";
import ContentContainer from "../components/ContentContainer";

const QrCodePage = () => {
  return (
    <ContentContainer style={styles.container}>
      <QrCodeSection title={"Check-in QR Code"} />
      <QrCodeSection title={"Check-out QR Code"} />
    </ContentContainer>
  );
};

type QrCodeSectionProps = {
  title: string;
};

const QrCodeSection = ({ title }: QrCodeSectionProps) => {
  const [showQrCode, setShowQrCode] = useState(false);
  const [data, setData] = useState("");

  const handlePressShowQRCode = () => {
    setShowQrCode(true);

    const newData = {
      time: Date.now(),
      community: "test",
    };

    setData(JSON.stringify(newData));
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
    color: "#7BB8A3",
  },
  text: {
    fontSize: 20,
    fontWeight: "500",
  },
});
