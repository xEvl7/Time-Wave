import React from "react";
import { View, StyleSheet } from "react-native";

const ProgressBar = ({ progressPercentage }: { progressPercentage: any }) => (
  <View style={styles.progressBar}>
    <View
      style={{
        width: `${progressPercentage * 100}%`,
        height: 5,
        backgroundColor: "white",
      }}
    />
  </View>
);

const styles = StyleSheet.create({
  progressBar: {
    height: 5,
    backgroundColor: "#FBB97C",
  },
});

export default ProgressBar;
