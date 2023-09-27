import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
  ImageSourcePropType,
  GestureResponderEvent,
} from "react-native";
import React from "react";

import HeaderText from "../components/text_components/HeaderText";
import TextButton from "../components/TextButton";
import PrimaryText from "../components/text_components/PrimaryText";
import SecondaryText from "../components/text_components/SecondaryText";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import { useAppSelector } from "../hooks";
import { selectUserName } from "../features/userSlice";

const HomePage = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "HomePage">) => {
  const name = useAppSelector(selectUserName);

  return (
    <>
      <ProfileSection name={name} navigation={navigation} />
      <View style={styles.listSectionContainer}>
        <ListSection title={"Communities Around You"} />
        <ListSection title={"My Rewards"} />
        <ListSection title={"History"} />
      </View>
      <NavigationBar navigation={navigation} route={route} />
    </>
  );
};

const communities = ["c", "o", "d", "b"];

type NavigationItemProps = {
  itemSource: ImageSourcePropType;
  text: string;
  onPress: (event: GestureResponderEvent) => void;
};

const NavigationItem = ({ itemSource, text, onPress }: NavigationItemProps) => {
  return (
    <Pressable
      style={{
        alignItems: "center",
        height: "70%",
      }}
      onPress={onPress}
    >
      <Image source={itemSource} style={{ aspectRatio: 1, height: "65%" }} />
      <Text style={{ color: "white", textAlign: "center" }}>{text}</Text>
    </Pressable>
  );
};

const NavigationBar = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "HomePage">) => {
  return (
    <View style={styles.navigationBarContainer}>
      <NavigationItem
        itemSource={require("../assets/activity-icon.png")}
        text={"Activity"}
        onPress={() => {}}
      />
      <NavigationItem
        itemSource={require("../assets/home-icon.png")}
        text="Home"
        onPress={() => {}}
      />
      <NavigationItem
        itemSource={require("../assets/scan-icon.png")}
        text="Scan"
        onPress={() => {
          navigation.navigate("ScanPage");
        }}
      />
    </View>
  );
};

type ListSectionProps = {
  title: string;
};

const ListSection = ({ title }: ListSectionProps) => {
  return (
    <View style={styles.listContainer}>
      <View style={styles.sectionInfoContainer}>
        <PrimaryText>{title}</PrimaryText>
        <SecondaryText>See all</SecondaryText>
      </View>
      <FlatList
        style={styles.list}
        data={communities}
        // renderItem={({ community }) => (
        renderItem={({}) => (
          <View style={styles.sectionItem}>
            <Text style={{ fontSize: 18 }}>Test</Text>
            <TextButton
              style={styles.viewButton}
              textStyle={styles.viewButtonText}
              onPress={() => {}}
            >
              View
            </TextButton>
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

type ProfileSectionProps = {
  name: string;
  navigation: NativeStackNavigationProp<RootStackParamList, "HomePage">;
};

const ProfileSection = ({ name, navigation }: ProfileSectionProps) => {
  return (
    <View style={styles.profileSectionBackground}>
      <View style={styles.profileInfoContainer}>
        <HeaderText>Hello, {name}</HeaderText>
        <Pressable
          onPress={() => {
            navigation.navigate("Profile");
          }}
        >
          <Image source={require("../assets/profile-picture.png")} />
        </Pressable>
      </View>
      <View style={styles.mainButtonContainer}>
        <TextButton
          style={styles.mainButton}
          textStyle={styles.mainButtonText}
          onPress={() => {}}
        >
          All
        </TextButton>

        <TextButton
          style={styles.mainButton}
          textStyle={styles.mainButtonText}
          onPress={() => {
            navigation.navigate("RewardsPage");
          }}
        >
          My Rewards
        </TextButton>

        <TextButton
          style={styles.mainButton}
          textStyle={styles.mainButtonText}
          onPress={() => {}}
        >
          History
        </TextButton>
      </View>
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  listContainer: {
    flex: 1 / 3,
    backgroundColor: "white",
  },
  sectionInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  list: {},
  viewButton: {
    marginTop: "auto",
    width: "30%",
    minHeight: 25,
    backgroundColor: "#E3EAE7",
  },
  viewButtonText: {
    fontSize: 15,
    color: "black",
  },
  sectionItem: {
    backgroundColor: "#ED8356",
    marginHorizontal: 10,
    width: 200,
    height: 100,
    padding: "5%",
    borderRadius: 10,
  },
  profileSectionBackground: {
    width: "100%",
    flex: 1,
    backgroundColor: "#FF8D13",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  listSectionContainer: {
    flex: 3,
  },
  navigationBarContainer: {
    flex: 0.5,
    backgroundColor: "#FF8D13",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginTop: 20,
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
  },
  profileInfoContainer: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: "10%",
  },
  mainButtonContainer: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: 10,
  },
  mainButton: {
    backgroundColor: "#E3EAE7",
    height: "60%",
    minWidth: "20%",
    paddingHorizontal: 20,
    marginTop: 0,
  },
  mainButtonText: {
    color: "#06090C",
  },
});
