import React, { useEffect ,useState} from "react";
import { Image, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import { useAppDispatch, useAppSelector } from "./hooks";
import { loadUserDataFromStore } from "./features/userSlice";
import { RootStackParamList, BottomTabParamList } from "./Screen.types";
import firestore from "@react-native-firebase/firestore";

import Welcome from "./screens/Welcome";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import AppInfo from "./screens/AppInfo";
import Benefits from "./screens/Benefits";
import HomePage from "./screens/HomePage";
import DisclaimerPrivacy from "./screens/DisclaimerPrivacy";
import ForgotPassword from "./screens/ForgotPassword";
import ScanPage from "./screens/ScanPage";
import QrCodePage from "./screens/QrCodePage";
import CreateCommunity from "./screens/CreateCommunity";
import SelectAdmin from "./screens/SelectAdmin";
import Profile from "./screens/Profile";
import CommunityInfo from "./screens/CommunityInfo";

import Communities from "./screens/Communities";
import ActivityInfo from "./screens/ActivityInfo";
import ProfileInfo from "./screens/ProfileInfo";
import ActivitySeeAll from "./screens/ActivitySeeAll";
import OngoingActivities from "./screens/OngoingActivities";
import CommunityProfile from "./screens/CommunityProfile";

import NewProfile from "./screens/NewProfile";
import Setting from "./screens/Setting";
import ChangeYourPassword from "./screens/ChangeYourPassword";
import EditProfile from "./screens/EditProfile";
import reward from "./screens/reward";
import Account from "./screens/Account";
import PointsHistory from "./screens/PointsHistory";
import PointsPolicy from "./screens/PointsPolicy";
import ContributionsHistory from "./screens/ContributionsHistory";
import RewardsDetailsPage from "./screens/RewardsDetailsPage";
import TimeBankRewardsPage from "./screens/TimeBankRewardsPage";
import AdminControl from "./screens/AdminControl";
//import CommunityActivityHistory from "./screens/CommunityActivityHistory";
import ActivityHistory from "./screens/ActivityHistory";
import RecentActivities from "./screens/RecentActivities";

const Tab = createBottomTabNavigator<BottomTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TabNavigator = () => {
  const [logo, setLogo] = useState<string | null>(null);
  const emailAddress = useAppSelector((state) => state.user.data?.emailAddress);
   // 从 Firestore 获取用户头像
   useEffect(() => {
    const unsubscribe = firestore()
      .collection("Users")
      .where("emailAddress", "==", emailAddress)
      .onSnapshot((querySnapshot) => {
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            setLogo(userData.logo); // 实时更新 logo
          });
        }
      });

    return () => unsubscribe(); // 清理订阅
  }, [emailAddress]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Activity") {
            //ActivityHistory
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "Rewards") {
            iconName = focused ? "gift" : "gift-outline";
          } else if (route.name === "Profile") {
            // iconName = focused ? "person" : "person-outline";
            return (
              <Image
                source={logo ? { uri: logo } : require("./assets/profile-picture.png")}
                style={[
                  styles.profileIcon,
                  { borderColor: focused ? "#FF8D13" : "transparent" },
                ]}
              />
            );
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#FF8D13",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#FFF",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          paddingBottom: 5,
          height: 60,
        },
        // headerShown: false, // Hide the header
        // headerStyle: {
        //   backgroundColor: "#FF8D13",
        // },
        // headerTintColor: "#F6F6F6", // Set the color for the back button
        // headerShadowVisible: false,
        // headerTitleStyle: {
        //   color: "#FFFFFF", // Set the color for the header text
        // },
        // headerTitleAlign: "center",
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Activity"
        component={RecentActivities}
        options={{ headerShown: true }}
      />
      <Tab.Screen
        name="Rewards"
        component={TimeBankRewardsPage}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

const Navigation = () => {
  const dispatch = useAppDispatch();
  const isSignedIn = useAppSelector((state) => state.user.data) !== undefined;

  useEffect(() => {
    dispatch(loadUserDataFromStore());
  }, [dispatch]);

  return (
    <NavigationContainer>
      <StatusBar />
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#FF8D13",
          },
          headerTintColor: "#F6F6F6", // Set the color for the back button
          headerShadowVisible: false,
          headerTitleStyle: {
            color: "#FFFFFF", // Set the color for the header text
          },
          headerTitleAlign: "center",
        }}
      >
        {isSignedIn ? (
          <>
            <Stack.Group screenOptions={{ presentation: "modal" }}>
              <Stack.Screen name="AppInfo" component={AppInfo} />
              <Stack.Screen name="Benefits" component={Benefits} />
            </Stack.Group>

            <Stack.Screen
              name="HomeTabs"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ScanPage"
              component={ScanPage}
              options={{ title: "Scan QR Code" }}
            />
            <Stack.Screen
              name="QrCodePage"
              component={QrCodePage}
              options={{ title: "Show QR Code" }}
            />
            <Stack.Screen
              name="AdminControl"
              component={AdminControl}
              options={{ title: "Admin Panel" }}
            />
            <Stack.Screen
              name="CreateCommunity"
              component={CreateCommunity}
              options={{
                title: "Create a community",
              }}
            />
            <Stack.Screen
              name="SelectAdmin"
              component={SelectAdmin}
              options={{
                title: "Select admin",
              }}
            />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="CommunityInfo" component={CommunityInfo} />
            <Stack.Screen
              name="Reward"
              component={reward}
              options={{
                title: "Reward",
              }}
            />
            <Stack.Screen name="NewProfile" component={NewProfile} />
            <Stack.Screen name="Setting" component={Setting} />
            <Stack.Screen
              name="ChangeYourPassword"
              component={ChangeYourPassword}
            />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="Communities" component={Communities} />
            <Stack.Screen name="ActivitySeeAll" component={ActivitySeeAll} />
            <Stack.Screen
              name="CommunityProfile"
              component={CommunityProfile}
            />
            <Stack.Screen name="ActivityInfo" component={ActivityInfo} />
            <Stack.Screen name="ProfileInfo" component={ProfileInfo} />
            <Stack.Screen
              name="OngoingActivities"
              component={OngoingActivities}
            />

            <Stack.Screen
              name="Account"
              component={Account}
              options={{
                title: "Account",
              }}
            />
            <Stack.Screen
              name="PointsHistory"
              component={PointsHistory}
              options={{
                title: "Points History",
              }}
            />
            <Stack.Screen
              name="PointsPolicy"
              component={PointsPolicy}
              options={{
                title: "Points Policy",
              }}
            />
            <Stack.Screen
              name="ContributionsHistory"
              component={ContributionsHistory}
              options={{
                title: "Contributions History",
              }}
            />

            <Stack.Screen
              name="RewardsDetailsPage"
              component={RewardsDetailsPage}
              options={{
                title: "Rewards Details Page",
              }}
            />
            <Stack.Screen
              name="RecentActivities"
              component={RecentActivities}
            />
            <Stack.Screen name="ActivityHistory" component={ActivityHistory} />
            <Stack.Screen
              name="TimeBankRewardsPage"
              component={TimeBankRewardsPage}
              options={{
                title: "Time Bank Rewards Page",
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="LogIn" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen
              name="DisclaimerPrivacy"
              component={DisclaimerPrivacy}
            />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

const styles = StyleSheet.create({
  profileIcon: {
    width: 30,
    height: 30,
    borderRadius: 15, // To make the image circular
    borderWidth: 2, // Add a border width
    // Optional: Add shadow
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    // elevation: 5, // For Android shadow
  },
});
