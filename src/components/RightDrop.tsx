import { Pressable, Image, View } from "react-native";
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
    <View style={{ flex: 0.5, justifyContent: "center" }}>
      <Pressable onPress={onNavigate}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <PrimaryText>{title}</PrimaryText>
            <SecondaryText>{children}</SecondaryText>
          </View>
          <Image source={require("../assets/navigate-button.png")} />
        </View>
      </Pressable>
    </View>
  );
};

export default RightDrop;
