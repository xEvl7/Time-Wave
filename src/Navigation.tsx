import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

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
import { StatusBar } from "expo-status-bar";
import SelectAdmin from "./screens/SelectAdmin";
import { RootStackParamList } from "./Screen.types";
import { useAppDispatch, useAppSelector } from "./hooks";
import { loadUserDataFromStore } from "./features/userSlice";
import Profile from "./screens/Profile";
import CommunityInfo from "./screens/CommunityInfo";
import RewardsDetail from "./screens/RewardsDetail";
import TimeBankRewardsPage from "./screens/TimeBankRewardsPage";
import ActiveRewardsPage from "./screens/ActiveRewardsPage";
import ActiveRewardsDetailsPage from "./screens/ActiveRewardsDetailsPage";
import MyRewardsPage from "./screens/MyRewardsPage";
import MyRewardsDetailsPage from "./screens/MyRewardsDetailsPage";
import PastRewardsPage from "./screens/PastRewardsPage";
import PastRewardsDetailsPage from "./screens/PastRewardsDetailsPage";
import CommunityPage from "./screens/CommunityPage";
import MedicalServicesPage from "./screens/MedicalServicesPage";

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  const dispatch = useAppDispatch();
  const isSignedIn = useAppSelector((state) => state.user.data) !== undefined;

  useEffect(() => {
    dispatch(loadUserDataFromStore());
  }, []);

  return (
    <NavigationContainer>
      <StatusBar />
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#FF8D13",
          },
          headerTintColor: "#F6F6F6",
          headerShadowVisible: false,
        }}
      >
        {isSignedIn ? (
          <>
            <Stack.Group screenOptions={{ presentation: "modal" }}>
              <Stack.Screen name="AppInfo" component={AppInfo} />
              <Stack.Screen name="Benefits" component={Benefits} />
            </Stack.Group>
            <Stack.Screen name="HomePage" component={HomePage} />
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
            <Stack.Screen name="TimeBankRewardsPage" component={TimeBankRewardsPage} />
            <Stack.Screen name="ActiveRewardsPage" component={ActiveRewardsPage} />
            <Stack.Screen name="ActiveRewardsDetailPage" component={ActiveRewardsDetailsPage} />
            <Stack.Screen name="MyRewardsPage" component={MyRewardsPage} />
            <Stack.Screen name="MyRewardsDetailsPage" component={MyRewardsDetailsPage} />
            <Stack.Screen name="PastRewardsPage" component={PastRewardsPage} />
            <Stack.Screen name="PastRewardsDetailsPage" component={PastRewardsDetailsPage} />
            <Stack.Screen name="CommunityPage" component={CommunityPage} />
            <Stack.Screen name="MedicalServicesPage" component={MedicalServicesPage} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
