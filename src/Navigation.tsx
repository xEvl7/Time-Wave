import React, { useEffect, useState } from "react";
import { Image, StyleSheet } from "react-native";
import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import { useAppDispatch, useAppSelector } from "./hooks";
import { RootStackParamList, BottomTabParamList } from "./Screen.types";
import firestore from "@react-native-firebase/firestore";

import Welcome from "./screens/Welcome";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import AppInfo from "./screens/AppInfo";
import Benefits from "./screens/Benefits";
import DisclaimerPrivacy from "./screens/DisclaimerPrivacy";
import ForgotPassword from "./screens/ForgotPassword";
import ScanPage from "./screens/ScanPage";
import QrCodePage from "./screens/QrCodePage";
import CreateCommunity from "./screens/CreateCommunity";
import SelectAdmin from "./screens/SelectAdmin";
import CommunityInfo from "./screens/CommunityInfo";
import Communities from "./screens/Communities";
import ActivityInfo from "./screens/ActivityInfo";
import ProfileInfo from "./screens/ProfileInfo";
import ActivitySeeAll from "./screens/ActivitySeeAll";
import CreateActivity from "./screens/CreateActivity";
import EditActivity from "./screens/EditActivity";
import OngoingActivities from "./screens/OngoingActivities";
import CommunityProfile from "./screens/CommunityProfile";
import MemberSeeAll from "./screens/MemberSeeAll";
import AddAdmin from "./screens/AddAdmin";
import NewProfile from "./screens/NewProfile";
import Setting from "./screens/Setting";
import ChangeYourPassword from "./screens/ChangeYourPassword";
import EditProfile from "./screens/EditProfile";
import Reward from "./screens/Reward";
import Account from "./screens/Account";
import PointsHistory from "./screens/PointsHistory";
import PointsPolicy from "./screens/PointsPolicy";
import ContributionsHistory from "./screens/ContributionsHistory";
import RewardsDetailsPage from "./screens/RewardsDetailsPage";
import AdminControl from "./screens/AdminControl";
import ActivityHistory from "./screens/ActivityHistory";
import GoogleFormScreen from "./screens/GoogleFormScreen";
import { loadUserDataFromStore } from "./features/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Lazy load screens
const HomePage = React.lazy(() => import("./screens/HomePage"));
const RecentActivities = React.lazy(() => import("./screens/RecentActivities"));
const TimeBankRewardsPage = React.lazy(
  () => import("./screens/TimeBankRewardsPage")
);
const Profile = React.lazy(() => import("./screens/Profile"));

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
          let iconName: string = ""; // Ensure iconName is always a string
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
                source={
                  logo ? { uri: logo } : require("./assets/profile-picture.png")
                }
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

type NavigationProps = {
  navigationRef: React.RefObject<NavigationContainerRef<any>>;
};

const renderSignedInScreens = () => (
  <>
    <Stack.Screen
      name="HomeTabs"
      component={TabNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="AppInfo2"
      component={AppInfo}
      options={{ title: "App Info" }}
    />
    <Stack.Screen
      name="Benefits"
      component={Benefits}
      options={{ title: "Benefits" }}
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
      component={Reward}
      options={{
        title: "Reward Details",
      }}
    />
    <Stack.Screen
      name="GoogleFormScreen"
      component={GoogleFormScreen}
      options={{
        title: "Google Form Screen",
      }}
    />
    <Stack.Screen name="NewProfile" component={NewProfile} />
    <Stack.Screen name="Setting" component={Setting} />
    <Stack.Screen name="ChangeYourPassword" component={ChangeYourPassword} />
    <Stack.Screen name="EditProfile" component={EditProfile} />
    <Stack.Screen name="Communities" component={Communities} />
    <Stack.Screen name="ActivitySeeAll" component={ActivitySeeAll} />
    <Stack.Screen name="CommunityProfile" component={CommunityProfile} />
    <Stack.Screen name="MemberSeeAll" component={MemberSeeAll} />
    <Stack.Screen name="AddAdmin" component={AddAdmin} />
    <Stack.Screen name="ActivityInfo" component={ActivityInfo} />
    <Stack.Screen name="ProfileInfo" component={ProfileInfo} />
    <Stack.Screen name="OngoingActivities" component={OngoingActivities} />
    <Stack.Screen name="CreateActivity" component={CreateActivity} />
    <Stack.Screen name="EditActivity" component={EditActivity} />
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
    <Stack.Screen name="RecentActivities" component={RecentActivities} />
    <Stack.Screen name="ActivityHistory" component={ActivityHistory} />
    <Stack.Screen
      name="TimeBankRewardsPage"
      component={TimeBankRewardsPage}
      options={{
        title: "Time Bank Rewards Page",
      }}
    />
  </>
);

const renderAuthScreens = () => (
  <>
    <Stack.Screen
      name="Welcome"
      component={Welcome}
      // options={{headerShown: false,}}
    />
    <Stack.Screen name="LogIn" component={Login} />
    <Stack.Screen name="SignUp" component={SignUp} />
    <Stack.Screen name="DisclaimerPrivacy" component={DisclaimerPrivacy} />
    <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
  </>
);

const Navigation: React.FC<NavigationProps> = ({ navigationRef }) => {
  const dispatch = useAppDispatch();
  const isSignedIn = useAppSelector((state) => state.user.data) !== undefined;

  const [hasSeenAppInfo, setHasSeenAppInfo] = useState<boolean | null>(null);

  useEffect(() => {
    const checkHasSeenAppInfo = async () => {
      const value = await AsyncStorage.getItem("hasSeenAppInfo");
      console.log("hasSeenAppInfo before: ", value);
      setHasSeenAppInfo(value === "true"); // 确保转换成布尔值
    };

    checkHasSeenAppInfo();
  }, []);

  useEffect(() => {
    dispatch(loadUserDataFromStore());
  }, [dispatch]);

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar />
      <Stack.Navigator
        initialRouteName={isSignedIn ? "HomeTabs" : "Welcome"} // 根据状态设置初始路由
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
            {/* 动态添加 AppInfo */}
            {!hasSeenAppInfo && (
              <Stack.Screen
                name="AppInfo"
                component={AppInfo}
                options={{ title: "App Info" }}
              />
            )}
            {/* 渲染其他已登录用户的屏幕 */}
            {renderSignedInScreens()}
          </>
        ) : (
          // 渲染未登录用户的屏幕
          renderAuthScreens()
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
  },
});
