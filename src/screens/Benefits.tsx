import { Text, StyleSheet } from "react-native";
import React from "react";
import BackgroundImageBox from "../components/BackgroundImageBox";
import ContentContainer from "../components/ContentContainer";
import HeaderText from "../components/text_components/HeaderText";
import ParagraphText from "../components/text_components/ParagraphText";

const Benefits = () => {
  return (
    <>
      <BackgroundImageBox />
      <ContentContainer>
        <HeaderText>Benefits of Time Wave</HeaderText>
        <Text style={styles.highlight}>
          Happier, Healthier & Considerate Residents
        </Text>
        <ParagraphText>
          These ideas help people stay active that may otherwise be unconnected.
        </ParagraphText>
        <Text style={styles.highlight}>
          Positive ways to connect with the community
        </Text>
        <ParagraphText>
          People get to interact in their community and make friends.
        </ParagraphText>
        <Text style={styles.highlight}>Everyone takes part and benefits</Text>
        <ParagraphText>
          Giving is a valuable way to help people and to add value to your life.
        </ParagraphText>
        <Text style={styles.highlight}>
          Stronger community spirit & empowerment
        </Text>
        <ParagraphText>
          Offering and receiving help on a Time Wave is also a social experience
        </ParagraphText>
      </ContentContainer>
    </>
  );
};

export default Benefits;

const styles = StyleSheet.create({
  highlight: {
    fontWeight: "800",
  },
});
