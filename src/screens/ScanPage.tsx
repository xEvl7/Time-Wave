import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { BarCodeScanner, BarCodeScannerResult } from "expo-barcode-scanner";

import TextButton from "../components/TextButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";

const ScanPage = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "ScanPage">) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: BarCodeScannerResult) => {
    setScanned(true);
    alert(`Data:\n ${data}`);

    const scannedData = JSON.parse(data);
  };

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
    height: 700,
    width: "100%",
    margin: "auto",
  },
});
