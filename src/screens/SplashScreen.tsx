import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/ic_launcher.png")}
        style={styles.appLogo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF8D13",
  },
  appLogo: {
    width: 150,
    height: 150,
  },
});

export default SplashScreen;
