import { Provider } from "react-redux";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { useFonts } from "expo-font";
import { Provider as PaperProvider } from "react-native-paper";

import Navigation from "./src/Navigation";
import store from "./src/store";
import { USER_DATA } from "./src/constants";
import React from "react";

export default function App() {
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
        <PaperProvider>
          <Navigation />
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
