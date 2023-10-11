import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import auth from "@react-native-firebase/auth";

import TextButton from "../components/TextButton";
import HeaderText from "../components/text_components/HeaderText";
import BackgroundImageBox from "../components/BackgroundImageBox";
import ContentContainer from "../components/ContentContainer";
import ValidatedTextInput from "../components/ValidatedTextInput";
import { useForm } from "react-hook-form";
import { fetchUserData } from "../features/userSlice";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import { useAppDispatch, useAppSelector } from "../hooks";

// type FormData = {
//   emailAddress: string;
//   password: string;
// };

export default function PastRewardsPage({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "PastRewardsPage">) {
  

  return (
    <View>
      <ContentContainer>
        <View>
      <TextButton onPress={() => navigation.navigate("MyRewardsDetails")}>
          My Rewards Details
        </TextButton>
        </View>
      </ContentContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  alternativesContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  thirdPartyAuthContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  registerContainer: {
    flexDirection: "row",
    minWidth: "78%",
    justifyContent: "space-evenly",
    marginTop: 40,
  },
  MyRewardsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  HeadingContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
});
