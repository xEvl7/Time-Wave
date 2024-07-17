import React from "react";
import { View, StyleSheet } from "react-native";

const SectionContainer = ({ children }: { children: any }) => (
  <View style={styles.container}>{children}</View>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
});

export default SectionContainer;
