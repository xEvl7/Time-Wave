import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import firestore, { firebase } from "@react-native-firebase/firestore";

// Define the shape of the scanned data
export type ScannedDataProps = {
  data: string;
  scanTime: any;
};

export const storeScannedData = createAsyncThunk(
  "user/storeScannedData",
  async (scannedData: ScannedDataProps, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any; // Adjust according to your state type
      const currentUser = state.user.data;

      if (!currentUser) {
        throw new Error("Current user data not available.");
      }

      // Add the scanned data to the Firestore collection
      const userCollection = firestore().collection("Users");
      const querySnapshot = await userCollection
        .where("uid", "==", currentUser.uid)
        .get();
      
      if (!querySnapshot.empty) {
        // 获取文档的引用
        const userDocRef = querySnapshot.docs[0].ref;
      
        // 添加数据到子集合 "Activities"
        await userDocRef.collection("Activities").add({
          ...scannedData,
          scanTime: firebase.firestore.Timestamp.now(), // 使用 Firebase Timestamp
        });
        // await userDocRef.collection("Activities").add(scannedData);
        console.log("Data added to user's Activities collection.");
      } else {
        console.log("User not found.");
      }      

      return scannedData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
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
