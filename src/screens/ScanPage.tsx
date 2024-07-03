import { StyleSheet, Text, View, Alert, Linking, Platform } from "react-native";
import React, { useState, useEffect } from "react";
import { BarCodeScanner, BarCodeScannerResult } from "expo-barcode-scanner";
import * as Notifications from "expo-notifications";

import TextButton from "../components/TextButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";

const ScanPage = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "ScanPage">) => {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasNotificationPermission, setHasNotificationPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getPermissions = async () => {
      const { status: cameraStatus, canAskAgain } =
        await BarCodeScanner.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus === "granted");

      const { status: notificationStatus } =
        await Notifications.requestPermissionsAsync();
      setHasNotificationPermission(notificationStatus === "granted");

      if (cameraStatus !== "granted" && !canAskAgain) {
        Alert.alert(
          "Camera Permission Denied",
          "You have permanently denied camera permission. Please enable it from settings.",
          [
            { text: "Cancel", onPress: () => navigation.goBack() },
            { text: "Open Settings", onPress: openAppSettings },
          ]
        );
      }
    };
    getPermissions();
  }, []);

  const openAppSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  };

  useEffect(() => {
    if (hasCameraPermission === false) {
      Alert.alert(
        "Camera Permission Denied",
        "You have denied camera permission. Please enable it from settings.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    }
  }, [hasCameraPermission]);

  const handleBarCodeScanned = async ({ type, data }: BarCodeScannerResult) => {
    setScanned(true);
    try {
      if (hasNotificationPermission) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "QR Code Scanned",
            body: `Data: ${data}`,
          },
          trigger: null,
        });
      }
      alert(`Data:\n ${data}`);

      // You can process the scanned data here
      const scannedData = JSON.parse(data);
      // Do something with scannedData
    } catch (error) {
      console.error("Failed to parse scanned data:", error);
    }
  };

  if (hasCameraPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.scanner}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
      />
      {scanned && (
        <TextButton
          style={{ marginHorizontal: 20, marginTop: 50 }}
          onPress={() => setScanned(false)}
        >
          Scan Again
        </TextButton>
      )}
      {/* <TextButton
        style={{ marginHorizontal: 20, marginTop: 100 }}
        onPress={() => navigation.navigate("QrCodePage")}
      >
        Show QR Code
      </TextButton> */}
    </View>
  );
};

export default ScanPage;

const styles = StyleSheet.create({
  scanner: {
    height: 600,
    width: "100%",
  },
});
