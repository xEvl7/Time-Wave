import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import firestore from "@react-native-firebase/firestore";
import * as SecureStore from "expo-secure-store";
import { USER_DATA } from "../constants";
import { RootState } from "../store";
import { DateTime } from "luxon";

type UserData = {
  uid: string;
  name: string;
  identityCardNumber: string;
  phoneNumber: string;
  emailAddress: string;
  points: number;
};

type UserContributionData = {
  [month: string]: {
    totalContrHours: number;
    updatedDate: any;
  };
};

interface UserContribution {
  // year: string;
  month: string;
  totalContrHours: number;
  updatedDate: any;
}

type PointsReceivedData = {
  date: any;
  time: any;
  points: number;
};

type PointsReceivedData2 = {
  date: any;
  points: number;
};

type PointsUsedData = {
  date: any;
  time: any;
  points: number;
};

type UserState = {
  data?: UserData;
  contributionData?: { [year: string]: UserContributionData };
  pointsReceivedData?: PointsReceivedData[];
  pointsUsedData?: PointsUsedData[];
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

// 定义用于清除用户数据的 Redux Thunk 函数
export const clearUserData = createAsyncThunk(
  "user/clearUserData",
  async () => {
    await SecureStore.deleteItemAsync(USER_DATA);
  }
);

export const fetchUserContributionData = createAsyncThunk(
  "user/fetchUserContributionData",
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

    const userDocument = querySnapshot.docs[0];
    const userContributionCollection = await userDocument.ref
      .collection("Contributions")
      .get();

    const contributionData: { [year: string]: UserContributionData } = {} as {
      [year: string]: UserContributionData;
    };

    userContributionCollection.forEach((doc) => {
      const year = doc.id;
      const monthData = doc.data() as UserContributionData;

      // Convert Date to string
      Object.keys(monthData).forEach((month) => {
        monthData[month].updatedDate = monthData[month].updatedDate.toString();
      });

      contributionData[year] = monthData;
    });

    // Check if the keys and values exist before accessing them
    const selectedYear = "2023";
    const selectedMonth = "Dec";

    if (
      contributionData[selectedYear] &&
      contributionData[selectedYear][selectedMonth]
    ) {
      const totalContrHours =
        contributionData[selectedYear][selectedMonth].totalContrHours;

      if (totalContrHours !== undefined) {
        return contributionData;
      }
    }

    throw new Error("Data not available or in the expected format.");
  }
);

export const fetchUserContributionData2 = createAsyncThunk(
  "user/fetchUserContributionData",
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

    const userDocument = querySnapshot.docs[0];
    const userContributionCollection = await userDocument.ref
      .collection("Contributions")
      .get();

    const groupedData: { [year: string]: UserContribution[] } = {};

    userContributionCollection.forEach((doc) => {
      const year = doc.id;
      const monthData = doc.data() as Record<string, UserContribution>;

      Object.keys(monthData).forEach((month) => {
        const contribution = monthData[month];
        if (!groupedData[year]) {
          groupedData[year] = [];
        }
        groupedData[year].push({
          month,
          totalContrHours: contribution.totalContrHours,
          updatedDate: contribution.updatedDate.toDate().toISOString(),
        });
      });
    });

    console.log("groupedData", groupedData);

    return groupedData;
  }
);


export const fetchPointsReceivedData = createAsyncThunk(
  "user/fetchPointsReceivedData",
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

    const userDocument = querySnapshot.docs[0];
    const PointsReceivedCollection = await userDocument.ref
      .collection("PointsReceived")
      .orderBy("date", "desc")
      .get();

    const activities: PointsReceivedData[] = [];

    // Iterate over each document in the "PointsReceived" sub-collection
    PointsReceivedCollection.forEach((doc) => {
      const firestoreTimestamp = doc.data().date; // Assuming this is the Timestamp field
      const timestamp = new Date(
        firestoreTimestamp.seconds * 1000 + firestoreTimestamp.nanoseconds / 1e6
      );

      const luxonDateTime =
        DateTime.fromJSDate(timestamp).setZone("Asia/Singapore");

      const pointsReceivedData: PointsReceivedData = {
        date: luxonDateTime.toFormat("EEE, d LLL yyyy"), // "Sun, 6 Aug 2023"
        time: luxonDateTime.toFormat("hh:mm a"), // "11:00 AM"
        points: doc.data().points,
      };

      activities.push(pointsReceivedData);
    });

    // Return the array of PointsReceivedData
    return activities;
  }
);

export const fetchPointsUsedData = createAsyncThunk(
  "user/fetchPointsUsedData",
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

    const userDocument = querySnapshot.docs[0];
    const PointsUsedCollection = await userDocument.ref
      .collection("PointsUsed")
      .orderBy("date", "desc")
      .get();

    const activities: PointsUsedData[] = [];

    // Iterate over each document in the "PointsUsed" sub-collection
    PointsUsedCollection.forEach((doc) => {
      const firestoreTimestamp = doc.data().date; // Assuming this is the Timestamp field
      const timestamp = new Date(
        firestoreTimestamp.seconds * 1000 + firestoreTimestamp.nanoseconds / 1e6
      );

      const luxonDateTime =
        DateTime.fromJSDate(timestamp).setZone("Asia/Singapore");

      const pointsUsedData: PointsUsedData = {
        date: luxonDateTime.toFormat("EEE, d LLL yyyy"), // "Sun, 6 Aug 2023"
        time: luxonDateTime.toFormat("hh:mm a"), // "11:00 AM"
        points: doc.data().points,
      };

      activities.push(pointsUsedData);
    });

    // Return the array of PointsUsedData
    return activities;
  }
);

export const storePointsReceivedDataToFirebase = createAsyncThunk(
  "user/storePointsReceivedDataToFirebase",
  async (
    pointsReceivedData: PointsReceivedData2,
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState; // Explicitly define the type
      const currentUser = state.user.data;

      if (!currentUser) {
        throw new Error("Current user data not available.");
      }

      // Convert Date to Firestore Timestamp
      const firestoreTimestamp = firestore.Timestamp.fromDate(
        pointsReceivedData.date
      );

      // Add other fields as needed
      const serializedPointsReceivedData = {
        date: firestoreTimestamp,
        points: pointsReceivedData.points,
      };

      // Target the specific user document and PointsReceived subcollection
      const userDocumentRef = firestore()
        .collection("Users")
        .doc(currentUser.uid);

      await userDocumentRef
        .collection("PointsReceived")
        .add(serializedPointsReceivedData);

      return pointsReceivedData;
    } catch (error) {
      // Explicitly type the error variable
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";

      return rejectWithValue(errorMessage);
    }
  }
);

export const logOut = () => ({
  type: "user/logOut",
});

const initialState = {} as UserState;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logOut(state, action) {
      return initialState;
    },
  },
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
        fetchUserContributionData.fulfilled,
        (
          state,
          action: PayloadAction<{ [year: string]: UserContributionData }>
        ) => {
          state.contributionData = action.payload;
          console.log(`Successfully fetched User Contribution's data`);
        }
      )
      .addCase(fetchUserContributionData.rejected, (_, action) => {
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
      )
      .addCase(
        fetchPointsReceivedData.fulfilled,
        (state, action: PayloadAction<PointsReceivedData[]>) => {
          state.pointsReceivedData = action.payload;
          console.log(action.payload);
          console.log(`Successfully fetched User Points Received's data`);
        }
      )
      .addCase(fetchPointsReceivedData.rejected, (_, action) => {
        console.error(action.error);
      })
      .addCase(
        fetchPointsUsedData.fulfilled,
        (state, action: PayloadAction<PointsUsedData[]>) => {
          state.pointsUsedData = action.payload;
          console.log(action.payload);
          console.log(`Successfully fetched User Points Used's data`);
        }
      )
      .addCase(
        storePointsReceivedDataToFirebase.fulfilled,
        (state, action: PayloadAction<PointsReceivedData2>) => {
          // Update your state if needed
          // state.pointsReceivedData = [...state.pointsReceivedData, action.payload];
          console.log("Successfully stored points received data to Firebase");
        }
      )
      .addCase(storePointsReceivedDataToFirebase.rejected, (_, action) => {
        console.error(action.error);
      })
      .addCase(fetchPointsUsedData.rejected, (_, action) => {
        console.error(action.error);
      });
  },
});

const selectUserName = (state: RootState) => {
  if (state.user.data) return state.user.data.name;

  console.warn("User's data is null or undefined.");
  return "";
};

export { selectUserName };

export default userSlice.reducer;
