import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import firestore, { firebase } from "@react-native-firebase/firestore";
import { DateTime } from "luxon";

// Define the shape of the scanned data
export type ScannedDataProps = {
  data: string;
  scanTime: any;
};

// export const fetchScannedActivities = createAsyncThunk(
//   'community/fetchScannedActivities',
//   async (userId: string) => {
//     const scannedActivitiesSnapshot = await firestore()
//       .collection('ActivityHistory')
//       .where('userId', '==', userId)
//       .get();

//     const activities = scannedActivitiesSnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     return activities;
//   }
// );

export const storeScannedData = createAsyncThunk(
  "user/storeScannedData",
  async (scannedData: ScannedDataProps, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any; // Adjust according to your state type
      const currentUser = state.user.data;

      if (!currentUser) {
        throw new Error("Current user data not available.");
      }

      // Get the user's timezone (assuming it's stored in the user's preferences or system default)
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Convert current timestamp to the user's timezone using Luxon
      const userTime = DateTime.now().setZone(userTimeZone);

      // Prepare the scanned data with the scan time adjusted for the user's timezone
      const scannedDataWithTime = {
        ...scannedData,
        scanTime: firebase.firestore.Timestamp.fromDate(userTime.toJSDate()), // Convert Luxon DateTime to Firestore Timestamp
      };

      // Add the scanned data to the Firestore collection
      const userCollection = firestore().collection("Users");
      const querySnapshot = await userCollection
        .where("uid", "==", currentUser.uid)
        .get();

      if (!querySnapshot.empty) {
        // 获取文档的引用
        const userDocRef = querySnapshot.docs[0].ref;

        // 添加数据到子集合 "Activities"
        await userDocRef.collection("Activities").add(scannedDataWithTime);
        // await userDocRef.collection("Activities").add(scannedData);
        console.log("Data added to user's Activities collection.");
      } else {
        console.log("User not found.");
      }

      return scannedData;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

const scannedDataSlice = createSlice({
  name: "scannedData",
  initialState: [] as ScannedDataProps[],
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(storeScannedData.pending, () => {
        console.log("Storing scanned data ...");
      })
      .addCase(
        storeScannedData.fulfilled,
        (state, action: PayloadAction<ScannedDataProps>) => {
          console.log(`Successfully stored scanned data.`);
          state.push(action.payload);
        }
      )
      .addCase(storeScannedData.rejected, (_, action) => {
        console.error(action.error);
      });
  },
});

export default scannedDataSlice.reducer;
