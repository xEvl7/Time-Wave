import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";

const ContributionsHistory = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "ContributionsHistory">) => {
  const handlePressBack = () => {
    navigation.navigate("RewardsPage");
  };
  return <View></View>;
};

export default ContributionsHistory;
