import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import firestore from "@react-native-firebase/firestore";
import * as SecureStore from "expo-secure-store";
import { USER_DATA } from "../constants";
import { RootState } from "../store";
import { DateTime } from "luxon";

{
  /* @todo Auto add creator to admin list */
}
export type ActivityProps = {
  item:any;
  id: string;
  logo?: string;
  name: string;
  description: string;
  // tac: string;
  location:string;
  createdBy?: string;
  communityId: string;
  endDate?: string | null; // User-chosen end date (ISO string)
  postedDate: string; // Automatically set at creation (ISO string)
};

interface ActivityState {
  activities: ActivityProps[];
  loading: boolean;
  error: string | null;
  selectedActivityId: string | null;
}

const initialState: ActivityState = {
  activities: [],
  loading: false,
  error: null,
  selectedActivityId: null, // Initialize with null
};

export const createActivity = createAsyncThunk(
  "activity/createActivity",
  async (activityInfo: ActivityProps) => {
    await firestore().collection("Activities").add(activityInfo);
    return activityInfo;
  }
);

// Fetch all activities
export const fetchActivities = createAsyncThunk(
  "activity/fetchActivities",
  async () => {
    const snapshot = await firestore().collection("Activities").get();
    const activities = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ActivityProps[];
    return activities;
  }
);



// Check if activity is an activity of any community
// export const checkUserAdmin = createAsyncThunk(
//   "community/checkUserAdmin",
//   async (uid: string) => {
//     const snapshot = await firestore().collection("Communities").get();
//     const communities = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     })) as ActivityProps[];

//     // console.log("communities",communities);
//     const community = communities.find((community) =>
//       community.admins.includes(uid)
//     );
//     console.log("community",community);
//     // Return the community document ID or null
//     return community ? community.id : null;
//   }
// );

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(createActivity.pending, () => {
        console.log("Creating activity ...");
      })
      .addCase(
        createActivity.fulfilled,
        (state, action: PayloadAction<ActivityProps>) => {
          console.log(`Successfully created ${action.payload.name} activity.`);

          state.activities.push(action.payload);
        }
      )
      .addCase(createActivity.rejected, (_, action) => {
        console.error(action.error);
      })
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchActivities.fulfilled,
        (state, action: PayloadAction<ActivityProps[]>) => {
          state.activities = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch communities";
      })
      // .addCase(checkUserAdmin.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(
      //   checkUserAdmin.fulfilled,
      //   (state, action: PayloadAction<string | null>) => {
      //     state.loading = false;
      //     state.selectedCommunityId = action.payload;
      //   }
      // )
      // .addCase(checkUserAdmin.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error =
      //     action.error.message ?? "Failed to check user admin status";
      // });
  },
});

export default activitySlice.reducer;
