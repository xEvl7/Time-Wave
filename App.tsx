import { Provider } from "react-redux";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";

import Navigation from "./src/Navigation";
import store from "./src/store";
import { USER_DATA } from "./src/constants";

export default function App() {
  return (
    <>
      <Provider store={store}>
        <Navigation />
        {/* Reset user data from Secure Store */}
        {/* <Reset /> */}
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
