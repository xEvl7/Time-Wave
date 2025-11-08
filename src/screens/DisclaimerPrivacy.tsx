import { ScrollView } from "react-native";
import React from "react";

import BackgroundImageBox from "../components/BackgroundImageBox";
import HeaderText from "../components/text_components/HeaderText";
import ContentContainer from "../components/ContentContainer";
import TextButton from "../components/TextButton";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import ParagraphText from "../components/text_components/ParagraphText";

const DisclaimerPrivacy = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "DisclaimerPrivacy">) => {
  return (
    <>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <BackgroundImageBox
          style={{ height: "25%" }}
          imageStyle={{ width: 219, height: 157, resizeMode: "contain" }}
          source={require("../assets/background/secure-doc.png")}
        />
        <ContentContainer>
          <HeaderText style={{ marginVertical: 5 }}>
            Disclaimer (T&C)
          </HeaderText>
          <ParagraphText>
            Time Wave warrants that all information contained herein are true as
            at the date of your visit. Whilst the Time Bank endeavours to ensure
            that all information provided is accurate at the time of your visit,
            it cannot be held liable for any loss that you may be occasioned
            upon or suffered therefrom, whether directly or otherwise in law or
            in tort. All visitors are to exercise due care when accessing and
            assessing information contained herein.
          </ParagraphText>
          <HeaderText style={{ marginVertical: 5 }}>Privacy Policy</HeaderText>
          <ParagraphText>
            We take your privacy very seriously. We do not share your details
            for marketing purposes with any external companies. Your information
            may only be shared with our third party partners so that we may
            offer our service.
          </ParagraphText>
          <TextButton onPress={() => navigation.navigate("SignUp")}>
            Agree
          </TextButton>
        </ContentContainer>
      </ScrollView>
    </>
  );
};

export default DisclaimerPrivacy;
