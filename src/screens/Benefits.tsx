import { Text, StyleSheet } from "react-native";
import React from "react";
import BackgroundImageBox from "../components/BackgroundImageBox";
import ContentContainer from "../components/ContentContainer";
import HeaderText from "../components/text_components/HeaderText";
import ParagraphText from "../components/text_components/ParagraphText";

const Benefits = () => {
  return (
    <>
      <BackgroundImageBox
        source={require("../assets/background/clock.png")}
        imageStyle={{ width: 170, height: 165, resizeMode: "contain" }}
        style={{ height: "25%" }}
      />
      <ContentContainer>
        <HeaderText style={{ marginVertical: 10 }}>
          Benefits of Time Wave
        </HeaderText>
        <ParagraphText style={styles.highlight}>
          &gt; Happier, Healthier & Considerate Residents
        </ParagraphText>
        <ParagraphText>
          These ideas help people stay active that may otherwise be unconnected.
        </ParagraphText>
        <ParagraphText style={styles.highlight}>
          &gt; Positive ways to connect with the community
        </ParagraphText>
        <ParagraphText>
          People get to interact in their community and make friends.
        </ParagraphText>
        <ParagraphText style={styles.highlight}>
          &gt; Everyone takes part and benefits
        </ParagraphText>
        <ParagraphText>
          Giving is a valuable way to help people and to add value to your life.
        </ParagraphText>
        <ParagraphText style={styles.highlight}>
          &gt; Stronger community spirit & empowerment
        </ParagraphText>
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
