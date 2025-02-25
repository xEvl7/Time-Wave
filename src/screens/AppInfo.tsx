import React from "react";

import BackgroundImageBox from "../components/BackgroundImageBox";
import HeaderText from "../components/text_components/HeaderText";
import TextButton from "../components/TextButton";
import ContentContainer from "../components/ContentContainer";
import ParagraphText from "../components/text_components/ParagraphText";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AppInfo = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "AppInfo">) => {

  const handlePressContinue = async () => {
    const hasSeenAppInfo = await AsyncStorage.getItem("hasSeenAppInfo");
    await AsyncStorage.setItem("hasSeenAppInfo", "true");
    console.log("hasSeenAppInfo before: ", hasSeenAppInfo);
    const hasSeenAppInfo2 = await AsyncStorage.getItem("hasSeenAppInfo");
    console.log("hasSeenAppInfo after: ", hasSeenAppInfo2);

    navigation.navigate("HomeTabs");
  };

  return (
    <>
      <BackgroundImageBox
        style={{ height: "30%" }}
        source={require("../assets/background/appInfo.png")}
      />
      <ContentContainer>
        <HeaderText>App Info</HeaderText>
        <ParagraphText>
          This app is essentially a reciprocity-based work system in which money
          is not used, but rather time is considered a currency.
        </ParagraphText>
        <ParagraphText>
          In a Time Wave community, a person with a particular skill set can
          trade hours of work for equal hours of work given in exchange instead
          of paying for services. Simply put, the time credit is a currency
          system where time replaces money.
        </ParagraphText>
        <ParagraphText>
          Members of a Time Wave contribute hours of service in exchange for
          time credits that can be used for services they may need and are
          available. Time Wave is a relatively new and simple concept that can
          have an amazing and lasting impact on your life and community.
        </ParagraphText>
        <TextButton onPress={handlePressContinue}>Continue</TextButton>
      </ContentContainer>
    </>
  );
};

export default AppInfo;
