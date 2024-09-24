import { StyleSheet, 
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  ImageSourcePropType,
  GestureResponderEvent,
  ScrollView } from "react-native";
import { useEffect, useState } from "react";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import ContentContainer from "../components/ContentContainer";
import ParagraphText from "../components/text_components/ParagraphText";
import { RootStackParamList } from "../Screen.types";
import PrimaryText from "../components/text_components/PrimaryText";

const OngoingActivities = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, "OngoingActivities">) => {
  
  return (
    <ContentContainer>
      {/* @todo Show community's picture*/}
      <View style={styles.communityNameContainer}>
        <PrimaryText>{route.params.name}</PrimaryText>
      </View>
      <PrimaryText>About Our Community</PrimaryText>
      <ParagraphText>{route.params.description}</ParagraphText>
      <PrimaryText>Admins</PrimaryText>
      <PrimaryText>Volunteer Log History</PrimaryText>
    </ContentContainer>
  );
};

export default OngoingActivities;