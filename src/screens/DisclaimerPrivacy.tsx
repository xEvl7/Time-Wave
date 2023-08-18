import { Text, View } from "react-native";
import React from "react";

import BackgroundImageBox from "../components/BackgroundImageBox";
import HeaderText from "../components/text_components/HeaderText";
import ContentContainer from "../components/ContentContainer";
import TextButton from "../components/TextButton";
import styles from "../styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";

const DisclaimerPrivacy = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "DisclaimerPrivacy">) => {
  return (
    <View>
      <BackgroundImageBox
        style={{ height: "30%" }}
        source={require("../assets/background/disclaimer-privacy.png")}
      />
      <ContentContainer>
        <HeaderText>Disclaimer (T&C)</HeaderText>
        <Text style={styles.paragraph}>
          Time Wave warrants that all information contained herein are true as
          at the date of your visit. Whilst the Time Bank endeavours to ensure
          that all information provided is accurate at the time of your visit,
          it cannot be held liable for any loss that you may be occasioned upon
          or suffered therefrom, whether directly or otherwise in law or in
          tort. All visitors are to exercise due care when accessing and
          assessing information contained herein.
        </Text>
        <HeaderText>Privacy Policy</HeaderText>
        <Text style={styles.paragraph}>
          We take your privacy very seriously. We do not share your details for
          marketing purposes with any external companies. Your information may
          only be shared with our third party partners so that we may offer our
          service.
        </Text>
        <TextButton onPress={() => navigation.navigate("SignUp")}>
          Agree
        </TextButton>
      </ContentContainer>
    </View>
  );
};

export default DisclaimerPrivacy;
