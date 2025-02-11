import TextButton from "../components/TextButton";
import HeaderText from "../components/text_components/HeaderText";
import BackgroundImageBox from "../components/BackgroundImageBox";
import ContentContainer from "../components/ContentContainer";
import ParagraphText from "../components/text_components/ParagraphText";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import React from "react";

export default function Welcome({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Welcome">) {
  return (
    <>
      <BackgroundImageBox
        style={{ height: "38%" }}
        source={require("../assets/background/welcome.png")}
        // imageStyle={{ marginBottom: 30 }}
      ></BackgroundImageBox>
      <ContentContainer>
        <HeaderText>Welcome to Time Wave</HeaderText>
        <ParagraphText>
          Time Wave aims to provide a platform for you to connect with others in
          their community and exchange services or skills using a time-based
          currency system.
        </ParagraphText>
        <ParagraphText>
          This is a relatively new and simple concept that can have an amazing
          and lasting impact on your life and community.
        </ParagraphText>
        <ParagraphText>
          Lets become the member of Time Wave, contribute hours of service in
          exchange for time credits that can be used for services they you may
          need and are available.
        </ParagraphText>
        <TextButton onPress={() => navigation.navigate("LogIn")}>
          Next
        </TextButton>
      </ContentContainer>
    </>
  );
}
