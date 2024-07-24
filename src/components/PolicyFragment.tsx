import React from "react";
import { View, StyleSheet, Text } from "react-native";

const PolicyFragment = ({
  current,
}: {
  current: string;
}) => (
  
  <View>
    <View style={{ height: 8 }} />
    <View style={styles.fragment}>
      <Text style={styles.textHeader1}>Current level</Text>
      <Text style={styles.textHeader2}>Your Points Policy</Text>
      <Text style={styles.textContent}>{current}</Text>
    </View>
    <View style={{ height: 8 }} />
    <View style={styles.fragment}>
      <Text style={styles.textHeader2}>
        Policy for{"\n"}Earning Our TimeBank Rewards Points
      </Text>
      <Text style={styles.textContent}>
        Per month:{"\n"}1-10 hours: Each Hour *4{"\n"}11-20 hours: Each Hour *5
        {"\n"}21-30 hours: Each Hour *6{"\n"}31++ hours: Each Hour *8{"\n\n"}
        E.g. If you have contributed a total of 30 hours in the last month, then
        you will get a total of 180 TimeBank rewards points (30*6).
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  fragment: {
    backgroundColor: "white",
    padding: 12,
  },
  textHeader1: {
    fontSize: 14,
    fontWeight: "300",
  },
  textHeader2: {
    fontSize: 18,
    fontWeight: "bold",
  },
  textContent: {
    fontSize: 16,
    fontWeight: "300",
    textAlign: "center",
  },
});

export default PolicyFragment;
