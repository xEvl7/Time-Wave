import { Provider } from "react-redux";
import { useEffect, useRef } from "react";
import * as SecureStore from "expo-secure-store";
import { useFonts } from "expo-font";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

import Navigation from "./src/Navigation";
import store from "./src/store";
import { USER_DATA } from "./src/constants";
import React from "react";
import { Alert, Linking } from "react-native";
import { NavigationContainerRef } from "@react-navigation/native";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#000",
    accent: "#FFB26B",
    background: "#FFF",
    surface: "#FFFFFF",
    text: "#000",
    placeholder: "#888",
    outline: "#888",
  },
};

export default function App() {
  const navigationRef = useRef<NavigationContainerRef<any> | null>(null);

  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;
      if (url.startsWith("timewave://reward/")) {
        const rewardId = url.replace("timewave://reward/", "");
        if (navigationRef.current) {
          navigationRef.current.navigate("Reward", { item: { RID: rewardId } });
        } else {
          Alert.alert(
            "Navigation Error",
            "App is not ready for navigation yet."
          );
        }
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => subscription.remove();
  }, []);

  useFonts({
    "Roboto-Bold": require("./src/assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Light": require("./src/assets/fonts/Roboto-Light.ttf"),
    "Roboto-Regular": require("./src/assets/fonts/Roboto-Regular.ttf"),
    "Playwrite-Regular": require("./src/assets/fonts/PlaywriteCOGuides-Regular.ttf"),
    "Jersey15-Regular": require("./src/assets/fonts/Jersey15-Regular.ttf"),
  });

  return (
    <>
      <Provider store={store}>
        <PaperProvider theme={theme}>
          <Navigation navigationRef={navigationRef} />
          {/* <Navigation /> */}

          {/* Reset user data from Secure Store */}
          {/* <Reset /> */}
        </PaperProvider>
      </Provider>
    </>
  );
}

const Reset = () => {
  useEffect(() => {
    const DeleteUser = async () => {
      await SecureStore.deleteItemAsync(USER_DATA);
      console.log("Reset user's data.");
    };

    DeleteUser();
  }, []);

  return <></>;
};
