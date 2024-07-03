import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import firestore from "@react-native-firebase/firestore";

{
  /* @todo Auto add creator to admin list */
}
export type CommunityProps = {
  name: string;
  description: string;
  admins: string[];
};

export const createCommunity = createAsyncThunk(
  "community/createCommunity",
  async (communityInfo: CommunityProps) => {
    await firestore().collection("Communities").add(communityInfo);

    return communityInfo;
  }
);

// export const storeScanInDataToFirebase = createAsyncThunk(
//   "user/storeScanInDataToFirebase",
//   async (
//     pointsReceivedData: PointsReceivedData2,
//     { getState, rejectWithValue }
//   ) => {
//     try {
//       const state = getState() as RootState; // Explicitly define the type
//       const currentUser = state.user.data;

//       if (!currentUser) {
//         throw new Error("Current user data not available.");
//       }

//       // Convert Date to Firestore Timestamp
//       const firestoreTimestamp = firestore.Timestamp.fromDate(
//         pointsReceivedData.date
//       );

//       // Add other fields as needed
//       const serializedPointsReceivedData = {
//         date: firestoreTimestamp,
//         points: pointsReceivedData.points,
//       };

//       // Target the specific user document and PointsReceived subcollection
//       const userDocumentRef = firestore()
//         .collection("Users")
//         .doc(currentUser.uid);

//       await userDocumentRef
//         .collection("PointsReceived")
//         .add(serializedPointsReceivedData);

//       return pointsReceivedData;
//     } catch (error) {
//       // Explicitly type the error variable
//       const errorMessage =
//         error instanceof Error ? error.message : "An error occurred";

//       return rejectWithValue(errorMessage);
//     }
//   }
// );

const communitySlice = createSlice({
  name: "community",
  initialState: [] as CommunityProps[],
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(createCommunity.pending, () => {
        console.log("Creating community ...");
      })
      .addCase(
        createCommunity.fulfilled,
        (state, action: PayloadAction<CommunityProps>) => {
          console.log(`Successfully created ${action.payload.name} community.`);

          state.push(action.payload);
        }
      )
      .addCase(createCommunity.rejected, (_, action) => {
        console.error(action.error);
      });
  },
});

export default communitySlice.reducer;
