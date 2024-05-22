import { Pressable, Image, View, StyleSheet } from "react-native";
import React from "react";
import PrimaryText from "./text_components/PrimaryText";
import SecondaryText from "./text_components/SecondaryText";

type RightDropProps = {
  onNavigate: () => void;
  title: string;
  children: string;
};

const RightDrop = ({ onNavigate, title, children }: RightDropProps) => {
  return (
    <Pressable onPress={onNavigate} style={styles.container}>
      <View style={styles.textContainer}>
        <PrimaryText>{title}</PrimaryText>
        <SecondaryText>{children}</SecondaryText>
      </View>
      <Image source={require("../assets/next_icon_orange.png")} style={styles.icon} />
    </Pressable>
  );
};

export default RightDrop;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // padding: 15,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ddd',
  },
  textContainer: {
    flex: 1,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#f57c00',
  },
});