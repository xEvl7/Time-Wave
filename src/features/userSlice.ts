import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import firestore from "@react-native-firebase/firestore";
import * as SecureStore from "expo-secure-store";
import { USER_DATA } from "../constants";
import { RootState } from "../store";

type UserData = {
  uid: string;
  name: string;
  identityCardNumber: string;
  phoneNumber: string;
  emailAddress: string;
};

type UserState = {
  data?: UserData;
};

export const updateUserData = createAsyncThunk(
  "user/updateUserData",
  async (userData: UserData) => {
    console.log(`Caching ${userData.name}'s data to Secure Store ...`);

    await SecureStore.setItemAsync(USER_DATA, JSON.stringify(userData));

    console.log(`Saved ${userData.name}'s data to Secure Store.`);

    return userData;
  }
);

export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (emailAddress: string) => {
    const querySnapshot = await firestore()
      .collection("Users")
      .where("emailAddress", "==", emailAddress)
      .get();

    if (querySnapshot.size !== 1) {
      throw new Error(
        `${emailAddress} Either has no data or more than 1 data.`
      );
    }

    const userData = querySnapshot.docs[0].data() as UserData;

    await SecureStore.setItemAsync(USER_DATA, JSON.stringify(userData));
    return userData;
  }
);

export const loadUserDataFromStore = createAsyncThunk(
  "user/loadUserDataFromCache",
  async () => {
    let userDataJson: string | null = (await SecureStore.getItemAsync(
      USER_DATA
    )) as string | null;

    if (userDataJson) return JSON.parse(userDataJson);
    return userDataJson;
  }
);

const initialState = {} as UserState;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(
        fetchUserData.fulfilled,
        (state, action: PayloadAction<UserData>) => {
          state.data = action.payload;

          console.log(`Successfully fetched ${state.data.name}'s data`);
        }
      )
      .addCase(fetchUserData.rejected, (_, action) => {
        console.error(action.error);
      })
      .addCase(
        loadUserDataFromStore.fulfilled,
        (state, action: PayloadAction<UserData | null>) => {
          if (action.payload) {
            state.data = action.payload;
            console.log(
              `Successfully Loaded ${state.data.name}'s data from Secure Store.`
            );
          } else console.log("User data is undefined.");
        }
      )
      .addCase(loadUserDataFromStore.rejected, () => {
        console.log("User data is undefined.");
      })
      .addCase(loadUserDataFromStore.pending, () => {
        console.log("Loading user's data from cache ...");
      })
      .addCase(
        updateUserData.fulfilled,
        (state, action: PayloadAction<UserData>) => {
          state.data = action.payload;
        }
      );
  },
});

const selectUserName = (state: RootState) => {
  if (state.user.data) return state.user.data.name;

  console.warn("User's data is null or undefined.");
  return "";
};

export { selectUserName };

export default userSlice.reducer;
